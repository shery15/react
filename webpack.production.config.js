const webpack = require('webpack');
// 定义了一些文件夹的路径
const path = require('path');

const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(ROOT_PATH, 'source');
const BUILD_PATH = path.resolve(ROOT_PATH, 'docs');
const TEM_PATH = path.resolve(SRC_PATH, 'templates');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const IndexPage = new HtmlWebpackPlugin({
  template: path.resolve(TEM_PATH, 'index.html'),
  filename: 'index.html',
  chunks: ['index', 'commons'],
  inject: 'body'
});

module.exports = {
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.css'
    ]
  },
  entry: {
    index: path.resolve(SRC_PATH, 'index.js')
  },
  output: {
    path: BUILD_PATH,
    filename: 'js/[name].[chunkhash:5].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[path]_[name]_[local]_[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                map: 'inline',
                plugins: () => [
                  require('postcss-import')({ addDependencyTo: webpack }),
                  require('postcss-url')(),
                  require('postcss-cssnext')({
                    features: {
                      autoprefixer: { browsers: [
                        'Android >= 4',
                        'Chrome >= 20',
                        'Firefox >= 24',
                        'Explorer >= 9',
                        'iOS >= 6',
                        'Opera >= 12',
                        'Safari >= 6'
                      ] }
                    }
                  })
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.jpg|\.png|\.woff|\.woff2|\.svg|.eot|\.ttf/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({ banner: '', raw: true, entryOnly: true }),
    new webpack.optimize.UglifyJsPlugin({ minimize: true }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'js/commons.[chunkhash:5].js'
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].[chunkhash:5].css',
      disable: false,
      allChunks: true
    }),
    IndexPage
  ]
};
