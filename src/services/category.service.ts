import { ICategory } from '../interfaces/category.interface';
import { CategoryModel } from '../models/category.model';

export class CategoryService {
  async newCategory(category: ICategory): Promise<ICategory> {
    const newCategory = new CategoryModel({ name: category });
    return await newCategory.save();
  }

  async listCategories(): Promise<ICategory[] | null> {
    return await CategoryModel.find();
  }
}
