const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  entry: { app: './src/app.ts' },
  target: 'web',
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new ManifestPlugin(),
    new CleanWebpackPlugin(),
    // new CleanWebpackPlugin({
    //   verbose: true,
    //   cleanOnceBeforeBuildPatterns: [
    //     '**/*',
    //     '!.gitkeep',
    //     '!wasm/**'
    //   ],
    // }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/assets',
        to: 'assets',
        ignore: ['.gitkeep'],
      },
    ])
  ],
  stats: {
    colors: true
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
};
