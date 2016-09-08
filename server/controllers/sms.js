import User from '../models/user';
import jwt from 'jsonwebtoken';
import {secret} from '../../config/secretForJwt';

import config from '../../config/env';
import mongoose from 'mongoose';
import Free from './sms/free'
import formidable from 'formidable';
import fs from 'fs';

var array = [];
var options = {
    key: "OeAifDVAnOL6bh",
    user: "23066945"
}
var free = new Free(options);


function testSMS(req, res, next) {
    res.json({coucou: "erwan"});
}

var _random = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    var result = '';
    for (var i = 25; i > 0; --i)
	result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function test(req, res) {
    res.send({status: "ok"});
}

function send(req, res) {
    free.sendPass().then(function(result) {
	console.log("RESULT : ", result.id);
	var rndm = _random();
	array.push({rndm: result.id});
	console.log(array)
	res.json({
	    success: "ok",
	    id: rndm
	})
    })
}

function handlePic(req, res) {
    let form = new formidable.IncomingForm();





    
    form.parse(req, function(err, fields, files) {
	console.log("================!!!========================");
	var base = fs.readFileSync(files.image.path);
	var abc = decode(base, function(data){
	    console.log(data);
	});
	console.log("XXXXXXXXXXXXx", abc);


	res.send({status: "ok"});
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
    })

    
}

function checkPass(req, res) {
    var result = free.checkPass(req.body.pass)
    console.log("RESSSSSSSSSSSSSSSSSSSSSSSSSSSSSS : ",result);
    res.json(result);
}


export default { testSMS, send, checkPass, test, handlePic};
