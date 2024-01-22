import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { LessonService } from 'src/lesson/lesson.service';
import { ExamService } from 'src/exam/exam.service';
import { GlobalService } from 'src/global/global.service';

@Module({
  controllers: [ClassController],
  providers: [ClassService, LessonService, ExamService, GlobalService],
})
export class ClassModule {}
