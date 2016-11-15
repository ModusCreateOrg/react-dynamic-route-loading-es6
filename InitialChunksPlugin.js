/* eslint-disable no-var,strict,vars-on-top */
'use strict';
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var _ = require('lodash');
var path = require('path');

function InitialChunksPlugin(options) {
  // Default options
  this.options = _.extend({
    publicPath: './static'
  }, options);
}

InitialChunksPlugin.prototype.apply = function(compiler) {
  var self = this;

  compiler.plugin('after-emit', function(compilation, callback) {
    var stats = compilation.getStats().toJson();
    var entrypoints = stats.entrypoints.js.assets || [];

    // console.log('stats', Object.keys(stats));
    // console.log('stats', stats.chunks);

    var htmlAsset = stats.assets.find(function(asset) {
      return asset.name.match(/[.]html?$/);
    });

    if (!htmlAsset) {
      return callback();
    }

    var htmlFile = htmlAsset.name;
    var filename = path.resolve(compilation.compiler.context, self.options.publicPath, htmlFile);

    if (self.isHotUpdateCompilation(entrypoints)) {
      return callback();
    }

    var tags = self.createTags(entrypoints);

    // If the template and the assets did not change we don't have to emit the html
    var assetJson = JSON.stringify(entrypoints);
    if (self.options.cache && assetJson === self.assetJson) {
      return callback();
    }

    self.assetJson = assetJson;

    return Promise.props({
      size: fs.statAsync(filename),
      source: fs.readFileAsync(filename, 'utf-8')
    })
    .catch(function() {
      return Promise.reject(new Error('HtmlWebpackPlugin: could not load file ' + filename));
    })
    .then(function(results) {
      return fs.writeFileAsync(filename, self.injectAssetsIntoHtml(results.source, tags));
    }).
    finally(function() {
      callback();
    });
  });
};


InitialChunksPlugin.prototype.isHotUpdateCompilation = function(assets) {
  return assets.length && assets.every(function(name) {
    return /\.hot-update\.js$/.test(name);
  });
};

/**
 * Turn a tag definition into a html string
 */
InitialChunksPlugin.prototype.createTags = function(assets) {
  var tags = this.generateAssetTags(assets);
  return tags.map(function(tagDefinition) {
    var attributes = Object.keys(tagDefinition.attributes || {}).map(function(attributeName) {
      return attributeName + '="' + tagDefinition.attributes[attributeName] + '"';
    });
    return '<' + [tagDefinition.tagName].concat(attributes).join(' ') + (tagDefinition.selfClosingTag ? '/' : '') + '>' +
      (tagDefinition.innerHTML || '') +
      (tagDefinition.closeTag ? '</' + tagDefinition.tagName + '>' : '');
  });
};

/**
 * Injects the assets into the given html string
 */
InitialChunksPlugin.prototype.generateAssetTags = function(assets) {
  // Turn script files into script tags
  return assets.map(function(scriptPath) {
    return {
      tagName: 'script',
      closeTag: true,
      attributes: {
        type: 'text/javascript',
        src: scriptPath
      }
    };
  });
};

/**
 * Injects the assets into the given html string
 */
InitialChunksPlugin.prototype.injectAssetsIntoHtml = function(html, assetTags) {
  var bodyRegExp = /(<\/body>)/i;

  if (assetTags.length) {
    if (bodyRegExp.test(html)) {
      // Append assets to body element
      html = html.replace(bodyRegExp, function(match) {
        return assetTags + match;
      });
    } else {
      // Append scripts to the end of the file if no <body> element exists:
      html += assetTags;
    }
  }

  return html;
};

module.exports = InitialChunksPlugin;
