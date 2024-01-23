import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { LessonService } from 'src/lesson/lesson.service';
import { ExamService } from 'src/exam/exam.service';
import { GlobalService } from 'src/global/global.service';
import { UserClassService } from 'src/user-class/user-class.service';
import { AcademicTranscriptService } from 'src/academic-transcript/academic-transcript.service';

@Module({
  controllers: [ClassController],
  providers: [
    ClassService,
    LessonService,
    ExamService,
    GlobalService,
    UserClassService,
    AcademicTranscriptService,
  ],
})
export class ClassModule {}
