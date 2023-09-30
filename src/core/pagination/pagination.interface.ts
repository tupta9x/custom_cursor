import { EOperatorPagination } from './pagination.enum';

export interface IPaginationQuery {
  page: number;
  limit: number;
  filters: IPaginationQueryFilter[];
}
export interface IPaginationQueryFilter {
  field: string;
  operator: EOperatorPagination;
  value: string;
}

export interface IPaginationQueryResultMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
export interface IPaginationQueryResultLink {
  first?: string;
  previous?: string;
  next?: string;
  last?: string;
}

export interface IPaginationQueryResult<T> {
  data: T[];
  meta: IPaginationQueryResultMeta;
  link: IPaginationQueryResultLink;
}
