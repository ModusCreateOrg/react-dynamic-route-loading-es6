const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const sourcePath = path.join(__dirname, './client');
const staticsPath = path.join(__dirname, './static');

/**
 * Plugins for dev and prod
 */
const plugins = [
  /**
   * Extract vendor libraries into a separate bundle
   */
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: 'vendor.bundle.js'
  }),

  /**
   * Define NODE_ENV.
   * When in production, this creates a smaller and faster bundle
   */
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
  }),

  /**
   * This is how we create index.html
   */
  new HtmlWebpackPlugin({
    title: 'React Router + Webpack 2 + Dynamic Chunk Navigation',
    template: `${sourcePath}/index.ejs`,
  }),
];

/**
 * Additional plugins just for prod
 */
if (isProd) {
  plugins.push(
    /**
     * Options to pass to all loaders
     */
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),

    /**
     * Minify JS
     */
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
    })
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
      'react-dom'
    ]
  },
  output: {
    path: staticsPath,
    filename: 'bundle.js',
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
        use: ['style-loader', 'css-loader', 'sass-loader']
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
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m',
      }
    },
  }
};
