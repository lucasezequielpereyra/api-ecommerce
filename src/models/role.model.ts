import { Schema, model } from 'mongoose';
import { IRole } from '../interfaces/role.interface';

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

export const RoleModel = model<IRole>('Role', roleSchema);
