import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCursorDto } from './dto/create-cursor.dto';
import { UpdateCursorDto } from './dto/update-cursor.dto';
import { Cursor } from './schema/cursor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CursorService {

  constructor(@InjectModel(Cursor.name) private cursorModel: Model<Cursor>) {}
  // async onModuleInit() {
  //   const initData: CreateCursorDto[] = [
  //     {
  //       name: 'naruto',
  //       cursor:'base64',
  //       pointer: 'base64',
  //       category: ''
  //     },
  //     {
  //       name: 'songoku',
  //       cursor:'base64',
  //       pointer: 'base64',
  //       category: ''
  //     },
  //   ];

  //   const count = await this.cursorModel.count();
  //   if(!count) {
  //     await this.cursorModel.create(initData)
  //   } 
  // }

  async create(createCursorDto: CreateCursorDto): Promise<Cursor> {
    const res = this.cursorModel.create(createCursorDto).populate('category')
    return res;
  }

  async findAll(): Promise<Cursor[]> {
    const cursors = this.cursorModel.find().populate('category');
    return cursors;
  }

  async findOne(id: string): Promise<Cursor> {
    const cursor = this.cursorModel.findById(id).populate('category');

    if (!cursor) {
      throw new NotFoundException('Book not found.');
    }

    return cursor;
  }

  async update(id: string, updateCursorDto: UpdateCursorDto): Promise<Cursor> {
    return this.cursorModel.findByIdAndUpdate(id, updateCursorDto, {
      new: true,
      runValidators: true,
    }).populate('category');
  }

  async remove(id: string) {
    return await this.cursorModel.findByIdAndDelete(id);
  }
}
