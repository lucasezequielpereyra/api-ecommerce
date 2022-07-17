import { transporter } from '../config/mailer';
import { IUser } from '../interfaces/user.interface';
import { IOrder } from '../interfaces/order.interface';

const ADMIN_EMAIL: string = String(process.env.ADMIN_EMAIL);

export const newBuyerEmail = async (user: IUser, order: IOrder) => {
  const tmailOptions = {
    toEmail: ADMIN_EMAIL,
    userName: user.name,
    userEmail: user.email,
    orderId: order._id,
  };

  await transporter.sendMail({
    from: '"E-COMMERCE" <info@ecommerce.com>', // sender address
    to: tmailOptions.toEmail, // list of receivers
    subject: 'Nueva Compra Registrada !', // Subject line
    html: `
      <h1>Nueva Compra</h1>
      <h3>El usuario ${tmailOptions.userName} ha realizado una compra</h3>
      <p>Email del usuario: ${tmailOptions.userEmail} </p>
      <p>Numero de orden: ${tmailOptions.orderId} </p>
    `,
  });
};
