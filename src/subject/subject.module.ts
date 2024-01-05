import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { ClassService } from 'src/class/class.service';

@Module({
  controllers: [SubjectController],
  providers: [SubjectService, ClassService],
})
export class SubjectModule {}
