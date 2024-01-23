import {
  Body,
  Controller,
  Delete,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserClassService } from './user-class.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AddUserClassDto } from './dto/user-class.dto';

@Controller('user-class')
export class UserClassController {
  constructor(private readonly userClassService: UserClassService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addUserClass(@Body() body: AddUserClassDto) {
    const newUserClass = await this.userClassService.addUserClass(body);

    return {
      message: 'Add user to class successully',
      data: newUserClass,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUserClass(@Query('userIds') userIds: string[]) {
    if (userIds) {
      const newUserIds = userIds.map((el) => +el);
      await this.userClassService.deleteUserClass(newUserIds, 'userId');

      return {
        message: 'Delete user from class successfully',
      };
    } else {
      await this.userClassService.deleteAllUserClass();
      return {
        message: 'Delete user successfully',
      };
    }
  }
}
