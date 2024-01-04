import { Module } from '@nestjs/common';
import { DecentralizationService } from './decentralization.service';
import { DecentralizationController } from './decentralization.controller';
import { JwtStrategy } from 'src/auth/jwt.stragegy';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [DecentralizationController],
  providers: [DecentralizationService, JwtStrategy, AuthService],
})
export class DecentralizationModule {}
