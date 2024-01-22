import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class AddExamDto {
  @IsNotEmpty()
  @IsDateString()
  examDay: Date;

  @IsNotEmpty()
  @IsNumber()
  classId: number;
}

export class EditExamDto extends PartialType(AddExamDto) {}
