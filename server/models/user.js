import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import crypto from 'crypto';
import uuid from 'node-uuid';

/**
 * User Schema
 */
const KeySchema = new mongoose.Schema({
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

const UserSchema = new mongoose.Schema({
    username: {
	type: String,
	required: true,
	unique: true
    },
    email: {
	type: String,
	required: true,
	match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
		'The value of path {PATH} ({VALUE}) is not a valid email'],
	unique: true
    },
    mobileNumber: {
	type: String,
	required: true,
	match: [/^[0-9]{10}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
    },
    
    keys: [{
	type: mongoose.Schema.Types.ObjectId,
	ref: 'Key'
    }],
    salt: {
	type: String,
	required: true,
	default: uuid.v1
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
    setPassword(passwordString)  {
	this.passwdHash = crypto
	    .createHmac('sha512', this.salt)
	    .update(passwordString)
	    .digest('hex');
    },
    isValidPassword(passwordString) {
	return this.passwdHash === crypto
	    .createHmac('sha512', this.salt)
	    .update(passwordString)
	    .digest('hex');
    },
    isValidUsb(usbObj) {
	if (this.usb.idVendor === usbObj.idVendor
	    && this.usb.idProduct === usbObj.idProduct
	    && this.usb.idProduct === usbObj.idProduct)
	    return true;
	else
	    return false;
    },
    setImageId(imageId) {
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
    get(id) {
	return this.findById(id)
	    .execAsync().then((user) => {
		if (user) {
		    return user;
		}
		const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
		return Promise.reject(err);
	    });
    },

    /**
     * List users in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({ skip = 0, limit = 50 } = {}) {
	return this.find()
	    .sort({ createdAt: -1 })
	    .skip(skip)
	    .limit(limit)
	    .execAsync();
    }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
export const Key = mongoose.model('Key', KeySchema);
