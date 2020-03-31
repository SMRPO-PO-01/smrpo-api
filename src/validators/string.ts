import { Injectable } from '@nestjs/common';
import { PipeTransform } from '@nestjs/common/interfaces/features/pipe-transform.interface';

@Injectable()
export class DefaultStringPipe implements PipeTransform<string> {
  defaultVal: string;

  constructor(defaultVal?: string) {
    this.defaultVal = defaultVal || '';
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value, metadata) {
    return value || this.defaultVal;
  }
}
