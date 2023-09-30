import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../enums/role.enum';

require('dotenv').config();

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async onModuleInit() {
    const initData: { username: string; password: string; roles: string[] }[] = [
      {
        username: process.env.USERNAME_ADMIN,
        password: process.env.PASSWORD_ADMIN,
        roles: [Role.Admin, Role.User],
      },
    ];

    const count = await this.userModel.count();
    if (!count) {
      await this.userModel.create(initData);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findByUsername(createUserDto.username)
    if(user) {
      throw new NotFoundException('User already existed.');
    }
    const res = this.userModel.create({...createUserDto, roles:[Role.User]});
    return res;
  }

  async findAll(): Promise<User[]> {
    const users = this.userModel.find();
    return users;
  }

  async findOne(id: string): Promise<User | undefined> {
    const user = this.userModel.findOne({ id });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = this.userModel.findOne({ username });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
      runValidators: true,
    });
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id);
  }
}
