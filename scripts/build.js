const fs = require('fs-extra');
const rimraf = require('rimraf');
const webpack = require('webpack');
const task = require('./task');
const assetsPath= 'build/assets'

// Bundle JavaScript, CSS and image files with Webpack
const bundle = task('bundle', () => {
  const webpackConfig = require('./webpack.config');
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        console.log(stats.toString(webpackConfig.stats));
        resolve();
      }
    });
  });
});

const copy = task('copy', () => {
  fs.copy('static/assets', assetsPath, function (err) {
    if (err) return console.error(err)
    console.log('success!')
  });
})

//
// Build website into a distributable format
// -----------------------------------------------------------------------------
module.exports = task('build', () => {
  global.DEBUG = process.argv.includes('--debug') || false;
  rimraf.sync('build/*', { nosort: true, dot: true });
  return Promise.resolve()
    .then(bundle)
    .then(copy);
});
