const path = require('path');
const GasPlugin = require("gas-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './src/Code.ts',
  devtool: false,
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts'
    ],
    alias: {
      '@service': path.resolve(__dirname, 'src/service/'),
      '@util': path.resolve(__dirname, 'src/util/')
    }
  },
  plugins: [
    new GasPlugin()
  ]
};
