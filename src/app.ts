import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { connect } from './config/mongo';
import { AuthRouter } from './routes/auth.route';
import logger from './config/logger';

const app: Application = express();

/*    CONFIGS    */
connect();

/*    MIDDLEWARES    */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

/*   SESSION    */
app.use(
  session({
    store: new MongoStore({
      mongoUrl: process.env.DB_URL,
    }),
    secret: String(process.env.SESSION_SECRET),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

/*    PASSPORT    */
import './config/passport';
app.use(passport.initialize());
app.use(passport.session());

/*    ROUTES    */
app.use('/auth', AuthRouter);

/*    ERROR    */
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(500).json('Server error');
  next();
});

export default app;
