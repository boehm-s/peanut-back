'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.secret = undefined;

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _cron = require('cron');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var secrett = _uuid2.default.v4();

var job = new _cron.CronJob('00 30 11 * * */2', function () {
  secrett = _uuid2.default.v4();
}, function () {
  console.log('secret updated');
}, true, 'America/Los_Angeles');

var secret = exports.secret = secrett;
//# sourceMappingURL=secretForJwt.js.map
