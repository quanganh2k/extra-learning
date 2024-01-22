import { Injectable } from '@nestjs/common';
import { Exams } from '@prisma/client';
import * as moment from 'moment';
import { PrismaService } from 'prisma/prisma.service';
import { Filters } from 'src/common/models';
import { DEFAULT_END_TIME, DEFAULT_START_TIME } from 'src/utils/constants';
import { AddExamDto, EditExamDto } from './dto/exam.dto';

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}

  async countExams(query: Filters): Promise<number> {
    const { targetDay } = query;

    let queryTargetDay = {};
    if (targetDay) {
      const formatTargetDay = moment
        .utc(targetDay, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        .format('YYYY-MM-DD');
      const gteTargetDay = `${formatTargetDay}${DEFAULT_START_TIME}`;
      const lteTargetDay = `${formatTargetDay}${DEFAULT_END_TIME}`;

      queryTargetDay = [
        {
          examDay: {
            gte: gteTargetDay,
          },
        },
        {
          examDay: {
            lte: lteTargetDay,
          },
        },
      ];
    }

    const totalExams = await this.prisma.exams.count({
      where: {
        AND: queryTargetDay,
      },
    });

    return totalExams;
  }

  async getAllExams(query: Filters): Promise<Exams[]> {
    const { page, pageSize, targetDay } = query;
    const skipValue = (page - 1) * pageSize;

    let queryTargetDay = {};
    if (targetDay) {
      const formatTargetDay = moment
        .utc(targetDay, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        .format('YYYY-MM-DD');
      const gteTargetDay = `${formatTargetDay}${DEFAULT_START_TIME}`;
      const lteTargetDay = `${formatTargetDay}${DEFAULT_END_TIME}`;

      queryTargetDay = [
        {
          examDay: {
            gte: gteTargetDay,
          },
        },
        {
          examDay: {
            lte: lteTargetDay,
          },
        },
      ];
    }

    const listExams = await this.prisma.exams.findMany({
      take: pageSize,
      skip: skipValue,
      where: {
        AND: queryTargetDay,
      },
    });

    return listExams;
  }

  async getOptionsExam(): Promise<Exams[]> {
    const results = await this.prisma.exams.findMany();

    return results;
  }

  async getExamById(id: number): Promise<Exams> {
    const exam = await this.prisma.exams.findUnique({
      where: {
        id,
      },
      include: {
        class: true,
      },
    });

    return exam;
  }

  async addExam(body: AddExamDto): Promise<Exams> {
    const newExam = await this.prisma.exams.create({
      data: body,
    });

    return newExam;
  }

  async editExam(id: number, body: EditExamDto): Promise<Exams> {
    const updatedExam = await this.prisma.exams.update({
      where: {
        id,
      },
      data: body,
    });

    return updatedExam;
  }

  async deleteExam(id: number): Promise<Exams> {
    const result = await this.prisma.exams.delete({
      where: {
        id,
      },
    });

    return result;
  }

  async deleteAllExams(): Promise<{ count: number }> {
    const result = await this.prisma.exams.deleteMany({});

    return result;
  }

  async updateExamBeforeDelete(
    fieldId: number,
    key: string,
  ): Promise<{ count: number }> {
    const results = await this.prisma.exams.updateMany({
      where: {
        [key]: fieldId,
      },
      data: {
        [key]: null,
      },
    });

    return results;
  }

  async updateExamBeforeDeleteAll(
    fieldIds: number[],
    key: string,
  ): Promise<{ count: number }> {
    const results = await this.prisma.exams.updateMany({
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
