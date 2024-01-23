import { PartialType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class AddAcademicTranscriptDto {
  @IsNotEmpty()
  @IsDateString()
  month: Date;

  @IsOptional()
  @IsNumber()
  firstTime: number;

  @IsOptional()
  @IsNumber()
  secondTime: number;

  @IsOptional()
  @IsNumber()
  thirdTime: number;

  @IsOptional()
  @IsNumber()
  fourthTime: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  classId: number;
}

export class EditAcademicTranscriptDto extends PartialType(
  AddAcademicTranscriptDto,
) {}
