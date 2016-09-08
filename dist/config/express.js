'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _methodOverride = require('method-override');

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _expressWinston = require('express-winston');

var _expressWinston2 = _interopRequireDefault(_expressWinston);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _winston = require('./winston');

var _winston2 = _interopRequireDefault(_winston);

var _routes = require('../server/routes');

var _routes2 = _interopRequireDefault(_routes);

var _env = require('./env');

var _env2 = _interopRequireDefault(_env);

var _APIError = require('../server/helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

var _rsaKeygen = require('rsa-keygen');

var _rsaKeygen2 = _interopRequireDefault(_rsaKeygen);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _rsaKeys = require('./rsaKeys');

var _rsaKeys2 = _interopRequireDefault(_rsaKeys);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import smsRoutes from '../server/smsRoutes';
var keyProvider = new _rsaKeys2.default();

var app = (0, _express2.default)();

if (_env2.default.env === 'development') {
  app.use((0, _morgan2.default)('dev'));
}

// parse body params and attache them to req.body
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true, limit: '50mb' }));

app.use((0, _cookieParser2.default)());
app.use((0, _compression2.default)());
app.use((0, _methodOverride2.default)());

// secure apps by setting various HTTP headers
var ONE_YEAR = 31536000000;
app.use(_helmet2.default.hsts({
  maxAge: ONE_YEAR,
  includeSubdomains: true,
  force: true
}));

// enable CORS - Cross Origin Resource Sharing
app.use((0, _cors2.default)());

// RSA decrypt requests body
var decryptBody = function decryptBody(req, res, next) {
  var cType = req.headers['content-type'];
  if (req.headers['content-type']) {
    if (req.headers['content-type'].indexOf('multipart') !== -1) {
      var id = req.headers['x-access-token'];
      req.body.id = id;
      return next();
    }
  }
  if (req.method !== 'GET') {
    if (!req.body.id) res.status(401).send({ success: false, message: "You must send the id provided at the address /api/rsa-key" });
    if (keyProvider.getKeyById(req.body.id) === undefined) res.status(401).send({ success: false, message: "The body of the request must be encrypted with the RSA public key provided at the address : /api/rsa-key" });

    for (var i in req.body) {
      var data = req.body[i].data || req.body[i];
      var base64 = req.body[i].data ? false : true;
      if (i !== 'id') {
        req.body[i] = _crypto2.default.privateDecrypt({
          key: new Buffer(keyProvider.getKeyById(req.body.id).private_key)
        }, base64 ? new Buffer(data, 'base64') : new Buffer(data)).toString();
      }
    }
    keyProvider.removeKeyById(req.body.id);
    console.log("BITCH : ", req.body);
    next();
  } else next();
};

app.use(decryptBody);

// https redirect
var requireHTTPS = function requireHTTPS(req, res, next) {
  if (!req.secure) return res.redirect('https://' + req.get('host') + req.url);
  return next();
};

//app.use(requireHTTPS);

// enable detailed API logging in dev env
if (_env2.default.env === 'development') {
  _expressWinston2.default.requestWhitelist.push('body');
  _expressWinston2.default.responseWhitelist.push('body');
  app.use(_expressWinston2.default.logger({
    winstonInstance: _winston2.default,
    meta: true, // optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
}

// mount all routes on /api path
app.use('/api', _routes2.default);
//app.use('/sms', smsRoutes);

// if error is not an instanceOf APIError, convert it.
app.use(function (err, req, res, next) {
  if (err instanceof _expressValidation2.default.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    var unifiedErrorMessage = err.errors.map(function (error) {
      return error.messages.join('. ');
    }).join(' and ');
    var error = new _APIError2.default(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof _APIError2.default)) {
    var apiError = new _APIError2.default(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new _APIError2.default('API not found', _httpStatus2.default.NOT_FOUND);
  return next(err);
});

// log error in winston transports except when executing test suite
if (_env2.default.env !== 'test') {
  app.use(_expressWinston2.default.errorLogger({
    winstonInstance: _winston2.default
  }));
}

// error handler, send stacktrace only during development
app.use(function (err, req, res, next) {
  return (// eslint-disable-line no-unused-vars
    res.status(err.status).json({
      message: err.isPublic ? err.message : _httpStatus2.default[err.status],
      stack: _env2.default.env === 'development' ? err.stack : {}
    })
  );
});

exports.default = app;
module.exports = exports['default'];
//# sourceMappingURL=express.js.map
