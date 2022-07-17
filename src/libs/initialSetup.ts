import { RoleModel } from '../models/role.model';
import { UserModel } from '../models/user.model';
import { IRole } from '../interfaces/role.interface';
const mongoose = require('mongoose');
import logger from '../config/logger';

export const createRoles = async () => {
  try {
    const count: number = await RoleModel.countDocuments();

    if (count > 0) return;

    const roles: IRole[] = [
      {
        _id: new mongoose.Types.ObjectId('62c4e4137c2de4d4675be0af'),
        name: 'admin',
      },
      {
        _id: new mongoose.Types.ObjectId('62c4e41bac7d3182e9815b5b'),
        name: 'user',
      },
    ];

    logger.info.info('Creating roles');
    return await RoleModel.create(roles);
  } catch (error) {
    logger.error.error(error);
  }
};

export const createDefaultUsers = async () => {
  try {
    const count: number = await UserModel.countDocuments();

    if (count > 0) return;

    const user = new UserModel({
      name: 'user',
      email: 'user@user.com',
      password: 'user',
      role: [new mongoose.Types.ObjectId('62c4e41bac7d3182e9815b5b')],
    });

    const admin = new UserModel({
      name: 'admin',
      email: 'admin@admin.com',
      password: 'admin',
      role: [new mongoose.Types.ObjectId('62c4e4137c2de4d4675be0af')],
    });

    user.save();
    admin.save();

    logger.info.info('------- Creating default users -------');
    logger.info.info(user);
    logger.info.info(admin);
  } catch (error) {
    logger.error.error(error);
  }
};
