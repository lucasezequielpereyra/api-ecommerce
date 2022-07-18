import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';
import { IUser } from '../interfaces/user.interface';
import logger from '../config/logger';

declare module 'express-session' {
  interface SessionData {
    passport: any;
  }
}

const authService = new AuthService();
const messageService = new MessageService();

export class MessagesController {
  async getMessages(req: Request, res: Response): Promise<Response | void> {
    const user = req.session?.passport.user;
    try {
      const dataUser: IUser | null = await authService.findUserById(user);
      if (dataUser === null) {
        return res.status(401).json('User not found');
      }

      let isAdmin: boolean = false;
      dataUser.role.map((x: any) => {
        if (x.name === 'admin') {
          isAdmin = true;
        }
      });

      if (isAdmin) {
        return res.render('messages', { user: dataUser, admin: true });
      }

      return res.render('messages', { user: dataUser, admin: false });
    } catch (err: any) {
      logger.error.error({ message: err.message });
    }
  }
  async getMessagesByUser(
    req: Request,
    res: Response,
  ): Promise<Response | void> {
    const user = req.session?.passport.user;
    try {
      const dataUser: IUser | null = await authService.findUserById(user);
      if (dataUser === null) {
        return res.status(401).json('User not found');
      }

      const messages = await messageService.getMessagesByUser(user);
      if (messages === null) {
        return res.status(401).json('User not found');
      }

      return res.json(messages);
    } catch (err: any) {
      logger.error.error({ message: err.message });
    }
  }
}
