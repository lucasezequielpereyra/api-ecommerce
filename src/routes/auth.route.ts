import { Router, Request, Response } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/auth.controller';

const authController = new AuthController();
export const router: Router = Router();

// Login with passport
router.post(
  '/signin',
  passport.authenticate('local', {
    successRedirect: '/auth/successredirect',
    failureRedirect: '/auth/failureredirect',
  }),
);

router.get('/successredirect', authController.successredirect);
router.get('/failureredirect', authController.failureredirect);

router.post('/signup', authController.signup);
