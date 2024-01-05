import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddSubjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class EditSubjectDto extends PartialType(AddSubjectDto) {}
