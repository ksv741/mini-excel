import * as path from 'path';

// FIXME:
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import type { Configuration } from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HappyPack from 'happypack';

// FIXME: type of any
const config = (env: Record<string, any>, argv: Record<string, any>): Configuration => {
  const isProd = argv.mode === 'production';

  const getFilename = (ext: string): string => `[name]${isProd ? '-[hash]' : ''}.${ext}`;
  const getSourceMap = () => (isProd ? false : 'inline-source-map');

  const getPluginList = (): any[] => {
    const basePluginList = [
      new HtmlWebpackPlugin({
        minify: false,
        template: './index.html',
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'favicon.ico', to: './' },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: getFilename('css'),
      }),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: path.resolve(__dirname, 'tsconfig.json'),
        },
      }),
      new HappyPack({
        loaders: [
          {
            path: 'ts-loader',
            query: { happyPackMode: true },
            options: {
              transpileOnly: true,
              diagnosticOptions: {
                semantic: true,
                syntactic: true,
              },
            },
          },
        ],
        threads: 4,
      }),
    ];

    if (!isProd) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return [...basePluginList, new ESLintPlugin({
        extensions: ['ts'],
        failOnError: true,
      })];
    }

    return basePluginList;
  };

  return {
    context: path.resolve(__dirname, 'src'),
    entry: [
      // 'core-js/stable',
      // 'regenerator-runtime/runtime',
      './index.ts',
    ],
    devtool: getSourceMap(),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: getFilename('js'),
      clean: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        '@core': path.resolve(__dirname, 'src/core/'),
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss'],
    },
    plugins: getPluginList(),
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.?ts$/,
          exclude: /(node_modules|bower_components)/,
          use: 'happypack/loader',
        },
      ],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'static'),
      },
      compress: true,
      port: 80,
      watchFiles: './src',
    },
    performance: {
      maxAssetSize: 600000,
    },
  };
};

export default config;
