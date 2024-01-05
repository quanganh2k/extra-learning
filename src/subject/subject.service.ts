import { Injectable } from '@nestjs/common';
import { Subjects } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Filters } from 'src/common/models';
import { AddSubjectDto, EditSubjectDto } from './dto/subject.dto';
import { isNaN } from 'lodash';

@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}

  async countSubjects(query: Filters): Promise<number> {
    const { search } = query;
    const searchValue = search || '';

    const isSearchByName = isNaN(+searchValue);

    if (isSearchByName) {
      const totalData = await this.prisma.subjects.count({
        where: {
          name: searchValue
            ? {
                contains: searchValue,
              }
            : undefined,
        },
      });

      return totalData;
    } else {
      const listSubjects = await this.prisma.subjects.count({
        where: {
          id: searchValue
            ? {
                equals: +searchValue,
              }
            : undefined,
        },
      });

      return listSubjects;
    }
  }

  async getAllSubjects(query: Filters): Promise<Subjects[]> {
    const { page, pageSize, search } = query;
    const skipValue = (page - 1) * pageSize;
    const searchValue = search || '';

    const isSearchByName = isNaN(+searchValue);

    if (isSearchByName) {
      const listSubjects = await this.prisma.subjects.findMany({
        take: pageSize,
        skip: skipValue,
        where: {
          name: searchValue
            ? {
                contains: searchValue,
              }
            : undefined,
        },
      });
      return listSubjects;
    } else {
      const listSubjects = await this.prisma.subjects.findMany({
        take: pageSize,
        skip: skipValue,
        where: {
          id: searchValue
            ? {
                equals: +searchValue,
              }
            : undefined,
        },
      });

      return listSubjects;
    }
  }

  async getOptionsSubject(): Promise<Subjects[]> {
    const result = await this.prisma.subjects.findMany();
    return result;
  }

  async getSubjectById(id: number): Promise<Subjects> {
    const subject = await this.prisma.subjects.findUnique({
      where: {
        id,
      },
    });

    return subject;
  }

  async getSubjectByName(name: string): Promise<Subjects> {
    const subject = await this.prisma.subjects.findUnique({
      where: {
        name,
      },
    });

    return subject;
  }

  async addSubject(body: AddSubjectDto): Promise<Subjects> {
    const newSubject = await this.prisma.subjects.create({
      data: body,
    });

    return newSubject;
  }

  async editSubject(id: number, body: EditSubjectDto): Promise<Subjects> {
    const updatedSubject = await this.prisma.subjects.update({
      where: {
        id,
      },
      data: body,
    });

    return updatedSubject;
  }

  async deleteSubject(id: number): Promise<Subjects> {
    const result = await this.prisma.subjects.delete({
      where: {
        id,
      },
    });

    return result;
  }

  async deleteAllSubjects(): Promise<{ count: number }> {
    const result = await this.prisma.subjects.deleteMany({});

    return result;
  }
}
