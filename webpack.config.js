const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const globEntries = require('webpack-glob-folder-entries');
const projectConfig = require('./scripts/config');
const babelConfig = require('./scripts/babel.config');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const HOST = process.env.HOST || '0.0.0.0';
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const isDebug = global.DEBUG === false ? false : !process.argv.includes('production');
const isProd = !isDebug
const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');
const useHMR = !!global.HMR;

console.log({ isDebug, useHMR, isVerbose, isProd });

const HtmlWebpackPluginConfig = globPath => {
  const entries = globEntries(globPath, true);
  const htmlList = [];

  for (let folder in entries){
    const htmlPath = path.join(__dirname, entries[folder]);
    const filename = entries[folder].replace('src/template/pages/', '');

    const h = new HtmlWebpackPlugin({
      filename,
      inject: true,
      // inlineSource: '.(js|css)$',
      template: `liquid-loader!${htmlPath}`,
    });

    htmlList.push(h);
  }

  return htmlList;
};

function returnEntries(globPath) {
  const entries = globEntries(globPath, true);
  const folderList = [];
  for (let folder in entries) {
     folderList.push(path.join(__dirname, entries[folder]));
  }

  return folderList;
}

const config = {
  mode: isDebug ? 'development' : 'production',
  context: path.resolve(__dirname, './src'),
  entry: [
    path.resolve(__dirname, './src/js/index.js'),
  ],

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: require('./scripts/aliases.config').webpack,
  },

  output: {
    path: path.resolve(__dirname, './build'),
    publicPath: isDebug ? `${protocol}://${HOST}:${DEFAULT_PORT}/` : '/',
    filename: isDebug ? '[name].js?[hash]' : '[name].[hash].js',
    chunkFilename: isDebug ? '[id].js?[chunkhash]' : '[id].[chunkhash].js',
    sourcePrefix: '  ',
  },

  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
  },

  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //   },
  // },

  devtool: isDebug ? 'source-map' : false,

  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: false,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.PROJECT_TITLE': `"${projectConfig.title}"`,
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      __DEV__: isDebug,
    }),

    new AssetsPlugin({
      path: path.resolve(__dirname, './build/assets/js'),
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

    ...HtmlWebpackPluginConfig('./src/template/pages/**/*.html')
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, './src/js'),
        ],
        loader: 'babel-loader',
        options: babelConfig,
      },
      isProd ? 
        {
          test: /\.css$/,
          include: [
            path.resolve(__dirname, './src/css'),
          ],
          exclude: /node_modules/,
          use: ExtractTextPlugin.extract({
            allChunks: true,
            fallback : 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  url: false,
                  sourceMap: isDebug,
                  // importLoaders: 1,
                  modules: false,
                  // localIdentName: isDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
                  // minimize: !isDebug,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  config: {
                    path: './scripts/postcss.config.js',
                  },
                },
              },
            ],
          }),
        } :
        {
          test: /\.css$/,
          include: [
            path.resolve(__dirname, './src/css'),
          ],
          exclude: /node_modules/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                url: false,
                sourceMap: isDebug,
                modules: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                config: {
                  path: './scripts/postcss.config.js',
                },
              },
            },
          ]
        },
      {
        test: /\.html$|njk|nunjucks/,
        use: ['html-loader', {
          loader: 'nunjucks-html-loader',
          options: {
            searchPaths: [...returnEntries('./src/template/**/')],
            context : {
             project_name: projectConfig.title,
             image_path: '/assets/images',
             root_path: '',
             __DEV__: isDebug,
             ...projectConfig
           }
          },
        }],
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
      {
        test: /\.(eot|ttf|wav|mp3|mp4)$/,
        loader: 'file-loader',
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
    ...config.optimization,
  };
}

// if (isProd) {
//   config.plugins.push(...HtmlWebpackPluginConfig('./src/template/pages/**/*.html'))
// }

if (isDebug && useHMR) {
  config.entry.unshift(`webpack-dev-server/client?${protocol}://${HOST}:${DEFAULT_PORT}`)
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
}

module.exports = config;
