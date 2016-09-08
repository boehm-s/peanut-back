'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  // POST /api/users
  createUser: {
    body: {
      username: _joi2.default.string().required(),
      mobileNumber: _joi2.default.string().regex(/^[0-9]{10}$/).required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: _joi2.default.string().required(),
      mobileNumber: _joi2.default.string().regex(/^[0-9]{10}$/).required()
    },
    params: {
      userId: _joi2.default.string().hex().required()
    }
  }
};
module.exports = exports['default'];
//# sourceMappingURL=param-validation.js.map
