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
import { AcademicTranscriptService } from './academic-transcript.service';
import { FiltersDto } from 'src/common/DTO/filters.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import {
  AddAcademicTranscriptDto,
  EditAcademicTranscriptDto,
} from './dto/academic-transcript.dto';

@Controller('academic-transcript')
export class AcademicTranscriptController {
  constructor(
    private readonly academicTranscriptService: AcademicTranscriptService,
  ) {}

  @Get(':id')
  async getAcademicTranscriptOfUser(@Param('id') id: string) {
    const result =
      await this.academicTranscriptService.getAcademicTranscriptById(+id);

    return {
      data: result,
    };
  }

  @Get()
  async getAllAcademicTranscript(@Query() query: FiltersDto) {
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
      targetDay: query.targetDay,
    };

    const totalData =
      await this.academicTranscriptService.countAcademicTranscript(parsedQuery);
    const totalPage = Math.ceil(totalData / pageSize);

    const listAcademicTranscripts =
      await this.academicTranscriptService.getAllAcademicTranscripts(
        parsedQuery,
      );

    return {
      data: listAcademicTranscripts,
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
  async addAcademicTranscript(@Body() body: AddAcademicTranscriptDto) {
    const foundAcademicTranscript =
      await this.academicTranscriptService.getUniqueAcademicTranscript(
        body.month,
        body.userId,
        body.classId,
      );

    if (foundAcademicTranscript) {
      throw new BadRequestException(
        "This month's report card for this subject already exists",
      );
    }

    const newAcademicTranscript =
      await this.academicTranscriptService.addAcademicTranscript(body);

    return {
      message: 'Create report card successfully',
      data: newAcademicTranscript,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async editAcademicTranscript(
    @Param('id') id: string,
    @Body() body: EditAcademicTranscriptDto,
  ) {
    const foundItem =
      await this.academicTranscriptService.getAcademicTranscriptById(+id);

    if (!foundItem) {
      throw new BadRequestException(
        "This month's report card for this subject doest not exist",
      );
    }

    const updatedAcademicTranscript =
      await this.academicTranscriptService.editAcademicTranscript(
        foundItem.id,
        body,
      );

    return {
      message: 'Edit report card successfully',
      data: updatedAcademicTranscript,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteAcademicTranscript(@Param('id') id: string) {
    const result =
      await this.academicTranscriptService.deleteAcademicTranscript(+id);
    return {
      message: 'Delete report card successfully',
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAllAcademicTranscript() {
    await this.academicTranscriptService.deleteAllAcademicTranscript();
    return {
      message: 'Delete report card successfully',
    };
  }
}
