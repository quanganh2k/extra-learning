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
import { GradeService } from './grade.service';
import { FiltersDto } from 'src/common/DTO/filters.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AddGradeDto, EditGradeDto } from './dto/grade.dto';
import { ClassService } from 'src/class/class.service';

@Controller('grade')
export class GradeController {
  constructor(
    private readonly gradeService: GradeService,
    private readonly classService: ClassService,
  ) {}

  @Get(':id')
  async getGradeDetails(@Param('id') id: string) {
    const grade = await this.gradeService.getGradeById(+id);

    return {
      data: grade,
    };
  }

  @Get()
  async getAllGrades(@Query() query: FiltersDto) {
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

    const totalData = await this.gradeService.countGrades(parsedQuery);
    const totalPage = Math.ceil(totalData / pageSize);

    const listGrades = await this.gradeService.getAllGrades(parsedQuery);

    return {
      data: listGrades,
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
  async addGrade(@Body() body: AddGradeDto) {
    const foundGrade = await this.gradeService.getGradeByName(body.name);

    if (foundGrade) {
      throw new BadRequestException('Grade already exists');
    }

    const newGrade = await this.gradeService.addGrade(body);

    return {
      message: 'Create grade successfully',
      data: newGrade,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async editGrade(@Param('id') id: string, @Body() body: EditGradeDto) {
    const foundGrade = await this.gradeService.getGradeById(+id);

    if (!foundGrade) {
      throw new BadRequestException('Grade does not exist');
    }

    const otherGrade = await this.gradeService.getGradeByName(body.name);

    if (otherGrade && foundGrade.id !== otherGrade.id) {
      throw new BadRequestException('Grade name must be unique');
    }

    const updatedGrade = await this.gradeService.editGrade(foundGrade.id, body);

    return {
      message: 'Update grade successfully',
      data: updatedGrade,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteGrade(@Param('id') id: string) {
    await this.classService.updateClassBeforeDelete(+id, 'gradeId');
    const result = await this.gradeService.deleteGrade(+id);

    return {
      message: 'Delete grade successfully',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAllGrades() {
    const listGrades = await this.gradeService.getOptionsGrade();
    const gradeIds = listGrades.map((el) => el.id);

    await this.classService.updateClassBeforeDeleteAll(gradeIds, 'gradeId');

    await this.gradeService.deleteAllGrades();
    return {
      message: 'Delete grade successfully',
    };
  }
}
