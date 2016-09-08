'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = process.env.NODE_ENV || 'development';
var config = require('./' + env);

var defaults = {
  root: _path2.default.join(__dirname, '/..')
};

_lodash2.default.assign(config, defaults);

exports.default = config;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
