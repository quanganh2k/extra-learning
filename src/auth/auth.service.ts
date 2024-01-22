import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto, SignInDto } from './dto/auth.dto';
import { Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constants';
import { Filters } from 'src/common/models';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async signUp(body: AuthDto): Promise<Users> {
    const newUser = await this.prisma.users.create({
      data: body,
    });

    return newUser;
  }

  async getUserByEmail(email: string): Promise<Users> {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
      },
      include: {
        decentralization: true,
      },
    });

    return user;
  }

  async countUsers(query: Filters): Promise<number> {
    const { search } = query;

    const searchValue = search || '';
    const totalData = await this.prisma.users.count({
      where: {
        OR: [
          {
            firstName: {
              contains: searchValue,
            },
          },
          {
            lastName: {
              contains: searchValue,
            },
          },
          {
            email: {
              contains: searchValue,
            },
          },
          {
            phoneNumber: {
              contains: searchValue,
            },
          },
        ],
      },
    });

    return totalData;
  }

  async getAllUsers(query: Filters): Promise<Omit<Users, 'password'>[]> {
    const { page, pageSize, search } = query;
    const skipValue = (page - 1) * pageSize;
    const searchValue = search || '';

    const listUsers = await this.prisma.users.findMany({
      take: pageSize,
      skip: skipValue,
      where: {
        OR: [
          {
            firstName: {
              contains: searchValue,
            },
          },
          {
            lastName: {
              contains: searchValue,
            },
          },
          {
            email: {
              contains: searchValue,
            },
          },
          {
            phoneNumber: {
              contains: searchValue,
            },
          },
        ],
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        dob: true,
        address: true,
        gender: true,
        phoneNumber: true,
        decentralizationId: true,
        decentralization: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return listUsers;
  }

  async getOptionsUser(): Promise<Users[]> {
    const results = await this.prisma.users.findMany();
    return results;
  }

  async getUserById(id: number): Promise<Users> {
    const result = await this.prisma.users.findUnique({
      where: {
        id,
      },
      include: {
        decentralization: true,
      },
    });

    return result;
  }

  async editUser(
    id: number,
    body: Omit<SignInDto, 'email' | 'password' | 'decentralizationId'>,
  ): Promise<Users> {
    const updatedUser = await this.prisma.users.update({
      where: {
        id,
      },
      data: body,
    });

    return updatedUser;
  }

  async deleteUser(id: number): Promise<Users> {
    const user = await this.prisma.users.delete({
      where: {
        id,
      },
    });

    return user;
  }

  async deleteAllUsers(): Promise<{ count: number }> {
    const result = await this.prisma.users.deleteMany({});

    return result;
  }

  async updateUserBeforeDelete(
    id: number,
    key: string,
  ): Promise<{ count: number }> {
    const updatedUser = await this.prisma.users.updateMany({
      where: {
        [key]: id,
      },
      data: {
        [key]: null,
      },
    });

    return updatedUser;
  }

  async updateBeforeDeleteAll(
    ids: number[],
    key: string,
  ): Promise<{ count: number }> {
    const updatedUser = await this.prisma.users.updateMany({
      where: {
        [key]: {
          in: ids,
        },
      },
      data: {
        [key]: null,
      },
    });

    return updatedUser;
  }

  async handleHashingPassword(password: string): Promise<string> {
    const saltOrRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  }

  async comparePassword(args: {
    password: string;
    hash: string;
  }): Promise<boolean> {
    return bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: { userId: number; email: string }): Promise<string> {
    const payload = args;

    return this.jwt.signAsync(payload, { secret: jwtSecret });
  }

  async decodeToken(token: string): Promise<any> {
    const decodedToken = await this.jwt.decode(token, { complete: true });

    return decodedToken;
  }

  async changePassword(id: number, newPassword: string): Promise<Users> {
    const newUser = await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        password: newPassword,
      },
    });

    return newUser;
  }
}
