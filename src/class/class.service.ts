import { Injectable } from '@nestjs/common';
import { Classes } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Filters } from 'src/common/models';
import { AddClassDto, EditClassDto } from './dto/class.dto';
import { countDayOccurrences, specifyDayOfWeek } from 'src/utils/helpers';
import * as moment from 'moment';

@Injectable()
export class ClassService {
  constructor(private readonly prisma: PrismaService) {}

  async countClasses(query: Filters): Promise<number> {
    const { search } = query;
    const searchValue = search || '';

    const totalData = await this.prisma.classes.count({
      where: {
        name: {
          contains: searchValue,
        },
      },
    });

    return totalData;
  }

  async getAllClasses(query: Filters): Promise<Classes[]> {
    const { page, pageSize, search } = query;
    const skipValue = (page - 1) * pageSize;
    const searchValue = search || '';

    const listClasses = await this.prisma.classes.findMany({
      take: pageSize,
      skip: skipValue,
      where: {
        name: {
          contains: searchValue,
        },
      },
      include: {
        subject: true,
        grade: true,
      },
    });

    return listClasses;
  }

  async getOptionsClass(): Promise<Classes[]> {
    const listClasses = await this.prisma.classes.findMany();
    return listClasses;
  }

  async getClassById(id: number): Promise<Classes> {
    const result = await this.prisma.classes.findUnique({
      where: {
        id,
      },
      include: {
        subject: true,
        grade: true,
      },
    });

    return result;
  }

  async getClassByName(name: string): Promise<Classes> {
    const result = await this.prisma.classes.findUnique({
      where: {
        name,
      },
      include: {
        subject: true,
        grade: true,
      },
    });

    return result;
  }

  async addClass(body: AddClassDto): Promise<Classes> {
    const newClass = await this.prisma.classes.create({
      data: body,
    });

    return newClass;
  }

  async editClass(id: number, body: EditClassDto): Promise<Classes> {
    const updatedClass = await this.prisma.classes.update({
      where: {
        id,
      },
      data: body,
    });

    return updatedClass;
  }

  async deleteClass(id: number): Promise<Classes> {
    const result = await this.prisma.classes.delete({
      where: {
        id,
      },
    });

    return result;
  }

  async deleteAllClasses(): Promise<{ count: number }> {
    const result = await this.prisma.classes.deleteMany({});
    return result;
  }

  async updateClassBeforeDelete(
    fieldId: number,
    key: string,
  ): Promise<{ count: number }> {
    const results = await this.prisma.classes.updateMany({
      where: {
        [key]: fieldId,
      },
      data: {
        [key]: null,
      },
    });

    return results;
  }

  async updateClassBeforeDeleteAll(
    fieldIds: number[],
    key: string,
  ): Promise<{ count: number }> {
    const results = await this.prisma.classes.updateMany({
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

  async calculateTotalFee(
    month: Date,
    studyTime: string,
    fee: number,
  ): Promise<number> {
    const studyTimeArr = studyTime.split(',');
    const days = [];
    for (let i = 0; i < studyTimeArr.length; i++) {
      const element = studyTimeArr[i].trim();
      const elementArr = element.split(' ');
      const specifyDay = elementArr.slice(0, 2).join(' ');

      const dayOfWeek = specifyDayOfWeek(specifyDay);
      days.push(dayOfWeek);
    }

    const formatMonth = moment
      .utc(month, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      .format('YYYY-MM-DD');
    const [year, monthValue] = formatMonth.split('-');

    const dayOccurrences = countDayOccurrences(+year, +monthValue, days);
    const totalFee = dayOccurrences * fee;
    return totalFee;
  }
}
