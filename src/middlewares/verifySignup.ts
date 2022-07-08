import { AuthService } from '../services/auth.service';
import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

const authService = new AuthService();

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email = req.body.email;
    const user = await authService.findUserByEmail(email);
    if (user) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }
    next();
  } catch (error) {
    logger.error.error(error);
    throw new Error('Error verifying username');
  }
};
