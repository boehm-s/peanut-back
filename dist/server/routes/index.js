'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _sms = require('./sms');

var _sms2 = _interopRequireDefault(_sms);

var _rsaKeys = require('../../config/rsaKeys');

var _rsaKeys2 = _interopRequireDefault(_rsaKeys);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // eslint-disable-line new-cap
var keyProvider = new _rsaKeys2.default();

/** GET /health-check - Check service health */
router.get('/health-check', function (req, res) {
  return res.send('OK');
});

router.get('/rsa-key', function (req, res) {
  var id = _uuid2.default.v4();
  res.json({ key: keyProvider.addKeyWithId(id), id: id });
});

router.post('/postKey', function (req, res) {
  var key = req.body.key;
  var emailArray = req.body.emailArray;
  var ownerId = req.body.ownerId;
  var fileId = req.body.fileId;
});

router.get('/getKey/:fileId', function (req, res) {});

router.post('/test', function (req, res) {
  var body = '';
  var filePath = __dirname + './truc';
  req.on('data', function (data) {
    body += data;
  });

  req.on('end', function () {
    _crypto2.default.privateDecrypt({
      key: new Buffer(keyProvider.getKeyById(req.query.id).private_key)
    }, body).toString();

    res.send({ coucou: "vincent" });

    _fs2.default.appendFile(filePath, body, function () {
      res.end();
    });
  });
});

router.get('/test', function (req, res) {
  res.json({ ok: req.body });
});

// mount user routes at /users
router.use('/users', _user2.default);

// mount sms routes at /sms
router.use('/sms', _sms2.default);

exports.default = router;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
