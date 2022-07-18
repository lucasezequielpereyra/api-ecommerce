import { Router, Request, Response } from 'express';
import { MessagesController } from '../controllers/messages.controller';
import { verifyToken } from '../middlewares/verifyJwt';

export const router: Router = Router();
const messagesController = new MessagesController();

router.get('/login', (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    return res.redirect('/messages/');
  }
  res.render('login');
});
router.get('/', [verifyToken], messagesController.getMessages);
