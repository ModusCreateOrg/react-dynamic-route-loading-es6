const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const sourcePath = path.join(__dirname, './client');
const staticsPath = path.join(__dirname, './static');

const extractCSS = new ExtractTextPlugin({ filename: 'style.css', disable: false, allChunks: true });

const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: 'vendor.bundle.js'
  }),
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
  }),
  function() {
    const compiler = this;
    const chunkRegEx = /^chunk[.]/;
    compiler.plugin('emit', function(compilation, callback) {
      const chunks = compilation
        .getStats()
        .toJson()
        .assets
        .filter(asset => chunkRegEx.test(asset.name))
        .map(asset => asset.name);

      const json = JSON.stringify(chunks);

      compilation.assets['chunks.json'] = {
        source: () => json,
        size: () => json.length
      };

      callback();
    });
  },
];

if (isProd) {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false
      },
    }),
    extractCSS
  );
}

module.exports = {
  devtool: isProd ? 'source-map' : 'eval',
  context: sourcePath,
  entry: {
    js: [
      'index',
      'pages/Home'
    ],
    vendor: [
      'react',
      'react-dom',
      'react-helmet'
    ]
  },
  output: {
    path: staticsPath,
    filename: 'bundle.js',
    chunkFilename: 'chunk.[chunkhash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'file-loader',
        query: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.scss$/,
        use: isProd ?
          extractCSS.extract(['css-loader', 'sass-loader']) :
          ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.(gif|png|jpg|jpeg\ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: 'file-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      sourcePath,
      'node_modules'
    ]
  },
  plugins: plugins,
  devServer: {
    contentBase: './client',
    historyApiFallback: true,
    inject: true,
    port: 3000,
    compress: isProd,
    stats: { colors: true },
  }
};
