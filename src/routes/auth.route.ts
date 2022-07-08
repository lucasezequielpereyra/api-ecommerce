import { Router } from 'express';
import passport from 'passport';
import multer from 'multer';
import { AuthController } from '../controllers/auth.controller';
import { verifyEmail } from '../middlewares/verifySignup';

const authController = new AuthController();
export const router: Router = Router();

const uploadAvatar = multer({ dest: 'public/assets/uploads/avatars' });

// Login with passport
router.post(
  '/signin',
  passport.authenticate('local', {
    successRedirect: '/auth/successredirect',
    failureRedirect: '/auth/failureredirect',
  }),
);

// Logout with session
router.get('/signout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

router.get('/successredirect', authController.successredirect);
router.get('/failureredirect', authController.failureredirect);
router.post(
  '/signup',
  [uploadAvatar.single('file'), verifyEmail],
  authController.signup,
);
