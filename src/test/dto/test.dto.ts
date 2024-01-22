import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Exams, Tests, Users } from '@prisma/client';

export class AddTestDto {
  @IsNotEmpty()
  @IsString()
  studentName: string;

  @IsOptional()
  @IsNumber()
  numberOfQuestions: number;

  @IsOptional()
  @IsNumber()
  maxScore: number;

  @IsOptional()
  @IsNumber()
  scoreAchieved: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  examId: number;
}

export class EditTestDto extends PartialType(AddTestDto) {}

export type TestDetails = Tests & {
  user: Users;
  exam: Exams;
};
