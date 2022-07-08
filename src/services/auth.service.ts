import { IUser } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcryptjs';

export class AuthService {
  async newUser(user: IUser): Promise<IUser> {
    const newUser = new UserModel(user);
    return await newUser.save();
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email: email });
  }

  async findUserById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  async comparePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, userPassword);
  }
}
