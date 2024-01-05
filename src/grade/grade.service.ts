import { Injectable } from '@nestjs/common';
import { Grades } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Filters } from 'src/common/models';
import { AddGradeDto, EditGradeDto } from './dto/grade.dto';

@Injectable()
export class GradeService {
  constructor(private readonly prisma: PrismaService) {}

  async countGrades(query: Filters): Promise<number> {
    const { search } = query;
    const searchValue = search || '';
    const totalData = await this.prisma.grades.count({
      where: {
        name: {
          contains: searchValue,
        },
      },
    });

    return totalData;
  }

  async getAllGrades(query: Filters): Promise<Grades[]> {
    const { page, pageSize, search } = query;
    const skipValue = (page - 1) * pageSize;
    const searchValue = search || '';

    const listGrades = await this.prisma.grades.findMany({
      take: pageSize,
      skip: skipValue,
      where: {
        name: {
          contains: searchValue,
        },
      },
    });

    return listGrades;
  }

  async getGradeById(id: number): Promise<Grades> {
    const grade = await this.prisma.grades.findUnique({
      where: {
        id,
      },
    });

    return grade;
  }

  async getGradeByName(name: string): Promise<Grades> {
    const grade = await this.prisma.grades.findUnique({
      where: {
        name,
      },
    });

    return grade;
  }

  async addGrade(body: AddGradeDto): Promise<Grades> {
    const newGrade = await this.prisma.grades.create({
      data: body,
    });

    return newGrade;
  }

  async editGrade(id: number, body: EditGradeDto): Promise<Grades> {
    const updatedGrade = await this.prisma.grades.update({
      where: {
        id,
      },
      data: body,
    });

    return updatedGrade;
  }

  async deleteGrade(id: number): Promise<Grades> {
    const result = await this.prisma.grades.delete({
      where: {
        id,
      },
    });

    return result;
  }

  async deleteAllGrades(): Promise<{ count: number }> {
    const result = await this.prisma.grades.deleteMany({});
    return result;
  }
}
