import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';
import { Lessons, Classes } from '@prisma/client';

export class AddLessonDto {
  @IsNotEmpty()
  @IsDateString()
  learningDate: Date;

  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  @IsNotEmpty()
  @IsNumber()
  classId: number;
}

export class EditLessonDto extends PartialType(AddLessonDto) {}

export type LessonDetails = Lessons & {
  class: Classes;
};
