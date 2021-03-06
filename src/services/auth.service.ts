import { IUser } from '../interfaces/user.interface';
import { IRole } from '../interfaces/role.interface';
import { UserModel } from '../models/user.model';
import { RoleModel } from '../models/role.model';
import { ObjectId } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  async newUser(user: IUser): Promise<IUser> {
    const newUser = new UserModel(user);
    return await newUser.save();
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email: email }).populate('role');
  }

  async findUserById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id).populate('role');
  }

  async comparePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, userPassword);
  }

  getUserToken(user: IUser): string {
    return jwt.sign({ id: user._id }, String(process.env.JWT_PHRASE), {
      expiresIn: 3600000,
    });
  }

  async findRoleByName(name: string): Promise<IRole | null> {
    return await RoleModel.findOne({ name });
  }

  async getUserEmail(id: ObjectId): Promise<string | null> {
    const user = await UserModel.findById(id);
    if (!user) {
      return null;
    } else {
      return user.email;
    }
  }

  async getUserRoles(id: ObjectId): Promise<ObjectId[] | null> {
    const user = await UserModel.findById(id);
    if (!user) {
      return null;
    } else {
      return user.role;
    }
  }
}
