import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FiltersDto {
  @IsNotEmpty()
  @IsString()
  page: string;

  @IsNotEmpty()
  @IsString()
  pageSize: string;

  @IsOptional()
  @IsString()
  search: string;
}
