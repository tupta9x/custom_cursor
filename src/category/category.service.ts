import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schema/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PaginationQuery,
  PaginationQueryResult,
  PaginationQueryResultLink,
  PaginationQueryResultMeta,
} from 'src/core/pagination/pagination';
import { filterOption, replaceHost } from 'src/utils/pagination.utils';

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
    if (!count) {
      await this.categoryModel.create(initData);
    }
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const res = this.categoryModel.create(createCategoryDto);
    return res;
  }

  async findAll(
    paginationQuery: PaginationQuery,
  ): Promise<PaginationQueryResult<Category>> {
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
    const categories = this.categoryModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit);
    const count = await this.categoryModel.count(filters);
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
    const paginated: PaginationQueryResult<Category> = {
      data: await categories,
      meta: meta,
      link: link,
    };
    return paginated;
  }

  async findOne(id: string): Promise<Category> {
    const category = this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found.');
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
