const fs = require('fs');
const path = require('path');
const glob = require('glob');
const loaderUtils = require('loader-utils');

class SVGtoJSONWebpackPlugin {
  constructor(options) {
    this.options = Object.assign(options);
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const files = glob.sync(this.options.src);
      const svgs = {};
      files.forEach((file) => {
        svgs[path.basename(file)] = fs.readFileSync(file, 'utf8');
      });

      const hash = loaderUtils.getHashDigest(JSON.stringify(svgs), 'sha1', 'hex', 16);
      compilation.assets[`icons.${hash}.json`] = {
        source() {
          return JSON.stringify(svgs);
        },
        size() {
          return svgs.length;
        },
      };

      callback();
    });
  }
}

module.exports = SVGtoJSONWebpackPlugin;
