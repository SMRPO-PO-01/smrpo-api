import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class OptionalParseIntPipe {
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
