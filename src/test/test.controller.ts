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
import { TestService } from './test.service';
import { FiltersDto } from 'src/common/DTO/filters.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AddTestDto, EditTestDto } from './dto/test.dto';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get(':id')
  async getTestDetails(@Param('id') id: string) {
    const test = await this.testService.getTestById(+id);
    delete test.user.password;

    return {
      data: test,
    };
  }

  @Get()
  async getAllTests(@Query() query: FiltersDto) {
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

    const totalData = await this.testService.countTests(parsedQuery);

    const totalPage = Math.ceil(totalData / pageSize);

    const listTests = await this.testService.getAllTest(parsedQuery);
    for (let i = 0; i < listTests.length; i++) {
      const eachTest = listTests[i];
      delete eachTest.user.password;
    }

    return {
      data: listTests,
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
  async addTest(@Body() body: AddTestDto) {
    const newTest = await this.testService.addTest(body);

    return {
      message: 'Create test successfully',
      data: newTest,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async editTest(@Param('id') id: string, @Body() body: EditTestDto) {
    const foundTest = await this.testService.getTestById(+id);

    if (!foundTest) {
      throw new BadRequestException('Test does not exist');
    }

    const updatedTest = await this.testService.editTest(+id, body);

    return {
      message: 'Edit test successfully',
      data: updatedTest,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTest(@Param('id') id: string) {
    const result = await this.testService.deleteTest(+id);

    return {
      message: 'Delete test successfully',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAllTests() {
    await this.testService.deleteAllTest();

    return {
      message: 'Delete test successfully',
    };
  }
}
