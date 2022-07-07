import { RoleModel } from '../models/role.model';
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
