import { Injectable } from '@nestjs/common';
import { UserClass } from '@prisma/client';
import { AddUserClassDto } from './dto/user-class.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserClassService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUserClass(key: string, search: string): Promise<UserClass[]> {
    if (search) {
      const listUserClass = await this.prisma.userClass.findMany({
        where: {
          [key]: +search,
        },
        include: {
          class: true,
        },
      });

      return listUserClass;
    } else {
      const listUserClass = await this.prisma.userClass.findMany({
        include: {
          class: true,
        },
      });
      return listUserClass;
    }
  }

  async addUserClass(body: AddUserClassDto): Promise<{ count: number }> {
    const { userId, classId } = body;
    const newBody = userId.map((el) => ({ userId: el, classId }));
    const results = await this.prisma.userClass.createMany({
      data: newBody,
    });
    return results;
  }

  async updateUserClassBeforeDelete(
    fieldId: number,
    key: string,
  ): Promise<{ count: number }> {
    const result = await this.prisma.userClass.deleteMany({
      where: {
        [key]: fieldId,
      },
    });

    return result;
  }

  async deleteUserClass(
    fieldId: number[],
    key: string,
  ): Promise<{ count: number }> {
    const result = await this.prisma.userClass.deleteMany({
      where: {
        [key]: {
          in: fieldId,
        },
      },
    });

    return result;
  }

  async deleteAllUserClass(): Promise<{ count: number }> {
    const result = await this.prisma.userClass.deleteMany({});
    return result;
  }
}
