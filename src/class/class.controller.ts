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
import { ClassService } from './class.service';
import { FiltersDto } from 'src/common/DTO/filters.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AddClassDto, EditClassDto } from './dto/class.dto';
import { LessonService } from 'src/lesson/lesson.service';
import { ExamService } from 'src/exam/exam.service';
import { UserClassService } from 'src/user-class/user-class.service';
import { AcademicTranscriptService } from 'src/academic-transcript/academic-transcript.service';

@Controller('class')
export class ClassController {
  constructor(
    private readonly classService: ClassService,
    private readonly lessonService: LessonService,
    private readonly examService: ExamService,
    private readonly userClassService: UserClassService,
    private readonly academicTranscriptService: AcademicTranscriptService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/fee')
  async getTotalFeeOfClass(@Query() query: { month: Date; classId: string }) {
    const { month, classId } = query;
    const classInformation = await this.classService.getClassById(+classId);
    const totalFee = await this.classService.calculateTotalFee(
      month,
      classInformation.studyTime,
      classInformation.fee,
    );

    return {
      data: totalFee,
    };
  }

  @Get(':id')
  async getClassDetails(@Param('id') id: string) {
    const classDetails = await this.classService.getClassById(+id);

    return {
      data: classDetails,
    };
  }

  @Get()
  async getAllClasses(@Query() query: FiltersDto) {
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
    const search = query && query.search ? query.search : '';

    const parsedQuery = {
      page,
      pageSize,
      search,
    };

    const totalData = await this.classService.countClasses(parsedQuery);
    const totalPage = Math.ceil(totalData / pageSize);
    const listClasses = await this.classService.getAllClasses(parsedQuery);

    return {
      data: listClasses,
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
  async addClass(@Body() body: AddClassDto) {
    const foundClass = await this.classService.getClassByName(body.name);

    if (foundClass) {
      throw new BadRequestException('Class already exists');
    }

    const newClass = await this.classService.addClass(body);
    const result = await this.classService.getClassById(newClass.id);

    return {
      message: 'Create class successfully',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async editClass(@Param('id') id: string, @Body() body: EditClassDto) {
    const foundClass = await this.classService.getClassById(+id);

    if (!foundClass) {
      throw new BadRequestException('Class does not exist');
    }
    const otherClass = await this.classService.getClassByName(body?.name);

    if (otherClass && foundClass.id !== otherClass.id) {
      throw new BadRequestException('Class name must be unique');
    }

    const updatedClass = await this.classService.editClass(foundClass.id, body);

    return {
      message: 'Update class successfully',
      data: updatedClass,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteClass(@Param('id') id: string) {
    await this.lessonService.updateLessonBeforeDelete(+id, 'classId');
    await this.examService.updateExamBeforeDelete(+id, 'classId');
    await this.userClassService.updateUserClassBeforeDelete(+id, 'classId');
    await this.academicTranscriptService.updateBeforeDelete(+id, 'classId');
    const result = await this.classService.deleteClass(+id);

    return {
      message: 'Delete class successfully',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAllClasses() {
    const listClasses = await this.classService.getOptionsClass();
    const classIds = listClasses.map((el) => el.id);
    await this.lessonService.updateLessonBeforeDeleteAll(classIds, 'classId');
    await this.examService.updateExamBeforeDeleteAll(classIds, 'classId');
    await this.userClassService.deleteUserClass(classIds, 'classId');
    await this.academicTranscriptService.updateBeforeDeleteAll(
      classIds,
      'classId',
    );
    await this.classService.deleteAllClasses();

    return {
      message: 'Delete class successfully',
    };
  }
}
