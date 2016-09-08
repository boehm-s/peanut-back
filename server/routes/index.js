import express from 'express';
import userRoutes from './user';
import smsRoutes from './sms';
import rsaKeys from '../../config/rsaKeys';
import uuid from 'uuid';
import fs from 'fs';
import crypto from 'crypto';

const router = express.Router();	// eslint-disable-line new-cap
const keyProvider = new rsaKeys();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);


router.get('/rsa-key', (req, res) => {
  let id = uuid.v4();
  res.json({key: keyProvider.addKeyWithId(id), id: id});
});

router.post('/postKey', (req, res) => {
    let key = req.body.key;
    let emailArray = req.body.emailArray;
    let ownerId = req.body.ownerId;
    let fileId = req.body.fileId;
})

router.get('/getKey/:fileId', (req, res) => {
    
})


router.post('/test', (req, res) => {
    let body = '';
    let filePath = __dirname + './truc';
    req.on('data', function(data) {
        body += data;
    });

    req.on('end', function (){
      crypto.privateDecrypt({
        key: new Buffer(keyProvider.getKeyById(req.query.id).private_key)
      }, body).toString();

      res.send({coucou: "vincent"});

      fs.appendFile(filePath, body, function() {
        res.end();
      });
    });
});

router.get('/test', (req, res) => {
  res.json({ok: req.body});
});

// mount user routes at /users
router.use('/users', userRoutes);

// mount sms routes at /sms
router.use('/sms', smsRoutes);

export default router;
