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

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

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
    const result = await this.classService.deleteClass(+id);

    return {
      message: 'Delete class successfully',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAllClasses() {
    await this.classService.deleteAllClasses();

    return {
      message: 'Delete class successfully',
    };
  }
}
