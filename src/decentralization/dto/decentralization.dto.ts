import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddDecentralization {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class EditDecentralization extends PartialType(AddDecentralization) {}
