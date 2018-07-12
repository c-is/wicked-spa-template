const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const globEntries = require('webpack-glob-folder-entries');
const pkg = require('../package.json');

const isDebug = global.DEBUG === false ? false : !process.argv.includes('production');
const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');
const useHMR = !!global.HMR;
const babelConfig = Object.assign({}, pkg.babel, {
  babelrc: false,
  cacheDirectory: useHMR,
  presets: pkg.babel.presets.map(x => x === 'latest' ? ['latest', { es2015: { modules: false } }] : x),
});

console.log(isDebug);

const HtmlWebpackPluginConfig = (globPath) => {
  const entries = globEntries(globPath, true);
  const htmlList = [];
  for (let folder in entries){
    const htmlPath = path.join(__dirname, entries[folder]);
    const filename = entries[folder].replace('src/template/pages/', '');
    const h = new HtmlWebpackPlugin({
      filename,
      inject: true,
      template: `nunjucks-html-loader!${htmlPath}`,
    });
    htmlList.push(h);
  }
  return htmlList;
};

function returnEntries(globPath) {
  const entries = globEntries(globPath, true);
  const folderList = [];
  for (let folder in entries){
     folderList.push(path.join(__dirname, entries[folder]));
  }
  return folderList;
}

const config = {
  mode: process.env.NODE_ENV || 'development',
  // context: path.resolve(__dirname, '../src'),
  entry: '../src/js/index.js',

  output: {
    path: path.resolve(__dirname, '../build'),
    publicPath: isDebug ? `http://localhost:${process.env.PORT || 3000}` : '/',
    filename: isDebug ? '[name].js?[hash]' : '[name].[hash].js',
    chunkFilename: isDebug ? '[id].js?[chunkhash]' : '[id].[chunkhash].js',
    sourcePrefix: '  ',
  },

  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
  },

  // devtool: isDebug ? 'source-map' : false,

  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      __DEV__: isDebug,
    }),

    new AssetsPlugin({
      path: path.resolve(__dirname, '../build/assets/js'),
      filename: 'assets.json',
      prettyPrint: true,
    }),

    new webpack.LoaderOptionsPlugin({
      debug: isDebug,
      minimize: !isDebug,
    }),

    new ExtractTextPlugin({
      filename: isDebug ? '[name].css?[hash]' : '[name].[hash].css',
    }),

    ...HtmlWebpackPluginConfig('../src/template/pages/**/*'),
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '../src/js'),
        ],
        loader: 'babel-loader',
        options: babelConfig,
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, '../src/css'),
        ],
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: isDebug,
              importLoaders: 1,
              modules: true,
              localIdentName: isDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
              minimize: !isDebug,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              config: {
                path: './postcss.config.js',
              },
            },
          },
        ]),
      },
      {
        test: /\.html$|njk|nunjucks/,
        use: ['html-loader', {
          loader: 'nunjucks-html-loader',
          options: {
            searchPaths: [...returnEntries('../src/template/**/')],
          },
        }],
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader',
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: 'svg-inline-loader',
        query: {
          xmlnsTest: /^xmlns.*$/,
        },
      },
    ],
  },
};

// Optimize the bundle in release (production) mode
if (!isDebug) {
  config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
  config.optimization = {
    minimize: true,
  };
}

// Hot Module Replacement (HMR) + React Hot Reload
if (isDebug && useHMR) {
  // babelConfig.plugins.unshift('react-hot-loader/babel');
  // config.entry.unshift('react-hot-loader/patch', 'webpack-hot-middleware/client');
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
}

module.exports = config;
