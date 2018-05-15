import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';
import * as validate from 'express-validation';
import User from '../models/user.model';
import * as express from 'express';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
  .get(userCtrl.get);


router.param('userId', async (req, res, next, id) => {
  try {
    (req as any).user = await User.get(id);
    next();
  } catch (e) {
    next(e);
  }
});

export default router;
