import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import smsCtrl from '../controllers/sms';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
    .get(smsCtrl.testSMS)

router.route('/pass')
    .get(smsCtrl.send)
    .post(smsCtrl.checkPass)

router.route('/test')
    .post(smsCtrl.handlePic)
    .get(smsCtrl.test)
export default router;
