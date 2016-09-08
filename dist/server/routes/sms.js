'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _paramValidation = require('../../config/param-validation');

var _paramValidation2 = _interopRequireDefault(_paramValidation);

var _sms = require('../controllers/sms');

var _sms2 = _interopRequireDefault(_sms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap

router.route('/').get(_sms2.default.testSMS);

router.route('/pass').get(_sms2.default.send).post(_sms2.default.checkPass);

router.route('/test').post(_sms2.default.handlePic).get(_sms2.default.test);
exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=sms.js.map
