import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AddUserClassDto {
  @IsNotEmpty()
  @IsArray()
  userId: number[];

  @IsNotEmpty()
  @IsNumber()
  classId: number;
}
