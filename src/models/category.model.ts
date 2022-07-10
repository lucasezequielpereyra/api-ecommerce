import { Schema, model } from 'mongoose';
import { ICategory } from '../interfaces/category.interface';

const categorySchema = new Schema<ICategory>(
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

export const CategoryModel = model<ICategory>('Category', categorySchema);
