import { Injectable } from '@nestjs/common';
import { PipeTransform } from '@nestjs/common/interfaces/features/pipe-transform.interface';

@Injectable()
export class EmptySearchPipe implements PipeTransform<string> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value, metadata) {
    return value || '';
  }
}
