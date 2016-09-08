'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _secretForJwt = require('../../config/secretForJwt');

var _env = require('../../config/env');

var _env2 = _interopRequireDefault(_env);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _multiparty = require('multiparty');

var _multiparty2 = _interopRequireDefault(_multiparty);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _gridfsStream = require('gridfs-stream');

var _gridfsStream2 = _interopRequireDefault(_gridfsStream);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _formidable = require('formidable');

var _formidable2 = _interopRequireDefault(_formidable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  _user2.default.get(id).then(function (user) {
    req.user = user; // eslint-disable-line no-param-reassign
    return next();
  }).error(function (e) {
    return next(e);
  });
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.password - The password of user.
 * @returns {User}
 */
function create(req, res, next) {
  var user = new _user2.default({
    username: req.body.username,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email
  });

  user.setPassword(req.body.password);

  user.save(function (err) {
    if (err) next(err);

    var token = _jsonwebtoken2.default.sign(user, _secretForJwt.secret, {
      expiresIn: "1 day"
    });
    res.json({ success: true, user: user, token: token });
  });
}

function authenticate(req, res, next) {
  _user2.default.findOne({
    $or: [{ 'username': req.body.username }, { 'email': req.body.username }] // username can be email too
  }, function (err, user) {
    if (err) res.json({ success: false, message: err });else if (!user) res.json({ success: false, message: 'Authentication failed. User not found...' });else if (user) {
      if (!user.isValidPassword(req.body.password)) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        var token = _jsonwebtoken2.default.sign(user, _secretForJwt.secret, {
          expiresIn: "1 day"
        });

        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
}

function isJwtAuthenticated(req, res, next) {
  var token = req.body !== undefined ? req.body.token || req.query.token || req.headers['x-access-token'] : req.query.token || req.headers['x-access-token'];
  if (token) {
    _jsonwebtoken2.default.verify(token, _secretForJwt.secret, function (err, decoded) {
      if (err) res.json({ success: false, message: 'Failed to authenticate token.' });else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
}

function saveImage(req, res, next) {}

function storeFile(req, res, next) {
  var form = new _formidable2.default.IncomingForm();

  form.parse(req, function (err, fields, files) {
    console.log('#############################################################');
    console.log(files);
    console.log(fields);
    console.log('#############################################################');
    //    res.writeHead(200, {'content-type': 'text/plain'});
    //    res.write('received upload:\n\n');
    res.json({ msg: "HAHAHHAHAHA", files: files });
  });
  /*
  mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
  const conn = mongoose.connection;
  conn.on('error', () => {
    throw new Error(`unable to connect to database: ${config.db}`);
  });
  Grid.mongo = mongoose.mongo;
  
  conn.once('open',  () => {
    const gfs = Grid(conn.db);
    
    // streaming to gridfs
    //filename to store in mongodb
    let writestream = gfs.createWriteStream({
      filename: 'mongo_file.txt'
    });
    fs.createReadStream('/home/etech/sourcefile.txt').pipe(writestream);
    
    writestream.on('close', (file) => {
      // do something with `file`
      console.log(file.filename + 'Written To DB');
    });
  });  */
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  var user = req.user;
  user.username = req.body.username;
  user.mobileNumber = req.body.mobileNumber;

  user.saveAsync().then(function (savedUser) {
    return res.json(savedUser);
  }).error(function (e) {
    return next(e);
  });
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  var _req$query = req.query;
  var _req$query$limit = _req$query.limit;
  var limit = _req$query$limit === undefined ? 50 : _req$query$limit;
  var _req$query$skip = _req$query.skip;
  var skip = _req$query$skip === undefined ? 0 : _req$query$skip;

  _user2.default.list({ limit: limit, skip: skip }).then(function (users) {
    return res.json(users);
  }).error(function (e) {
    return next(e);
  });
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  var user = req.user;
  user.removeAsync().then(function (deletedUser) {
    return res.json(deletedUser);
  }).error(function (e) {
    return next(e);
  });
}

function addKey(req, res, next) {
  var key = new _user.Key({
    key: req.body.key,
    emailArray: req.body.shareArray,
    ownerId: req.body.owner,
    fileId: req.body.fileId
  });

  key.save(function (err) {
    if (err) return res.json({ err: err });
    var arr = JSON.parse(req.body.shareArray);
    arr.push(req.decoded._doc.email);

    _user2.default.update({ email: { $in: arr } }, { $push: { keys: key._id } }, function (err, numberAffected, rawResponse) {
      if (err) return res.json({ err: err });
      return res.json({ success: true, numberAffected: numberAffected, rawResponse: rawResponse });
    });
  });
}

function getKey(req, res, next) {
  _user.Key.findOne({ fileId: req.params.id }, function (err, key) {
    if (err) return res.json({ err: err });
    return res.json({ success: true, key: key.key });
  });
}

exports.default = { load: load, get: get, create: create, authenticate: authenticate, isJwtAuthenticated: isJwtAuthenticated, update: update, list: list, remove: remove, storeFile: storeFile, addKey: addKey, getKey: getKey };
module.exports = exports['default'];
//# sourceMappingURL=user.js.map
