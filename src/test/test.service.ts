import { Injectable } from '@nestjs/common';
import { Tests } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Filters } from 'src/common/models';
import { isNaN } from 'lodash';
import { AddTestDto, EditTestDto, TestDetails } from './dto/test.dto';

@Injectable()
export class TestService {
  constructor(private readonly prisma: PrismaService) {}

  async countTests(query: Filters): Promise<number> {
    const { search } = query;

    if (search) {
      const searchValue = Number(search);
      if (isNaN(searchValue)) {
        const totalData = await this.prisma.tests.count({
          where: {
            studentName: {
              contains: search,
            },
          },
        });

        return totalData;
      } else {
        const totalData = await this.prisma.tests.count({
          where: {
            OR: [
              {
                userId: +search,
              },
              {
                examId: +search,
              },
            ],
          },
        });

        return totalData;
      }
    } else {
      const totalData = await this.prisma.tests.count();

      return totalData;
    }
  }

  async getAllTest(query: Filters): Promise<TestDetails[]> {
    const { page, pageSize, search } = query;
    const skipValue = (page - 1) * pageSize;

    if (search) {
      const searchValue = Number(search);
      if (isNaN(searchValue)) {
        const listTests = await this.prisma.tests.findMany({
          take: pageSize,
          skip: skipValue,
          where: {
            studentName: {
              contains: search,
            },
          },
          include: {
            exam: true,
            user: true,
          },
        });
        return listTests;
      } else {
        const listTests = await this.prisma.tests.findMany({
          take: pageSize,
          skip: skipValue,
          where: {
            OR: [
              {
                userId: +search,
              },
              {
                examId: +search,
              },
            ],
          },
          include: {
            exam: true,
            user: true,
          },
        });

        return listTests;
      }
    } else {
      const listTests = await this.prisma.tests.findMany({
        take: pageSize,
        skip: skipValue,
        include: {
          exam: true,
          user: true,
        },
      });

      return listTests;
    }
  }

  async getTestById(id: number): Promise<TestDetails> {
    const test = await this.prisma.tests.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        exam: true,
      },
    });

    return test;
  }

  async addTest(body: AddTestDto): Promise<Tests> {
    const newTest = await this.prisma.tests.create({
      data: body,
    });

    return newTest;
  }

  async editTest(id: number, body: EditTestDto): Promise<Tests> {
    const updatedTest = await this.prisma.tests.update({
      where: {
        id,
      },
      data: body,
    });

    return updatedTest;
  }

  async deleteTest(id: number): Promise<Tests> {
    const result = await this.prisma.tests.delete({
      where: {
        id,
      },
    });
    return result;
  }

  async deleteAllTest(): Promise<{ count: number }> {
    const result = await this.prisma.tests.deleteMany({});

    return result;
  }

  async updateTestBeforeDelete(
    fieldId: number,
    key: string,
  ): Promise<{ count: number }> {
    const results = await this.prisma.tests.updateMany({
      where: {
        [key]: fieldId,
      },
      data: {
        [key]: null,
      },
    });

    return results;
  }

  async updateTestBeforeDeleteAll(
    fieldIds: number[],
    key: string,
  ): Promise<{ count: number }> {
    const results = await this.prisma.tests.updateMany({
      where: {
        [key]: {
          in: fieldIds,
        },
      },
      data: {
        [key]: null,
      },
    });

    return results;
  }
}
