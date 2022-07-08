import path from 'path';

// FIXME:
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import type { Configuration } from 'webpack';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

// FIXME: type of any
const config = (env: Record<string, any>, argv: Record<string, any>): Configuration => {
  const isProd = argv.mode === 'production';

  const getFilename = (ext: string): string => `[name]${isProd ? '-[fullhash]' : ''}.${ext}`;
  const getSourceMap = () => (isProd ? false : 'cheap-source-map');

  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss'];

  const getPluginList = (): any[] => {
    const basePluginList = [
      new HtmlWebpackPlugin({
        minify: isProd,
        template: './index.html',
      }),

      new CopyWebpackPlugin({
        patterns: [
          { from: 'assets', to: './assets' },
        ],
      }),

      new MiniCssExtractPlugin({
        filename: getFilename('css'),
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
      // 'core-js/actual',
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
      extensions,
      plugins: [new TsconfigPathsPlugin({})],
    },

    plugins: getPluginList(),

    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProd,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: !isProd,
              },
            },
          ],
        },

        {
          test: /\.?ts$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
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
