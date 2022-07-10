import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces/user.interface';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import logger from '../config/logger';

declare module 'express-session' {
  interface SessionData {
    passport: any;
  }
}

const authService = new AuthService();

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.session?.passport.token || req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ auth: false, message: 'No token provided.' });
  }
  try {
    const decoded: any = jwt.verify(token, String(process.env.JWT_PHRASE));
    const user: IUser | null = await authService.findUserById(decoded.id);

    if (user) return next();

    return res
      .status(401)
      .json({ auth: false, message: 'Failed to authenticate token.' });
  } catch (error) {
    logger.error.error(error);
    return res
      .status(500)
      .json({ auth: false, message: 'Failed to authenticate token.' });
  }
};
