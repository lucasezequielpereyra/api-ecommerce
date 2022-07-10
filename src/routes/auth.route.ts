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
  if (req.session) {
    req.session.destroy(() => {
      res.status(200).json('session destroyed');
    });
  } else {
    res.status(400).json('session not found');
  }
});

router.get('/successredirect', authController.successredirect);
router.get('/failureredirect', authController.failureredirect);
router.post(
  '/signup',
  [uploadAvatar.single('file'), verifyEmail],
  authController.signup,
);
