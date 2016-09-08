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

var _free = require('./sms/free');

var _free2 = _interopRequireDefault(_free);

var _formidable = require('formidable');

var _formidable2 = _interopRequireDefault(_formidable);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var array = [];
var options = {
				key: "OeAifDVAnOL6bh",
				user: "23066945"
};
var free = new _free2.default(options);

function testSMS(req, res, next) {
				res.json({ coucou: "erwan" });
}

var _random = function _random() {
				var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
				var result = '';
				for (var i = 25; i > 0; --i) {
								result += chars[Math.floor(Math.random() * chars.length)];
				}return result;
};

function test(req, res) {
				res.send({ status: "ok" });
}

function send(req, res) {
				free.sendPass().then(function (result) {
								console.log("RESULT : ", result.id);
								var rndm = _random();
								array.push({ rndm: result.id });
								console.log(array);
								res.json({
												success: "ok",
												id: rndm
								});
				});
}

function handlePic(req, res) {
				var form = new _formidable2.default.IncomingForm();

				form.parse(req, function (err, fields, files) {
								console.log("================!!!========================");
								var base = _fs2.default.readFileSync(files.image.path);
								var abc = decode(base, function (data) {
												console.log(data);
								});
								console.log("XXXXXXXXXXXXx", abc);

								res.send({ status: "ok" });
								/*	
        	const img = files.image;
        	console.log(img);
        	
        	let writestream = fs.createWriteStream("/home/azureuser/api/abc.png");
        	fs.createReadStream(img._writeStream.path).pipe(writestream);
        
        	writestream.on('close', function (file) {
        	    console.log("XXXXXXXXXXXXXXXx",file);
        //	    console.log(decode(new Buffer(file)));
        	    return res.json({coucou: "erwan"});
        	});*/
				});
}

function checkPass(req, res) {
				var result = free.checkPass(req.body.pass);
				console.log("RESSSSSSSSSSSSSSSSSSSSSSSSSSSSSS : ", result);
				res.json(result);
}

exports.default = { testSMS: testSMS, send: send, checkPass: checkPass, test: test, handlePic: handlePic };
module.exports = exports['default'];
//# sourceMappingURL=sms.js.map
