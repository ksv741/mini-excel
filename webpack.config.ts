import * as path from 'path';
import * as webpack from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from "mini-css-extract-plugin";

// FIXME: type of any
const config = (env: Record<string, any>, argv: Record<string, any>): webpack.Configuration => {

  const isProd = argv.mode === 'production';

  const getFilename = (ext: string): string => {
    return `[name]${isProd ? '-[hash]' : ''}.${ext}`;
  }

  const getSourceMap = () => {
    return isProd ? false : 'source-map'
  }

  return {
    context: path.resolve(__dirname, 'src'),
    entry: ['core-js/stable', 'regenerator-runtime/runtime','./index.ts'],
    devtool: getSourceMap(),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: getFilename('js'),
      clean: true
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@core': path.resolve(__dirname, 'src', '@core')
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        minify: false,
        template: './index.html'
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "favicon.ico", to: "./" },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: getFilename('css')
      }),
    ],
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.m?tsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ],
    },
  }
};

export default config;