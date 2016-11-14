const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const sourcePath = path.join(__dirname, './client');
const staticsPath = path.join(__dirname, './static');

const extractCSS = new ExtractTextPlugin('style.css');

const plugins = [
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
  }),
  new webpack.optimize.AggressiveSplittingPlugin(),
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
  },

  output: {
    path: staticsPath,
    filename: '[id]-[chunkhash].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.scss$/,
        loaders: isProd ?
          extractCSS.extract({
            fallbackLoader: 'style-loader',
            loader: ['css-loader', 'sass-loader'],
          }) :
          ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: [
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
        loader: 'file-loader'
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
  recordsOutputPath: path.join(__dirname, 'chunk.records.json'),

  stats: {
    assets: true,
    children: false,
    hash: false,
    modules: false,
    publicPath: false,
    timings: true,
    version: false,
    warnings: true,
    colors: {
      yellow: '\u001b[33m',
      green: '\u001b[32m'
    }
  },

  devServer: {
    contentBase: './client',
    historyApiFallback: true,
    inject: true,
    port: 3000,
    compress: isProd,
    stats: { colors: true },
  }
};
