import { Module } from '@nestjs/common';
import { UserClassService } from './user-class.service';
import { UserClassController } from './user-class.controller';

@Module({
  controllers: [UserClassController],
  providers: [UserClassService],
})
export class UserClassModule {}
