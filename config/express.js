import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import helmet from 'helmet';
import winstonInstance from './winston';
import routes from '../server/routes';
//import smsRoutes from '../server/smsRoutes';
import config from './env';
import APIError from '../server/helpers/APIError';

import rsaKeygen from 'rsa-keygen';
import crypto from 'crypto';
import rsaKeys from './rsaKeys';
import jwt from 'jsonwebtoken';

const keyProvider = new rsaKeys();

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
var ONE_YEAR = 31536000000;
app.use(helmet.hsts({
    maxAge: ONE_YEAR,
    includeSubdomains: true,
    force: true
}));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// RSA decrypt requests body
const decryptBody = (req, res, next) => {
    let cType = req.headers['content-type'];
    if (req.headers['content-type']) {
	if (req.headers['content-type'].indexOf('multipart') !== -1) {
	    let id = req.headers['x-access-token'];
	    req.body.id = id;
	    return next();
	}
    }
    if (req.method !== 'GET') {
	if (!req.body.id)
	    res.status(401).send({success: false, message: "You must send the id provided at the address /api/rsa-key"});
	if (keyProvider.getKeyById(req.body.id) === undefined)
	    res.status(401).send({success: false, message: "The body of the request must be encrypted with the RSA public key provided at the address : /api/rsa-key"});
	
	for (let i in req.body) {
	    let data = req.body[i].data || req.body[i];
	    let base64 = (req.body[i].data) ? false : true;
	    if (i !== 'id') {
		req.body[i] = crypto.privateDecrypt({
		    key: new Buffer(keyProvider.getKeyById(req.body.id).private_key)
		}, ((base64) ? new Buffer(data, 'base64') : new Buffer(data))).toString();
	    }
	}
	keyProvider.removeKeyById(req.body.id);
	console.log("BITCH : ", req.body);
	next();
    } else
	next();
};

app.use(decryptBody);

// https redirect
const requireHTTPS = (req, res, next) => {
  if (!req.secure)
    return res.redirect('https://' + req.get('host') + req.url);
  return next();
};

//app.use(requireHTTPS);

// enable detailed API logging in dev env
if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true, 	// optional: log meta data about request (defaults to true)
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true 	// Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
}

// mount all routes on /api path
app.use('/api', routes);
//app.use('/sms', smsRoutes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }));
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) =>		// eslint-disable-line no-unused-vars
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  })
);

export default app;
