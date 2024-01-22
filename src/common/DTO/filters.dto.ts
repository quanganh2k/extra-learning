import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsOptional()
  @IsDateString()
  targetDay: Date;

  @IsOptional()
  @IsDateString()
  from: Date;

  @IsOptional()
  @IsDateString()
  to: Date;
}
