const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const prod = process.argv[4] === 'production';

config = {
  mode: prod ? 'production' : 'development',
  entry: ['./dev/js/App.js'],
  output: {
    path: path.resolve(__dirname, 'public/js/'),
    filename: 'scripts.js',
  },
  devtool: !prod && 'eval-cheap-module-source-map',
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
