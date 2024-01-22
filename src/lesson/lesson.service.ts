import { Injectable } from '@nestjs/common';
import { Lessons } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Filters } from 'src/common/models';
import * as moment from 'moment';
import { GlobalService } from 'src/global/global.service';
import { AddLessonDto, EditLessonDto, LessonDetails } from './dto/lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly globalService: GlobalService,
  ) {}

  async getAllLessons(
    query: Filters,
  ): Promise<{ results: Lessons[]; totalData: number }> {
    const { page, pageSize, targetDay, from, to } = query;

    // const skipValue = (page - 1) * pageSize;

    let formatTargetDay;
    let fromTime;
    let toTime;

    if (targetDay && from && to) {
      formatTargetDay = moment
        .utc(targetDay, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        .format('YYYY-MM-DD');
      fromTime = moment.utc(from, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('HH:mm');
      toTime = moment.utc(to, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('HH:mm');
      const results = await this.prisma.$queryRaw<Lessons[]>`
      SELECT l.*, JSON_OBJECT(
            'id', c.id,
            'name', c.name,
            'numberOfStudents', c.numberOfStudents,
            'studyTime', c.studyTime,
            'fee', c.fee,
						'gradeId', c.gradeId,
						'subjectId', c.subjectId
        )as classDetails,
				JSON_OBJECT(
            'id', s.id,
            'name', s.name
        )as subjectDetails,
				JSON_OBJECT(
            'id', g.id,
            'name', g.name,
						'numberOfClasses', g.numberOfClasses
        )as gradeDetails
      FROM Lessons as l
      JOIN Classes as c on l.classId = c.id
      JOIN Subjects as s on c.subjectId = s.id
      JOIN Grades as g on c.gradeId = g.id
      WHERE Date(startTime) = ${formatTargetDay}
      AND Date(endTime) = ${formatTargetDay}
      AND TIME_FORMAT(startTime, '%H:%i') >= TIME_FORMAT(${fromTime}, '%H:%i')
      AND TIME_FORMAT(startTime, '%H:%i') <= TIME_FORMAT(${toTime}, '%H:%i')
      AND TIME_FORMAT(endTime, '%H:%i') >= TIME_FORMAT(${fromTime}, '%H:%i')
      AND TIME_FORMAT(endTime, '%H:%i') <= TIME_FORMAT(${toTime}, '%H:%i');`;

      const resultPaginated = this.globalService.paginationHandler(
        results,
        page,
        pageSize,
      );
      return { results: resultPaginated, totalData: results.length };
    }

    if (targetDay && from) {
      formatTargetDay = moment
        .utc(targetDay, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        .format('YYYY-MM-DD');
      fromTime = moment.utc(from, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('HH:mm');

      const results = await this.prisma.$queryRaw<Lessons[]>`
      SELECT l.*, JSON_OBJECT(
            'id', c.id,
            'name', c.name,
            'numberOfStudents', c.numberOfStudents,
            'studyTime', c.studyTime,
            'fee', c.fee,
						'gradeId', c.gradeId,
						'subjectId', c.subjectId
        )as classDetails,
				JSON_OBJECT(
            'id', s.id,
            'name', s.name
        )as subjectDetails,
				JSON_OBJECT(
            'id', g.id,
            'name', g.name,
						'numberOfClasses', g.numberOfClasses
        )as gradeDetails
      FROM Lessons as l
      JOIN Classes as c on l.classId = c.id
      JOIN Subjects as s on c.subjectId = s.id
      JOIN Grades as g on c.gradeId = g.id
      WHERE Date(startTime) = ${formatTargetDay}
      AND Date(endTime) = ${formatTargetDay}
      AND TIME_FORMAT(startTime, '%H:%i') >= TIME_FORMAT(${fromTime}, '%H:%i')
      AND TIME_FORMAT(endTime, '%H:%i') >= TIME_FORMAT(${fromTime}, '%H:%i')`;

      const resultPaginated = this.globalService.paginationHandler(
        results,
        page,
        pageSize,
      );
      return { results: resultPaginated, totalData: results.length };
    }

    if (targetDay && to) {
      formatTargetDay = moment
        .utc(targetDay, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        .format('YYYY-MM-DD');

      toTime = moment.utc(to, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('HH:mm');
      const results = await this.prisma.$queryRaw<Lessons[]>`
      SELECT l.*, JSON_OBJECT(
            'id', c.id,
            'name', c.name,
            'numberOfStudents', c.numberOfStudents,
            'studyTime', c.studyTime,
            'fee', c.fee,
						'gradeId', c.gradeId,
						'subjectId', c.subjectId
        )as classDetails,
				JSON_OBJECT(
            'id', s.id,
            'name', s.name
        )as subjectDetails,
				JSON_OBJECT(
            'id', g.id,
            'name', g.name,
						'numberOfClasses', g.numberOfClasses
        )as gradeDetails
      FROM Lessons as l
      JOIN Classes as c on l.classId = c.id
      JOIN Subjects as s on c.subjectId = s.id
      JOIN Grades as g on c.gradeId = g.id
      WHERE Date(startTime) = ${formatTargetDay}
      AND Date(endTime) = ${formatTargetDay}
      AND TIME_FORMAT(startTime, '%H:%i') <= TIME_FORMAT(${toTime}, '%H:%i')
      AND TIME_FORMAT(endTime, '%H:%i') <= TIME_FORMAT(${toTime}, '%H:%i');`;

      const resultPaginated = this.globalService.paginationHandler(
        results,
        page,
        pageSize,
      );
      return { results: resultPaginated, totalData: results.length };
    }

    if (targetDay) {
      formatTargetDay = moment
        .utc(targetDay, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        .format('YYYY-MM-DD');

      const results = await this.prisma.$queryRaw<Lessons[]>`
      SELECT l.*, JSON_OBJECT(
            'id', c.id,
            'name', c.name,
            'numberOfStudents', c.numberOfStudents,
            'studyTime', c.studyTime,
            'fee', c.fee,
						'gradeId', c.gradeId,
						'subjectId', c.subjectId
        )as classDetails,
				JSON_OBJECT(
            'id', s.id,
            'name', s.name
        )as subjectDetails,
				JSON_OBJECT(
            'id', g.id,
            'name', g.name,
						'numberOfClasses', g.numberOfClasses
        )as gradeDetails
      FROM Lessons as l
      JOIN Classes as c on l.classId = c.id
      JOIN Subjects as s on c.subjectId = s.id
      JOIN Grades as g on c.gradeId = g.id
      WHERE Date(startTime) = ${formatTargetDay}
      AND Date(endTime) = ${formatTargetDay}`;

      const resultPaginated = this.globalService.paginationHandler(
        results,
        page,
        pageSize,
      );
      return { results: resultPaginated, totalData: results.length };
    }

    if (!targetDay && from && to) {
      fromTime = moment.utc(from, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('HH:mm');
      toTime = moment.utc(to, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('HH:mm');
      const results = await this.prisma.$queryRaw<Lessons[]>`
      SELECT l.*, JSON_OBJECT(
            'id', c.id,
            'name', c.name,
            'numberOfStudents', c.numberOfStudents,
            'studyTime', c.studyTime,
            'fee', c.fee,
						'gradeId', c.gradeId,
						'subjectId', c.subjectId
        )as classDetails,
				JSON_OBJECT(
            'id', s.id,
            'name', s.name
        )as subjectDetails,
				JSON_OBJECT(
            'id', g.id,
            'name', g.name,
						'numberOfClasses', g.numberOfClasses
        )as gradeDetails
      FROM Lessons as l
      JOIN Classes as c on l.classId = c.id
      JOIN Subjects as s on c.subjectId = s.id
      JOIN Grades as g on c.gradeId = g.id
      WHERE TIME_FORMAT(startTime, '%H:%i') >= TIME_FORMAT(${fromTime}, '%H:%i')
      AND TIME_FORMAT(startTime, '%H:%i') <= TIME_FORMAT(${toTime}, '%H:%i')
      AND TIME_FORMAT(endTime, '%H:%i') >= TIME_FORMAT(${fromTime}, '%H:%i')
      AND TIME_FORMAT(endTime, '%H:%i') <= TIME_FORMAT(${toTime}, '%H:%i');`;

      const resultPaginated = this.globalService.paginationHandler(
        results,
        page,
        pageSize,
      );
      return { results: resultPaginated, totalData: results.length };
    }

    if (!targetDay && from) {
      fromTime = moment.utc(from, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('HH:mm');

      const results = await this.prisma.$queryRaw<Lessons[]>`
      SELECT l.*, JSON_OBJECT(
            'id', c.id,
            'name', c.name,
            'numberOfStudents', c.numberOfStudents,
            'studyTime', c.studyTime,
            'fee', c.fee,
						'gradeId', c.gradeId,
						'subjectId', c.subjectId
        )as classDetails,
				JSON_OBJECT(
            'id', s.id,
            'name', s.name
        )as subjectDetails,
				JSON_OBJECT(
            'id', g.id,
            'name', g.name,
						'numberOfClasses', g.numberOfClasses
        )as gradeDetails
      FROM Lessons as l
      JOIN Classes as c on l.classId = c.id
      JOIN Subjects as s on c.subjectId = s.id
      JOIN Grades as g on c.gradeId = g.id
      WHERE TIME_FORMAT(startTime, '%H:%i') >= TIME_FORMAT(${fromTime}, '%H:%i')
      AND TIME_FORMAT(endTime, '%H:%i') >= TIME_FORMAT(${fromTime}, '%H:%i')`;

      const resultPaginated = this.globalService.paginationHandler(
        results,
        page,
        pageSize,
      );
      return { results: resultPaginated, totalData: results.length };
    }

    if (!targetDay && to) {
      toTime = moment.utc(to, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('HH:mm');

      const results = await this.prisma.$queryRaw<Lessons[]>`
      SELECT l.*, JSON_OBJECT(
            'id', c.id,
            'name', c.name,
            'numberOfStudents', c.numberOfStudents,
            'studyTime', c.studyTime,
            'fee', c.fee,
						'gradeId', c.gradeId,
						'subjectId', c.subjectId
        )as classDetails,
				JSON_OBJECT(
            'id', s.id,
            'name', s.name
        )as subjectDetails,
				JSON_OBJECT(
            'id', g.id,
            'name', g.name,
						'numberOfClasses', g.numberOfClasses
        )as gradeDetails
      FROM Lessons as l
      JOIN Classes as c on l.classId = c.id
      JOIN Subjects as s on c.subjectId = s.id
      JOIN Grades as g on c.gradeId = g.id
      WHERE TIME_FORMAT(startTime, '%H:%i') <= TIME_FORMAT(${toTime}, '%H:%i')
      AND TIME_FORMAT(endTime, '%H:%i') <= TIME_FORMAT(${toTime}, '%H:%i');`;

      const resultPaginated = this.globalService.paginationHandler(
        results,
        page,
        pageSize,
      );
      return { results: resultPaginated, totalData: results.length };
    }
  }

  async getLessonById(id: number): Promise<LessonDetails> {
    const lesson = await this.prisma.lessons.findUnique({
      where: {
        id,
      },
      include: {
        class: true,
      },
    });

    return lesson;
  }

  async addLesson(body: AddLessonDto): Promise<Lessons> {
    const newLesson = await this.prisma.lessons.create({
      data: body,
    });

    return newLesson;
  }

  async editLesson(id: number, body: EditLessonDto): Promise<Lessons> {
    const updatedLesson = await this.prisma.lessons.update({
      where: {
        id,
      },
      data: body,
    });

    return updatedLesson;
  }

  async deleteLesson(id: number): Promise<Lessons> {
    const result = await this.prisma.lessons.delete({
      where: { id },
    });

    return result;
  }

  async deleteAllLessons(): Promise<{ count: number }> {
    const result = await this.prisma.lessons.deleteMany({});

    return result;
  }

  async updateLessonBeforeDelete(
    fieldId: number,
    key: string,
  ): Promise<{ count: number }> {
    const results = await this.prisma.lessons.updateMany({
      where: {
        [key]: fieldId,
      },
      data: {
        [key]: null,
      },
    });

    return results;
  }

  async updateLessonBeforeDeleteAll(
    fieldIds: number[],
    key: string,
  ): Promise<{ count: number }> {
    const results = await this.prisma.lessons.updateMany({
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
