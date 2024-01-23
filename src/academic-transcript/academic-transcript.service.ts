import { Injectable } from '@nestjs/common';
import { AcademicTranscripts } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Filters } from 'src/common/models';
import {
  AddAcademicTranscriptDto,
  EditAcademicTranscriptDto,
} from './dto/academic-transcript.dto';
import * as moment from 'moment';

@Injectable()
export class AcademicTranscriptService {
  constructor(private readonly prisma: PrismaService) {}

  async countAcademicTranscript(query: Filters): Promise<number> {
    const { search, targetDay } = query;

    if (targetDay && search) {
      const formatTargetDay = moment
        .utc(targetDay, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        .format('YYYY-MM-DD');
      const monthValue = formatTargetDay.split('-')[1];
      const queryTargetDay = {
        monthValue,
      };

      const queryUserId = {
        userId: +search,
      };

      const totalData = await this.prisma.academicTranscripts.count({
        where: {
          AND: [queryTargetDay, queryUserId],
        },
      });

      return totalData;
    }

    if (targetDay && !search) {
      const formatTargetDay = moment
        .utc(targetDay, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        .format('YYYY-MM-DD');
      const monthValue = formatTargetDay.split('-')[1];
      const queryTargetDay = {
        monthValue,
      };

      const totalData = await this.prisma.academicTranscripts.count({
        where: queryTargetDay,
      });

      return totalData;
    }

    if (!targetDay && search) {
      const queryUserId = {
        userId: +search,
      };

      const totalData = await this.prisma.academicTranscripts.count({
        where: queryUserId,
      });

      return totalData;
    }

    const totalData = await this.prisma.academicTranscripts.count();

    return totalData;
  }

  async getAllAcademicTranscripts(
    query: Filters,
  ): Promise<AcademicTranscripts[]> {
    const { page, pageSize, search, targetDay } = query;
    const skipValue = (page - 1) * pageSize;

    if (targetDay && search) {
      const formatTargetDay = moment
        .utc(targetDay, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        .format('YYYY-MM-DD');
      const monthValue = formatTargetDay.split('-')[1];
      const queryTargetDay = {
        monthValue,
      };
      const queryUserId = {
        userId: +search,
      };

      const result = await this.prisma.academicTranscripts.findMany({
        take: pageSize,
        skip: skipValue,
        where: {
          AND: [queryTargetDay, queryUserId],
        },
        include: {
          user: true,
          class: true,
        },
      });

      return result;
    }

    if (targetDay && !search) {
      const formatTargetDay = moment
        .utc(targetDay, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        .format('YYYY-MM-DD');
      const monthValue = formatTargetDay.split('-')[1];
      const queryTargetDay = {
        monthValue,
      };

      const result = await this.prisma.academicTranscripts.findMany({
        take: pageSize,
        skip: skipValue,
        where: queryTargetDay,
        include: {
          user: true,
          class: true,
        },
      });

      return result;
    }

    if (!targetDay && search) {
      const queryUserId = {
        userId: +search,
      };

      const result = await this.prisma.academicTranscripts.findMany({
        take: pageSize,
        skip: skipValue,
        where: queryUserId,
        include: {
          user: true,
          class: true,
        },
      });

      return result;
    }

    const result = await this.prisma.academicTranscripts.findMany({
      take: pageSize,
      skip: skipValue,
      include: {
        user: true,
        class: true,
      },
    });

    return result;

    // if (search) {
    //   const result = await this.prisma.academicTranscripts.findMany({
    //     take: pageSize,
    //     skip: skipValue,
    //     where: {
    //       userId: +search,
    //     },
    //   });

    //   return result;
    // } else {
    //   const result = await this.prisma.academicTranscripts.findMany({
    //     take: pageSize,
    //     skip: skipValue,
    //   });

    //   return result;
    // }
  }

  async getUniqueAcademicTranscript(
    targetDay: Date,
    userId: number,
    classId: number,
  ): Promise<AcademicTranscripts> {
    const formatTargetDay = moment
      .utc(targetDay, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      .format('YYYY-MM-DD');
    const monthValue = formatTargetDay.split('-')[1];
    const queryTargetDay = {
      monthValue,
    };

    const queryUserId = {
      userId,
    };

    const queryClassId = {
      classId,
    };
    const result = await this.prisma.academicTranscripts.findFirst({
      where: {
        AND: [queryTargetDay, queryUserId, queryClassId],
      },
    });

    return result;
  }

  async getAcademicTranscriptByUserId(
    userId: number,
  ): Promise<AcademicTranscripts[]> {
    const result = await this.prisma.academicTranscripts.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        class: true,
      },
    });

    return result;
  }

  async getAcademicTranscriptById(id: number): Promise<AcademicTranscripts> {
    const result = await this.prisma.academicTranscripts.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        class: true,
      },
    });

    return result;
  }

  async addAcademicTranscript(
    body: AddAcademicTranscriptDto,
  ): Promise<AcademicTranscripts> {
    const formatMonth = moment
      .utc(body.month, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      .format('YYYY-MM-DD');
    const monthValue = formatMonth.split('-')[1];
    const nextBody = {
      ...body,
      monthValue,
    };
    const newAcademicTranscript = await this.prisma.academicTranscripts.create({
      data: nextBody,
    });

    return newAcademicTranscript;
  }

  async editAcademicTranscript(
    id: number,
    body: EditAcademicTranscriptDto,
  ): Promise<AcademicTranscripts> {
    const formatMonth = moment
      .utc(body.month, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      .format('YYYY-MM-DD');
    const monthValue = formatMonth.split('-')[1];
    const nextBody = {
      ...body,
      monthValue,
    };
    const updatedAcademicTranscript =
      await this.prisma.academicTranscripts.update({
        where: {
          id,
        },
        data: nextBody,
      });

    return updatedAcademicTranscript;
  }

  async deleteAcademicTranscriptByUserId(
    userId: number,
  ): Promise<{ count: number }> {
    const result = await this.prisma.academicTranscripts.deleteMany({
      where: {
        userId,
      },
    });

    return result;
  }

  async deleteAcademicTranscript(id: number): Promise<AcademicTranscripts> {
    const result = await this.prisma.academicTranscripts.delete({
      where: {
        id,
      },
    });
    return result;
  }

  async deleteAllAcademicTranscript(): Promise<{ count: number }> {
    const result = await this.prisma.academicTranscripts.deleteMany({});
    return result;
  }

  async updateBeforeDelete(
    fieldId: number,
    key: string,
  ): Promise<{ count: number }> {
    const result = await this.prisma.academicTranscripts.updateMany({
      where: {
        [key]: fieldId,
      },
      data: {
        [key]: null,
      },
    });

    return result;
  }

  async updateBeforeDeleteAll(
    fieldIds: number[],
    key: string,
  ): Promise<{ count: number }> {
    const result = await this.prisma.academicTranscripts.updateMany({
      where: {
        [key]: {
          in: fieldIds,
        },
      },
      data: {
        [key]: null,
      },
    });

    return result;
  }
}
