import { IRole } from '../interfaces/role.interface';
import { RoleModel } from '../models/role.model';

export class RoleService {
  async newRole(role: IRole): Promise<IRole> {
    const newRole = new RoleModel(role);
    return await newRole.save();
  }

  async findRoleById(id: string): Promise<IRole | null> {
    return await RoleModel.findById(id);
  }

  async findRoleByName(name: string): Promise<IRole | null> {
    return await RoleModel.findOne({ name });
  }

  async findMultipleRoles(ids: string[]): Promise<IRole[]> {
    return await RoleModel.find({ name: { $in: ids } });
  }
}
