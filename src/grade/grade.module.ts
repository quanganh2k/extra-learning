import { Module } from '@nestjs/common';
import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';
import { ClassService } from 'src/class/class.service';

@Module({
  controllers: [GradeController],
  providers: [GradeService, ClassService],
})
export class GradeModule {}
