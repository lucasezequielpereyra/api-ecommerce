import jwt from 'jsonwebtoken';
import { IRole } from '../interfaces/role.interface';
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
  const token: any = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ auth: false, message: 'No token provided.' });
  }

  const secret: string | undefined = process.env.JWT_PHRASE;

  try {
    if (typeof secret === 'undefined') {
      throw new Error('jwt is not defined');
    }
    const decoded: any = jwt.verify(token, secret);
    console.log(decoded);
    if (decoded) return next();

    return res
      .status(401)
      .json({ auth: false, message: 'Failed to authenticate token.' });
  } catch (error) {
    logger.error.error(error);
    return res.status(500).json({ auth: false, message: error });
  }
};

export const verifyAdminRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.session?.passport.user;
    const role: IRole | null = await authService.findRoleByName('admin');
    if (!role) {
      throw new Error('Role not found');
    }

    const userRole: Boolean | null = await authService.findUserRole(
      userId,
      role._id,
    );

    if (!userRole) {
      return res
        .status(401)
        .json({ auth: false, message: 'User is not admin' });
    }

    return next();
  } catch (error) {
    logger.error.error(error);
    res.status(500).json({
      message: error,
    });
  }
};
