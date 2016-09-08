'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rsaKeygen = require('rsa-keygen');

var _rsaKeygen2 = _interopRequireDefault(_rsaKeygen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;

var rsaKeys = function () {
  function rsaKeys() {
    _classCallCheck(this, rsaKeys);

    this.store = {};
    instance = !instance ? this : instance;
    return instance;
  }

  _createClass(rsaKeys, [{
    key: 'addKeyWithId',
    value: function addKeyWithId(id) {
      this.store[id] = _rsaKeygen2.default.generate();
      return this.store[id].public_key;
    }
  }, {
    key: 'getKeyById',
    value: function getKeyById(id) {
      return this.store[id];
    }
  }, {
    key: 'removeKeyById',
    value: function removeKeyById(id) {
      return delete this.store[id];
    }
  }]);

  return rsaKeys;
}();

exports.default = rsaKeys;
module.exports = exports['default'];
//# sourceMappingURL=rsaKeys.js.map
