const PACKAGE = require('./package.json');

const path = require('path');
const { merge: webpackMerge } = require('webpack-merge');
const { commonConfig } = require('./webpack.config.common');

const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

/**
 * @type {import('webpack').WebpackOptionsNormalized}
 */
const prodConfig = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'public'),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: true,
        },
      }),
    ],
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin({
      // root 指向 output path
      // 如需處理 root 以外的路徑，無法使用相對路徑，請改用 path.resolve(__dirname, 'targetPath') 來指向
      cleanOnceBeforeBuildPatterns: [
        '*',
        // 以下為需排除的項目，須在開頭加上 "!"
        // '!assets/**',
        // '!index.php',
        // '!api/**',
        // '!admin/**',
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src', 'assets'),
          to: './assets',
        },
      ],
    }),
  ],
};

module.exports = webpackMerge(commonConfig, prodConfig);
