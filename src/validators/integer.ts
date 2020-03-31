import { BadRequestException, Injectable } from '@nestjs/common';
import { PipeTransform } from '@nestjs/common/interfaces/features/pipe-transform.interface';

@Injectable()
export class OptionalParseIntPipe implements PipeTransform<string> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value, metadata) {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
