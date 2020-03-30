import { Injectable } from '@nestjs/common';

@Injectable()
export class EmptySearchPipe {
  transform(value, metadata) {
    return value || '';
  }
}
