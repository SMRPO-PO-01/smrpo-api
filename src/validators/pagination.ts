import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class Pagination {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  perPage = 10;

  get skip() {
    return (this.page - 1) * this.perPage;
  }

  get take() {
    return this.perPage;
  }
}
