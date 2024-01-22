import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { Filters } from 'src/common/models';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AddLessonDto, EditLessonDto } from './dto/lesson.dto';
import { SubjectService } from 'src/subject/subject.service';
import { GradeService } from '../grade/grade.service';

@Controller('lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly subjectService: SubjectService,
    private readonly gradeService: GradeService,
  ) {}

  @Get(':id')
  async getLessonDetails(@Param('id') id: string) {
    const lesson = await this.lessonService.getLessonById(+id);
    const subject = await this.subjectService.getSubjectById(
      lesson.class.subjectId,
    );
    const grade = await this.gradeService.getGradeById(lesson.class.gradeId);

    const results = {
      ...lesson,
      subject,
      grade,
    };

    return {
      data: results,
    };
  }

  @Get()
  async getAllLessons(@Query() query: Filters) {
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

    const parsedQuery = {
      ...query,
      page: page,
      pageSize: pageSize,
    };
    const { results: listLessons, totalData } =
      await this.lessonService.getAllLessons(parsedQuery);
    const totalPage = Math.ceil(totalData / pageSize);

    return {
      data: listLessons,
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
  @Post()
  async addLesson(@Body() body: AddLessonDto) {
    const newLesson = await this.lessonService.addLesson(body);

    return {
      message: 'Create lesson successfully',
      data: newLesson,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async editLesson(@Param('id') id: string, @Body() body: EditLessonDto) {
    const foundLesson = await this.lessonService.getLessonById(+id);

    if (!foundLesson) {
      throw new BadRequestException('Lesson does not exist');
    }

    const updatedLesson = await this.lessonService.editLesson(+id, body);

    return {
      message: 'Edit lesson successfully',
      data: updatedLesson,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteLesson(@Param('id') id: string) {
    const result = await this.lessonService.deleteLesson(+id);

    return {
      message: 'Delete lesson successfully',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAllLessons() {
    await this.lessonService.deleteAllLessons();

    return {
      message: 'Delete lesson successfully',
    };
  }
}
