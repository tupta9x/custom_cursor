import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schema/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService implements OnModuleInit {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}
  async onModuleInit() {
    const initData: CreateCategoryDto[] = [
      {
        name: 'anime',
      },
      {
        name: 'flower',
      },
    ];

    const count = await this.categoryModel.count();
    if(!count) {
      await this.categoryModel.create(initData)
    } 
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const res = this.categoryModel.create(createCategoryDto);
    return res;
  }

  async findAll(): Promise<Category[]> {
    const categorys = this.categoryModel.find();
    return categorys;
  }

  async findOne(id: string): Promise<Category> {
    const category = this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException('Book not found.');
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
      new: true,
      runValidators: true,
    });
  }

  async remove(id: string) {
    return await this.categoryModel.findByIdAndDelete(id);
  }
}
