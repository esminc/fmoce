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
      '@': path.resolve(__dirname, 'src/'),
      '@service': path.resolve(__dirname, 'src/service/'),
      '@constant': path.resolve(__dirname, 'src/constant/')
    }
  },
  plugins: [
    new GasPlugin()
  ]
};
