const path = require('path');
const fs = require('fs');
const prettier = require('prettier');

const aliases = {
  '@app': '../src/js',
  '@app/components': '../src/js/components',
  '@app/constants': '../src/js/constants',
  '@app/factories': '../src/js/factories',
  '@app/types': '../src/js/types',
  '@app/utils': '../src/js/utils',
  '@app/widgets': '../src/js/widgets',
  '@app/app': '../src/js/app',
  '@app/pages': '../src/js/pages',
};

module.exports = {
  webpack: {},
  eslint: [],
  jest: {},
  tsconfig: {},
};

function resolveSrc(_path) {
  return path.resolve(__dirname, _path);
}

for (const alias in aliases) {
  const aliasTo = aliases[alias]
  module.exports.webpack[alias] = resolveSrc(aliasTo)
  module.exports.eslint.push([alias, resolveSrc(aliasTo)])
  const aliasHasExtension = /\.\w+$/.test(aliasTo)
  module.exports.jest[`^${alias}$`] = aliasHasExtension
    ? `<rootDir>/${aliasTo}`
    : `<rootDir>/${aliasTo}/index.js`
  module.exports.jest[`^${alias}/(.*)$`] = `<rootDir>/${aliasTo}/$1`
  // module.exports.tsconfig[alias + '/**/*'] = [aliasTo + '/**/*']
  // module.exports.tsconfig[alias] = aliasTo.includes('/index.')
  //   ? [aliasTo]
  //   : [
  //       aliasTo + '/index.ts',
  //       aliasTo + '/index.json',
  //       aliasTo + '/index.tsx',
  //       aliasTo + '/index.css',
  //     ]
}

// const tsconfigTemplate = require('./tsconfig.template') || {};
// 
// const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');
// 
// if (!tsconfigPath) {
//   fs.writeFile(
//     tsconfigPath,
//     prettier.format(
//       JSON.stringify({
//         ...tsconfigTemplate,
//         compilerOptions: {
//           ...(tsconfigTemplate.compilerOptions || {}),
//           paths: module.exports.tsconfig,
//         },
//       }),
//       {
//         ...require('./.prettierrc'),
//         parser: 'json',
//       },
//     ),
//     error => {
//       if (error) {
//         console.error(
//           'Error while creating tsconfig.json from aliases.config.js.',
//         );
//         throw error;
//       }
//     },
//   );
// }
