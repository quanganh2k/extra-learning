import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { DecentralizationModule } from './decentralization/decentralization.module';
import { SubjectModule } from './subject/subject.module';
import { GradeModule } from './grade/grade.module';
import { ClassModule } from './class/class.module';

@Module({
  imports: [AuthModule, PrismaModule, DecentralizationModule, SubjectModule, GradeModule, ClassModule],
})
export class AppModule {}
