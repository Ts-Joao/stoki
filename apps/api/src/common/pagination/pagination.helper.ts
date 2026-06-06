import { PaginationDto } from "./dto/pagination.dto";

export function getPagination({ offset, limit }: PaginationDto) {
  return {
    skip: (offset - 1) * limit,
    take: limit
  }
}