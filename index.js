import Promise from 'bluebird';
import mongoose from 'mongoose';
import config from './config/env';
import app from './config/express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import cli from 'readline-sync';

// promisify mongoose
Promise.promisifyAll(mongoose);

// connect to mongo db
mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.db}`);
});

const debug = require('debug')('express-mongoose-es6-rest-api:index');

/*var pass = cli.question("SSL passphrase > ", {hideEchoBack: true});
console.log('ok ... ');
*/
// ssl
var options = {
  key  : fs.readFileSync('/home/azureuser/ssl/key.pem'),
  cert : fs.readFileSync('/home/azureuser/ssl/cert.pem'),
//  ca : fs.readFileSync('/root/ca/intermediate/certs/ca-chain.cert.pem'),
  passphrase: "Etna2019"/*pass*/,
  ciphers: [
    "ECDHE-RSA-AES256-SHA384",
    "DHE-RSA-AES256-SHA384",
    "ECDHE-RSA-AES256-SHA256",
    "DHE-RSA-AES256-SHA256",
    "ECDHE-RSA-AES128-SHA256",
    "DHE-RSA-AES128-SHA256",
    "HIGH",
    "!aNULL",
    "!eNULL",
    "!EXPORT",
    "!DES",
    "!RC4",
    "!MD5",
    "!PSK",
    "!SRP",
    "!CAMELLIA"
  ].join(':')
};

// listen on port config.port

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);


httpServer.listen(80);
httpsServer.listen(443);

export default app;
