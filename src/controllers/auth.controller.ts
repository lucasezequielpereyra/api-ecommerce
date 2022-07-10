import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RoleService } from '../services/role.service';
import { UserModel } from '../models/user.model';
import logger from '../config/logger';

const authService = new AuthService();
const roleService = new RoleService();

declare module 'express-session' {
  interface SessionData {
    passport: any;
  }
}

export class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const { email, name, password }: any = req.body;
      const avatar: any = req.file || 'not avatar';

      const user = new UserModel({
        email,
        name,
        password,
        avatar: avatar.path,
      });

      const userRole = await roleService.findRoleByName('user');
      if (userRole) {
        user.role = [userRole._id];
      } else {
        logger.error.error('Role "user" not found');
      }

      const newUser = await user.save();

      res.status(201).json(newUser);
    } catch (err) {
      logger.error.error(err);
      res.status(500).json({
        message: err,
      });
    }
  }

  async successredirect(req: Request, res: Response) {
    if (req.isAuthenticated()) {
      const token: string = authService.getUserToken(req.session.passport.user);
      req.session.passport.token = token;
      res.status(200).json({
        token,
      });
    } else {
      res.status(401).json('unauthorized');
    }
  }

  async failureredirect(req: Request, res: Response) {
    res.status(200).json('failure');
  }
}
