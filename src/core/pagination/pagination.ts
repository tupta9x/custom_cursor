import { ApiProperty } from '@nestjs/swagger';
import { EOperatorPagination } from './pagination.enum';
import {
  IPaginationQuery,
  IPaginationQueryFilter,
  IPaginationQueryResult,
  IPaginationQueryResultLink,
  IPaginationQueryResultMeta,
} from './pagination.interface';
import { Transform } from 'class-transformer';
import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class PaginationQuery implements IPaginationQuery {
  @ApiProperty({
    required: true,
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  page: number;
  @ApiProperty({
    required: true,
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  limit: number;
  @ApiProperty({
    description: `Filters\n - field: string\n  - operator: ${(
      Object.values(EOperatorPagination) as string[]
    )?.join(' | ')}\n  - value: string`,
    required: false,
    example: [`{ "field": "name", "operator": "like", "value": "test" }`],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!Array.isArray(value)) {
      return [JSON.parse(value)];
    }
    return value.map((item) => JSON.parse(item));
  })
  filters: PaginationQueryFilter[];
  originHost: string;
}

export class PaginationQueryFilter implements IPaginationQueryFilter {
  @ApiProperty({
    required: true,
    default: 'id',
  })
  field: string;
  @ApiProperty({
    required: true,
    default: EOperatorPagination.EQ,
  })
  operator: EOperatorPagination;
  @ApiProperty({
    required: true,
    default: '0000-0000-0000-0000',
  })
  value: string;
}

export class PaginationQueryResultMeta implements IPaginationQueryResultMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export class PaginationQueryResultLink implements IPaginationQueryResultLink {
  first?: string;
  previous?: string;
  next?: string;
  last?: string;
}

export class PaginationQueryResult<T> implements IPaginationQueryResult<T> {
  data: T[];
  meta: PaginationQueryResultMeta;
  link: PaginationQueryResultLink;
}
