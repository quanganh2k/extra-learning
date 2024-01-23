import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TestService } from 'src/test/test.service';
import { UserClassService } from 'src/user-class/user-class.service';
import { AcademicTranscriptService } from 'src/academic-transcript/academic-transcript.service';

@Module({
  imports: [JwtModule, PassportModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TestService,
    UserClassService,
    AcademicTranscriptService,
  ],
})
export class AuthModule {}
