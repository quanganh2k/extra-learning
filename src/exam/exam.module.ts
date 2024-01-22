import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { TestService } from 'src/test/test.service';

@Module({
  controllers: [ExamController],
  providers: [ExamService, TestService],
})
export class ExamModule {}
