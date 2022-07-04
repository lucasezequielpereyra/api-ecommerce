import { Router, Request, Response } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/auth.controller';

const authController = new AuthController();
export const AuthRouter: Router = Router();

// Login with passport
AuthRouter.post(
  '/signin',
  passport.authenticate('local', {
    successRedirect: '/auth/successredirect',
    failureRedirect: '/auth/failureredirect',
  }),
);

AuthRouter.get('/successredirect', authController.successredirect);
AuthRouter.get('/failureredirect', authController.failureredirect);

AuthRouter.post('/signup', authController.signup);
