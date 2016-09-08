import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/addKey')
    .post(userCtrl.isJwtAuthenticated, userCtrl.addKey)

router.route('/getKey/:id')
    .get(userCtrl.isJwtAuthenticated, userCtrl.getKey);

router.route('/')
  /** GET /api/users - Get list of users */
  .get(userCtrl.isJwtAuthenticated, userCtrl.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.isJwtAuthenticated, userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.isJwtAuthenticated, userCtrl.remove);

router.route('/auth')
  /** POST /api/users/auth - Authenticate user */
  .post(userCtrl.authenticate);

router.route('/storeFile')
  .post(userCtrl.isJwtAuthenticated, userCtrl.storeFile);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

export default router;
