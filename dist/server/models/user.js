'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});
exports.Key = undefined;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _APIError = require('../helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * User Schema
 */
var KeySchema = new _mongoose2.default.Schema({
   key: {
      type: String
   },
   emailArray: {
      type: Array,
      default: []
   },
   ownerId: {
      type: String
   },
   fileId: {
      type: String
   }
});

var UserSchema = new _mongoose2.default.Schema({
   username: {
      type: String,
      required: true,
      unique: true
   },
   email: {
      type: String,
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'The value of path {PATH} ({VALUE}) is not a valid email'],
      unique: true
   },
   mobileNumber: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
   },

   keys: [{
      type: _mongoose2.default.Schema.Types.ObjectId,
      ref: 'Key'
   }],
   salt: {
      type: String,
      required: true,
      default: _nodeUuid2.default.v1
   },
   passwdHash: {
      type: String,
      required: true
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({
   setPassword: function setPassword(passwordString) {
      this.passwdHash = _crypto2.default.createHmac('sha512', this.salt).update(passwordString).digest('hex');
   },
   isValidPassword: function isValidPassword(passwordString) {
      return this.passwdHash === _crypto2.default.createHmac('sha512', this.salt).update(passwordString).digest('hex');
   },
   isValidUsb: function isValidUsb(usbObj) {
      if (this.usb.idVendor === usbObj.idVendor && this.usb.idProduct === usbObj.idProduct && this.usb.idProduct === usbObj.idProduct) return true;else return false;
   },
   setImageId: function setImageId(imageId) {
      this.imageId = imageId;
   }
});

/**
 * Statics
 */
UserSchema.statics = {
   /**
    * Get user
    * @param {ObjectId} id - The objectId of user.
    * @returns {Promise<User, APIError>}
    */
   get: function get(id) {
      return this.findById(id).execAsync().then(function (user) {
         if (user) {
            return user;
         }
         var err = new _APIError2.default('No such user exists!', _httpStatus2.default.NOT_FOUND);
         return _bluebird2.default.reject(err);
      });
   },


   /**
    * List users in descending order of 'createdAt' timestamp.
    * @param {number} skip - Number of users to be skipped.
    * @param {number} limit - Limit number of users to be returned.
    * @returns {Promise<User[]>}
    */
   list: function list() {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref$skip = _ref.skip;
      var skip = _ref$skip === undefined ? 0 : _ref$skip;
      var _ref$limit = _ref.limit;
      var limit = _ref$limit === undefined ? 50 : _ref$limit;

      return this.find().sort({ createdAt: -1 }).skip(skip).limit(limit).execAsync();
   }
};

/**
 * @typedef User
 */
exports.default = _mongoose2.default.model('User', UserSchema);
var Key = exports.Key = _mongoose2.default.model('Key', KeySchema);
//# sourceMappingURL=user.js.map
