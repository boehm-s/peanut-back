import User, {Key} from '../models/user';
import jwt from 'jsonwebtoken';
import {secret} from '../../config/secretForJwt';

import config from '../../config/env';
import mongoose from 'mongoose';
import multiparty from 'multiparty';
import util from 'util';
import Grid from 'gridfs-stream';
import fs from 'fs';

import formidable from 'formidable';

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id).then((user) => {
    req.user = user;		// eslint-disable-line no-param-reassign
    return next();
  }).error((e) => next(e));
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
  const user = new User({
    username: req.body.username,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email
  });
  
  user.setPassword(req.body.password);

  user.save(err => {
    if (err) next(err);
    
    const token = jwt.sign(user, secret, {
          expiresIn: "1 day"
    });
    res.json({success: true, user: user, token: token});
  });

}

function authenticate(req, res, next) {
  User.findOne({
    $or:[ {'username': req.body.username}, {'email': req.body.username}]   // username can be email too
  }, function(err, user) {
    if (err) 
      res.json({ success: false, message: err });
    else if (!user)
      res.json({ success: false, message: 'Authentication failed. User not found...' });
    else if (user) {
      if (!user.isValidPassword(req.body.password)) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {
        const token = jwt.sign(user, secret, {
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
  const token = (req.body !== undefined) ? req.body.token || req.query.token || req.headers['x-access-token'] : req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, secret, (err, decoded) => {      
        if (err)
          res.json({ success: false, message: 'Failed to authenticate token.' });    
        else {
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

function saveImage(req, res, next) {
  
}

function storeFile(req, res, next) {  
  let form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files) {  
    console.log('#############################################################');
    console.log(files);
    console.log(fields);
    console.log('#############################################################');
//    res.writeHead(200, {'content-type': 'text/plain'});
//    res.write('received upload:\n\n');
    res.json({msg: "HAHAHHAHAHA", files});
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
  const user = req.user;
  user.username = req.body.username;
  user.mobileNumber = req.body.mobileNumber;

  user.saveAsync()
    .then((savedUser) => res.json(savedUser))
    .error((e) => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip }).then((users) => res.json(users))
    .error((e) => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.removeAsync()
    .then((deletedUser) => res.json(deletedUser))
    .error((e) => next(e));
}


function addKey(req, res, next) {
    const key = new Key({
	key: req.body.key,
	emailArray: req.body.shareArray,
	ownerId: req.body.owner,
	fileId: req.body.fileId
    });

    key.save(err => {
	if (err) return res.json({err});
	let arr = JSON.parse(req.body.shareArray);
	arr.push(req.decoded._doc.email);
	
	User.update({email: {$in: arr}}, {$push: {keys: key._id}}, (err, numberAffected, rawResponse) => {
	    if (err) return res.json({err});
	    return res.json({success: true, numberAffected, rawResponse});
	});
    });
 }

function getKey(req, res, next) {
    Key.findOne({fileId: req.params.id}, (err, key) => {
	if (err) return res.json({err});
	return res.json({success: true, key: key.key});
    });
}

export default { load, get, create, authenticate, isJwtAuthenticated, update, list, remove, storeFile, addKey, getKey };
