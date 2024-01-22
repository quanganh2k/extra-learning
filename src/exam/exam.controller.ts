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
import { ExamService } from './exam.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AddExamDto, EditExamDto } from './dto/exam.dto';
import { FiltersDto } from 'src/common/DTO/filters.dto';
import { TestService } from 'src/test/test.service';

@Controller('exam')
export class ExamController {
  constructor(
    private readonly examService: ExamService,
    private readonly testService: TestService,
  ) {}

  @Get(':id')
  async getExamDetails(@Param('id') id: string) {
    const exam = await this.examService.getExamById(+id);

    return {
      data: exam,
    };
  }

  @Get()
  async getAllExams(@Query() query: FiltersDto) {
    const { targetDay } = query;
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
      page,
      pageSize,
      targetDay,
    };

    const totalData = await this.examService.countExams(parsedQuery);
    const totalPage = Math.ceil(totalData / pageSize);

    const listExams = await this.examService.getAllExams(parsedQuery);

    return {
      data: listExams,
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
  async addExam(@Body() body: AddExamDto) {
    const newExam = await this.examService.addExam(body);

    return {
      message: 'Create exam successfully',
      data: newExam,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async editExam(@Param('id') id: string, @Body() body: EditExamDto) {
    const foundExam = await this.examService.getExamById(+id);

    if (!foundExam) {
      throw new BadRequestException('Exam does not exist');
    }

    const updatedExam = await this.examService.editExam(+id, body);

    return {
      message: 'Edit exam successfully',
      data: updatedExam,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteExam(@Param('id') id: string) {
    await this.testService.updateTestBeforeDelete(+id, 'examId');
    const result = await this.examService.deleteExam(+id);

    return {
      message: 'Delete exam successfully',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAllExam() {
    const listExams = await this.examService.getOptionsExam();
    const examIds = listExams.map((el) => el.id);
    await this.testService.updateTestBeforeDeleteAll(examIds, 'examId');
    await this.examService.deleteAllExams();

    return {
      message: 'Delete exam successfully',
    };
  }
}
