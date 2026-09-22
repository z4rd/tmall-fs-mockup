const pxToU = require('./tools/postcss-px-to-u.cjs');

module.exports = {
  plugins: [pxToU()],
};
