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
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
  const token: any = req.session?.passport.token;
  if (!token) {
    return res.status(401).json({ auth: false, message: 'No token provided.' });
  }

  const secret: string | undefined = process.env.JWT_PHRASE;

  try {
    if (typeof secret === 'undefined') {
      throw new Error('jwt is not defined');
    }
    const decoded: any = jwt.verify(token, secret);
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
    const user = req.session?.passport.user;
    const role: IRole | null = await authService.findRoleByName('admin');
    if (!role) {
      return res.status(502).json({ auth: false, message: 'Role not found.' });
    }

    const userRoles = await authService.getUserRoles(user);
    if (!userRoles) {
      return res
        .status(502)
        .json({ auth: false, message: 'User not has roles.' });
    }

    if (!userRoles.includes(role._id)) {
      return res.status(401).json({ auth: false, message: 'Unauthorized' });
    }

    return next();
  } catch (error) {
    logger.error.error(error);
    res.status(500).json({
      message: error,
    });
  }
};

export const verifyUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.session?.passport.user;
    const role: IRole | null = await authService.findRoleByName('user');
    if (!role) {
      return res.status(502).json({ auth: false, message: 'Role not found.' });
    }

    const userRoles = await authService.getUserRoles(user);
    if (!userRoles) {
      return res
        .status(502)
        .json({ auth: false, message: 'User not has roles.' });
    }

    if (!userRoles.includes(role._id)) {
      return res.status(401).json({ auth: false, message: 'Unauthorized' });
    }

    return next();
  } catch (error) {
    logger.error.error(error);
    res.status(500).json({
      message: error,
    });
  }
};
