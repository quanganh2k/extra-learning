import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, ChangePasswordDto, SignInDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { FiltersDto } from 'src/common/DTO/filters.dto';
import { JwtAuthGuard } from './jwt.guard';
import { TestService } from 'src/test/test.service';
import { UserClassService } from 'src/user-class/user-class.service';
import { AcademicTranscriptService } from 'src/academic-transcript/academic-transcript.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly testService: TestService,
    private readonly userClassService: UserClassService,
    private readonly academicTranscriptService: AcademicTranscriptService,
  ) {}

  @Post('signup')
  async signup(@Body() body: AuthDto) {
    const foundUser = await this.authService.getUserByEmail(body.email);

    if (foundUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.authService.handleHashingPassword(
      body.password,
    );

    const bodyRequest = {
      ...body,
      password: hashedPassword,
    };

    const newUser = await this.authService.signUp(bodyRequest);

    delete newUser.password;

    return {
      message: 'Sign up successfully',
      data: newUser,
    };
  }

  @Post('signin')
  async signin(
    @Body() body: SignInDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const foundUser = await this.authService.getUserByEmail(body.email);

    if (!foundUser) {
      throw new BadRequestException('Invalid email or password');
    }

    const isMatchedPassword = await this.authService.comparePassword({
      password: body.password,
      hash: foundUser.password,
    });

    if (!isMatchedPassword) {
      throw new BadRequestException('Invalid email or password');
    }

    const token = await this.authService.signToken({
      userId: foundUser.id,
      email: foundUser.email,
    });

    if (!token) {
      throw new ForbiddenException();
    }

    res.cookie('token', token);

    delete foundUser.password;

    return res.send({
      message: 'Login successfully',
      data: foundUser,
    });
  }

  @Get('signout')
  async signout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('token');

    return res.send({
      message: 'Sign out successfully',
    });
  }

  @Get('user/:id')
  async getUserDetails(@Param('id') id: string) {
    const user = await this.authService.getUserById(+id);
    const userClass = await this.userClassService.getAllUserClass(
      'userId',
      String(user.id),
    );

    if (!user) {
      throw new NotFoundException();
    }

    const nextUser = { ...user, class: userClass };
    delete nextUser.password;
    return {
      data: nextUser,
    };
  }

  @Get('user')
  async getAllUsers(@Query() query: FiltersDto) {
    const page =
      query &&
      query.page &&
      Number.isSafeInteger(Number(query.page)) &&
      Number(query.page) > 0
        ? Number(query.page)
        : 1;
    const pageSize =
      query &&
      query.pageSize &&
      Number.isSafeInteger(Number(query.pageSize)) &&
      Number(query.pageSize) > 0
        ? Number(query.pageSize)
        : 10;

    const search = query && query.search ? query.search : '';

    const parsedQuery = {
      page,
      pageSize,
      search,
    };

    const listUsers = await this.authService.getAllUsers(parsedQuery);
    const results = [];
    for (let i = 0; i < listUsers.length; i++) {
      const eachUser = listUsers[i];
      const userClass = await this.userClassService.getAllUserClass(
        'userId',
        String(eachUser.id),
      );
      const nextUser = { ...eachUser, class: userClass };
      results.push(nextUser);
    }

    const totalUsers = await this.authService.countUsers(parsedQuery);
    const totalPage = Math.ceil(totalUsers / pageSize);

    return {
      data: results,
      paging: {
        page,
        pageSize,
        prevPage: page - 1 >= 1 ? page - 1 : null,
        nextPage: page + 1 <= totalPage ? page + 1 : null,
        totalPage,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user/update-profile')
  async updateProfile(
    @Req() req: Request,
    @Body() body: Omit<SignInDto, 'email' | 'password' | 'decentralizationId'>,
  ) {
    const tokenFromRequest = req.cookies.token;

    const decodedToken = await this.authService.decodeToken(tokenFromRequest);
    const { payload } = decodedToken;

    const foundUser = await this.authService.getUserById(+payload.userId);

    if (!foundUser) {
      throw new BadRequestException('User does not exist');
    }

    const newProfile = await this.authService.editUser(+payload.userId, body);
    const userDetails = await this.authService.getUserById(newProfile.id);

    delete userDetails.password;
    return {
      message: 'Update profile successfully',
      data: userDetails,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user/change-password')
  async changePassword(@Req() req: Request, @Body() body: ChangePasswordDto) {
    const tokenFromRequest = req.cookies.token;

    const decodedToken = await this.authService.decodeToken(tokenFromRequest);
    const { payload } = decodedToken;

    const foundUser = await this.authService.getUserById(+payload.userId);

    if (!foundUser) {
      throw new BadRequestException('User does not exist');
    }

    const isMatchedPassword = await this.authService.comparePassword({
      password: body.oldPassword,
      hash: foundUser.password,
    });

    if (!isMatchedPassword) {
      throw new BadRequestException('Invalid current password');
    }

    const hashedPassword = await this.authService.handleHashingPassword(
      body.newPassword,
    );

    await this.authService.changePassword(foundUser.id, hashedPassword);

    return {
      message: 'Change password successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user/:id')
  async editUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: Omit<SignInDto, 'email' | 'password' | 'decentralizationId'>,
  ) {
    const foundUser = await this.authService.getUserById(+id);

    if (!foundUser) {
      throw new BadRequestException('User does not exist');
    }

    const updatedUser = await this.authService.editUser(+id, body);
    const userDetails = await this.authService.getUserById(updatedUser.id);

    delete userDetails.password;
    return {
      message: 'Edit user successfully',
      data: userDetails,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user/:id')
  async deleteUser(@Param('id') id: string) {
    await this.testService.updateTestBeforeDelete(+id, 'userId');
    await this.userClassService.updateUserClassBeforeDelete(+id, 'userId');
    await this.academicTranscriptService.updateBeforeDelete(+id, 'userId');
    const user = await this.authService.deleteUser(+id);

    delete user.password;
    return {
      message: 'Delete user successfully',
      data: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user')
  async deleteAllUsers() {
    const listUsers = await this.authService.getOptionsUser();
    const userIds = listUsers.map((el) => el.id);
    await this.testService.updateTestBeforeDeleteAll(userIds, 'userId');
    await this.academicTranscriptService.updateBeforeDeleteAll(
      userIds,
      'userId',
    );
    await this.userClassService.deleteUserClass(userIds, 'userId');
    await this.authService.deleteAllUsers();

    return {
      message: 'Delete user successfully',
    };
  }
}
