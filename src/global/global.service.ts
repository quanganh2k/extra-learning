import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalService {
  paginationHandler(data: any, page: number, pageSize: number) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const results = data.slice(startIndex, endIndex);

    return results;
  }
}
