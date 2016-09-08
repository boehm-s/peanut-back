'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _env = require('./config/env');

var _env2 = _interopRequireDefault(_env);

var _express = require('./config/express');

var _express2 = _interopRequireDefault(_express);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _readlineSync = require('readline-sync');

var _readlineSync2 = _interopRequireDefault(_readlineSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// promisify mongoose
_bluebird2.default.promisifyAll(_mongoose2.default);

// connect to mongo db
_mongoose2.default.connect(_env2.default.db, { server: { socketOptions: { keepAlive: 1 } } });
_mongoose2.default.connection.on('error', function () {
  throw new Error('unable to connect to database: ' + _env2.default.db);
});

var debug = require('debug')('express-mongoose-es6-rest-api:index');

/*var pass = cli.question("SSL passphrase > ", {hideEchoBack: true});
console.log('ok ... ');
*/
// ssl
var options = {
  key: _fs2.default.readFileSync('/home/azureuser/ssl/key.pem'),
  cert: _fs2.default.readFileSync('/home/azureuser/ssl/cert.pem'),
  //  ca : fs.readFileSync('/root/ca/intermediate/certs/ca-chain.cert.pem'),
  passphrase: "Etna2019" /*pass*/
  , ciphers: ["ECDHE-RSA-AES256-SHA384", "DHE-RSA-AES256-SHA384", "ECDHE-RSA-AES256-SHA256", "DHE-RSA-AES256-SHA256", "ECDHE-RSA-AES128-SHA256", "DHE-RSA-AES128-SHA256", "HIGH", "!aNULL", "!eNULL", "!EXPORT", "!DES", "!RC4", "!MD5", "!PSK", "!SRP", "!CAMELLIA"].join(':')
};

// listen on port config.port

var httpServer = _http2.default.createServer(_express2.default);
var httpsServer = _https2.default.createServer(options, _express2.default);

httpServer.listen(80);
httpsServer.listen(443);

exports.default = _express2.default;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
