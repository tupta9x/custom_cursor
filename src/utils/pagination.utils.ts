import { EOperatorPagination } from 'src/core/pagination/pagination.enum';
import * as _ from 'lodash';

export const filterOption = (
  field: string,
  operator: EOperatorPagination,
  value,
) => {
  let filter: any;
  switch (operator) {
    case EOperatorPagination.EQ:
      filter = value;
      break;
    case EOperatorPagination.NE:
      filter = { $ne: value };
      break;
    case EOperatorPagination.GT:
      filter = { $gt: value };
      break;
    case EOperatorPagination.GTE:
      filter = { $gte: value };
      break;
    case EOperatorPagination.LT:
      filter = { $lt: value };
      break;
    case EOperatorPagination.LTE:
      filter = { $lte: value };
      break;
    case EOperatorPagination.LIKE:
      filter = { $regex: value, $options: 'i' }; // Case-insensitive like
      break;
    case EOperatorPagination.IN:
      filter = { $in: value.split(',') }; // Assuming value is a comma-separated list
      break;
    default:
      break;
  }
  return { [field]: filter };
};
export const replaceHost = (
  originHost: string,
  newParams: Record<string, any>,
) => {
  const urlObj = new URL(originHost);
  const searchParams = urlObj.searchParams;

  // Update or add new parameters
  for (const key in newParams) {
    if (newParams.hasOwnProperty(key)) {
      searchParams.set(key, newParams[key]);
    }
  }
  return `${urlObj.origin}${urlObj.pathname}?${searchParams.toString()}${
    urlObj.hash
  }`;
};
