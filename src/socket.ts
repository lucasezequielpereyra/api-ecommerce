import { Server } from 'socket.io';
import { AuthService } from './services/auth.service';
import { MessageService } from './services/message.service';
import { MessagesModel } from './models/message.model';
import { IUser } from './interfaces/user.interface';
import logger from './config/logger';

const messageService = new MessageService();

export const startScoket = (server: any) => {
  const io = new Server(server);
  const authService = new AuthService();

  io.on('connection', async (socket: any) => {
    logger.info.info('New user connected');

    let user: IUser | null = null;
    let isAdmin: boolean = false;
    let userRole: string = 'user';
    // First Update
    socket.on('check-user', async (data: any) => {
      user = await authService.findUserByEmail(data.email);
      if (user === null) {
        return socket.emit('user-not-found');
      }
      user.role.map((x: any) => {
        if (x.name === 'admin') {
          isAdmin = true;
          userRole = 'admin';
        }
      });
      if (isAdmin) {
        const messageData = await messageService.getMessages();
        socket.emit('update-data', messageData);
      }
    });

    socket.on('add-message', async (data: any) => {
      if (user !== null) {
        const message = new MessagesModel({
          email: user.email,
          message: data.message,
          typeUser: userRole,
          user: user._id,
          responseTo: data.responseTo,
        });

        await messageService.newMessage(message);
      }
      const messageData = await messageService.getMessages();
      io.sockets.emit('update-data', messageData);
    });
  });
};
