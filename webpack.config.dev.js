const path = require('path');
const { merge: webpackMerge } = require('webpack-merge');
const { commonConfig, getJSEntryOptions } = require('./webpack.config.common');

const open = require('open');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const service = {
  host: '0.0.0.0',
  port: 60001,
  get url() {
    const host = (this.host === '0.0.0.0') ? `localhost` : this.host;
    const port = (this.port) ? `:${this.port}` : '';

    return `http://${host}${port}`;
  },
};

const devBrowserChromePath = 'D:/chromeTempDevUserProfile';

// const webOrigin = 'https://sample.net/';

/**
 * @type {import('webpack').WebpackOptionsNormalized}
 */
const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    // proxy: [
    //   {
    //     context: [
    //       '/api',
    //     ],
    //     target: webOrigin,
    //     changeOrigin: true,
    //     ws: true,
    //     cookieDomainRewrite: 'localhost',
    //   },
    // ],
    host: service.host,
    port: service.port,
    liveReload: true,
    hot: true,
    onAfterSetupMiddleware() {
      const openURLList = [
        service.url,
      ];

      const browserOptions = {
        app: {
          arguments: [
            `--user-data-dir=${devBrowserChromePath}`,
            '--new-window',
            // '--incognito',
            ...openURLList,
          ],
        },
      };

      open(open.apps.chrome, browserOptions);
    },
  },
  entry: {
    development: getJSEntryOptions('development'),
  },
  plugins: [
  ],
};

(function initDevScript() {
  commonConfig.plugins.forEach((plugin) => {
    if (!(plugin instanceof HtmlWebpackPlugin)) {
      return false;
    }

    plugin.userOptions.chunks.unshift('development');
  })
}());

module.exports = webpackMerge(commonConfig, devConfig);
