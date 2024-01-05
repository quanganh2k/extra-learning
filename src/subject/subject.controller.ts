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
import { SubjectService } from './subject.service';
import { FiltersDto } from 'src/common/DTO/filters.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AddSubjectDto, EditSubjectDto } from './dto/subject.dto';
import { ClassService } from 'src/class/class.service';

@Controller('subject')
export class SubjectController {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly classService: ClassService,
  ) {}

  @Get(':id')
  async getSubjectDetails(@Param('id') id: string) {
    const foundSubject = await this.subjectService.getSubjectById(+id);

    return {
      data: foundSubject,
    };
  }

  @Get()
  async getAllSubjects(@Query() query: FiltersDto) {
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

    const totalData = await this.subjectService.countSubjects(parsedQuery);

    const totalPage = Math.ceil(totalData / pageSize);

    const listSubjects = await this.subjectService.getAllSubjects(parsedQuery);

    return {
      data: listSubjects,
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
  async addSubject(@Body() body: AddSubjectDto) {
    const foundSubject = await this.subjectService.getSubjectByName(body.name);

    if (foundSubject) {
      throw new BadRequestException('Subject already exists');
    }

    const newSubject = await this.subjectService.addSubject(body);

    return {
      message: 'Create subject successfully',
      data: newSubject,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async editSubject(@Param('id') id: string, @Body() body: EditSubjectDto) {
    const foundSubject = await this.subjectService.getSubjectById(+id);

    if (!foundSubject) {
      throw new BadRequestException('Subject does not exist');
    }

    const otherSubject = await this.subjectService.getSubjectByName(body.name);

    if (otherSubject && foundSubject.id !== otherSubject.id) {
      throw new BadRequestException('Subject name must be unique');
    }

    const updatedSubject = await this.subjectService.editSubject(
      foundSubject.id,
      body,
    );

    return {
      message: 'Edit subject successfully',
      data: updatedSubject,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteSubject(@Param('id') id: string) {
    await this.classService.updateClassBeforeDelete(+id, 'subjectId');
    const result = await this.subjectService.deleteSubject(+id);

    return {
      message: 'Delete subject successfully',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAllSubjects() {
    const listSubjects = await this.subjectService.getOptionsSubject();
    const subjectIds = listSubjects.map((el) => el.id);
    await this.classService.updateClassBeforeDeleteAll(subjectIds, 'subjectId');
    await this.subjectService.deleteAllSubjects();

    return {
      message: 'Delete subject successfully',
    };
  }
}
