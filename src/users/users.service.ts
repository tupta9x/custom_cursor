import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../enums/role.enum';
import { PaginationQuery, PaginationQueryResult, PaginationQueryResultLink, PaginationQueryResultMeta } from 'src/core/pagination/pagination';
import { filterOption, replaceHost } from 'src/utils/pagination.utils';
import { hashPassword } from 'src/utils/password';

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
    createUserDto.password = await hashPassword(createUserDto.password);
    const res = await this.userModel.create({...createUserDto, roles:[Role.User]});
    return res;
  }

  async findAll(paginationQuery: PaginationQuery,): Promise<PaginationQueryResult<User>> {
    let filters = {};
    if (paginationQuery.filters) {
      paginationQuery.filters.map((filter) => {
        const getFilterOption = filterOption(
          filter.field,
          filter.operator,
          filter.value,
        );
        filters = { ...filters, ...getFilterOption };
      });
    }
    const { page, limit } = paginationQuery;
    const users = this.userModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await this.userModel.count(filters);
    const totalPage = Math.ceil(count / limit);
    const meta: PaginationQueryResultMeta = {
      page: page,
      limit: limit,
      totalItems: count,
      totalPages: totalPage,
    };
    const link: PaginationQueryResultLink = {
      ...(page > 1 && {
        first: replaceHost(paginationQuery.originHost, {
          page: 1,
          limit: limit,
        }),
      }),
      ...(page > 1 && {
        previous: replaceHost(paginationQuery.originHost, {
          page: page - 1,
          limit: limit,
        }),
      }),
      ...(page < totalPage && {
        next: replaceHost(paginationQuery.originHost, {
          page: page + 1,
          limit: limit,
        }),
      }),
      ...(page < totalPage && {
        last: replaceHost(paginationQuery.originHost, {
          page: totalPage,
          limit: limit,
        }),
      }),
    };
    const paginated: PaginationQueryResult<User> = {
      data: await users,
      meta: meta,
      link: link,
    };
    return paginated;
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
