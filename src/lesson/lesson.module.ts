import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { GlobalService } from 'src/global/global.service';
import { SubjectService } from 'src/subject/subject.service';
import { GradeService } from 'src/grade/grade.service';

@Module({
  controllers: [LessonController],
  providers: [LessonService, GlobalService, SubjectService, GradeService],
})
export class LessonModule {}
