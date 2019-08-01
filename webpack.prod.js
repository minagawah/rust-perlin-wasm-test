const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const UglifyJsPlugin = require('uglifyjs-3-webpack-plugin');
const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;
const autoprefixer = require('autoprefixer');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    publicPath: '/minagawah/rust-perlin-wasm-test/',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    }),
    new LicenseWebpackPlugin(),
  ],
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: path.resolve(__dirname, 'node_modules'),
          chunks: 'initial',
          name: 'vendors',
          enforce: true
        },
      }
    },
    minimize: true,
    // minimizer: [
    //   new UglifyJsPlugin({
    //     uglifyOptions: {
    //       output: {
    //         comments: /@license/i,
    //       },
    //       beautify: false,
    //       compress: false,
    //       mangle: false,
    //     },
    //     extractComments: true,
    //   })
    // ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
          compilerOptions: {
            'sourceMap': false,
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              ident: 'postcss',
              plugins: [
                autoprefixer()
              ]
            }
          }
        ]
      },
    ]
  },
});
