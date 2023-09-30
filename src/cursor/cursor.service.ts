import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCursorDto } from './dto/create-cursor.dto';
import { UpdateCursorDto } from './dto/update-cursor.dto';
import { Cursor } from './schema/cursor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PaginationQuery,
  PaginationQueryResult,
  PaginationQueryResultLink,
  PaginationQueryResultMeta,
} from 'src/core/pagination/pagination';
import { filterOption, replaceHost } from 'src/utils/pagination.utils';
import { Category } from 'src/category/schema/category.schema';

@Injectable()
export class CursorService {
  constructor(@InjectModel(Cursor.name) private cursorModel: Model<Cursor>) {}
  // async onModuleInit() {
  //   const initData: CreateCursorDto[] = [s
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
    const res = this.cursorModel.create(createCursorDto);
    return res;
  }

  async findAll(
    paginationQuery: PaginationQuery,
  ): Promise<PaginationQueryResult<Cursor>> {
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
    const cursors = this.cursorModel
      .find()
      .populate('category')
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await this.cursorModel.count(filters);
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
    const paginated: PaginationQueryResult<Cursor> = {
      data: await cursors,
      meta: meta,
      link: link,
    };
    return paginated;
  }

  async findOne(id: string): Promise<Cursor> {
    const cursor = this.cursorModel.findById(id).populate('category');

    if (!cursor) {
      throw new NotFoundException('Book not found.');
    }

    return cursor;
  }

  async update(id: string, updateCursorDto: UpdateCursorDto): Promise<Cursor> {
    return this.cursorModel
      .findByIdAndUpdate(id, updateCursorDto, {
        new: true,
        runValidators: true,
      })
      .populate('category');
  }

  async remove(id: string) {
    return await this.cursorModel.findByIdAndDelete(id);
  }
}
