import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import logger from './logger';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

passport.use(
  new LocalStrategy((username, password, done) => {
    authService
      .findUserByEmail(username)
      .then(async user => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        if (!(await authService.comparePassword(password, user.password))) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      })
      .catch(err => {
        logger.error.error(err);
        return done(err);
      });
  }),
);

// serialize user into session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// deserialize user from session
passport.deserializeUser((id: string, done) => {
  authService
    .findUserById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      logger.error.error(err);
      done(err);
    });
});
