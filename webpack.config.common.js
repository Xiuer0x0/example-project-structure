const webpack = require('webpack');
const path = require('path');

const { merge: webpackMerge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function getJSEntryOptions(filename) {
  /**
   * @type {import('webpack').EntryOptions}
   */
  const options = {
    import: path.resolve(__dirname, 'src', 'script', filename),
    filename: 'script/[name].js',
  };

  return options;
}

/**
 * @param {string} filename
 * @param {HtmlWebpackPlugin.Options} htmlOptions
 */
function getPageOptions(filename, htmlOptions) {
  /**
   * @type {HtmlWebpackPlugin.Options}
   */
  const defaultOptions = {
    template: path.resolve(__dirname, 'src', 'page', `${filename}.hbs`),
    filename: `${filename}.html`,
    chunks: [],
    inject: 'body',
    chunksSortMode: 'manual',
    hash: true,
    minify: {
      removeComments: true,
    },
  };

  /**
   * @type {HtmlWebpackPlugin.Options}
   */
  const htmlWebpackPluginOptions = webpackMerge(defaultOptions, htmlOptions);

  return htmlWebpackPluginOptions;
}

/**
 * @type {import('webpack').WebpackOptionsNormalized}
 */
const config = {
  entry: {
    main: getJSEntryOptions('main'),
    index: getJSEntryOptions('index'),
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        include: path.resolve(__dirname, 'src', 'elements', 'templates'),
        options: {
          sources: false,
          minimize: {
            removeComments: true,
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.svg$/,
        use: 'file-loader'
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
    }),
    new HtmlWebpackPlugin(getPageOptions('index', {
      chunks: ['main', 'index'],
    })),
    new MiniCssExtractPlugin({
      filename() {
        // 將從 js 分離的 CSS 修正檔案輸出的路徑
        const cssOutputPath = 'css/[name].css';
  
        return cssOutputPath;
      },
    }),
  ],
};

module.exports = {
  commonConfig: config,
  getJSEntryOptions,
  getPageOptions,
};
