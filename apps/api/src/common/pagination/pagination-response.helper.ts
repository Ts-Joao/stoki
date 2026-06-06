import { PaginationDto } from './dto/pagination.dto';

export function buildPaginationResponse<T>(
  data: T[],
  total: number,
  pagination: PaginationDto,
) {
  return {
    data,
    meta: {
      total,
      page: pagination.offset,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
}
