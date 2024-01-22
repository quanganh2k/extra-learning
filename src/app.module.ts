import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { DecentralizationModule } from './decentralization/decentralization.module';
import { SubjectModule } from './subject/subject.module';
import { GradeModule } from './grade/grade.module';
import { ClassModule } from './class/class.module';
import { LessonModule } from './lesson/lesson.module';
import { GlobaleModule } from './global/global.module';
import { ExamModule } from './exam/exam.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    DecentralizationModule,
    SubjectModule,
    GradeModule,
    ClassModule,
    LessonModule,
    GlobaleModule,
    ExamModule,
    TestModule,
  ],
})
export class AppModule {}
