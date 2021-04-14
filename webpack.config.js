const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const dev = process.argv[4] === 'development';

config = {
  mode: dev ? 'development' : 'production',
  entry: ['./dev/js/App.js'],
  output: {
    path: path.resolve(__dirname, 'public/js/'),
    filename: 'scripts.js',
  },
  devtool: dev && 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  optimization: {
    // minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        extractComments: {
          condition: 'all',
          // filename(file) {
          //   return `${file}.LICENSE`;
          // },
        },
      }),
    ],
  },
};
module.exports = config;
