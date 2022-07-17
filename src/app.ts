import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import path from 'path';
import { connect } from './config/mongo';
import { router as AuthRouter } from './routes/auth.route';
import { router as CategoryRouter } from './routes/category.route';
import { router as ProductRouter } from './routes/product.route';
import { router as CartRouter } from './routes/cart.route';
import { router as OrderRouter } from './routes/order.route';
import { createRoles, createDefaultUsers } from './libs/initialSetup';

const app: Application = express();

/*    CONFIGS    */
connect();
createRoles();
createDefaultUsers();

/*    MIDDLEWARES    */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(cors());

/*    TEMPLATE ENGINE     */
const viewPath = path.join(__dirname, '../views');
app.set('view engine', 'ejs');
app.set('views', viewPath);

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
      maxAge: 3600000,
    },
  }),
);

/*    PASSPORT    */
import './config/passport';
app.use(passport.initialize());
app.use(passport.session());

/*    STATIC ROUTES    */
app.use('/messages', (req: Request, res: Response, next: NextFunction) => {
  res.render('messages');
});

/*    ROUTES    */
app.use('/auth', AuthRouter);
app.use('/category', CategoryRouter);
app.use('/product', ProductRouter);
app.use('/cart', CartRouter);
app.use('/order', OrderRouter);

/*    ERROR    */
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(500).json('Server error');
  next();
});

export default app;
