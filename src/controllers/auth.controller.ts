import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/user.model';
import logger from '../config/logger';

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const { email, name, password }: any = req.body;
      const user = new UserModel({
        email,
        name,
        password,
        avatar: 'https://i.pravatar.cc/300',
      });

      const newUser = await authService.newUser(user);

      res.status(201).json(newUser);
    } catch (err) {
      logger.error.error(err);
      res.status(500).json({
        message: err,
      });
    }
  }

  async successredirect(req: Request, res: Response) {
    res.status(200).json('Success');
  }

  async failureredirect(req: Request, res: Response) {
    res.status(200).json('failure');
  }
}
