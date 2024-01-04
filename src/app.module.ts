import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { DecentralizationModule } from './decentralization/decentralization.module';

@Module({
  imports: [AuthModule, PrismaModule, DecentralizationModule],
})
export class AppModule {}
