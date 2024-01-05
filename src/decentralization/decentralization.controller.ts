import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DecentralizationService } from './decentralization.service';
import {
  AddDecentralization,
  EditDecentralization,
} from './dto/decentralization.dto';
import { FiltersDto } from 'src/common/DTO/filters.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AuthService } from '../auth/auth.service';

@Controller('decentralization')
export class DecentralizationController {
  constructor(
    private readonly decentralizationService: DecentralizationService,
    private readonly authService: AuthService,
  ) {}

  @Get(':id')
  async getDecentralizationDetails(@Param('id') id: string) {
    const decentralization =
      await this.decentralizationService.getDecentralizationById(+id);

    if (!decentralization) {
      throw new NotFoundException();
    }

    return {
      data: decentralization,
    };
  }

  @Get()
  async getAllDecentralizations(@Query() query: FiltersDto) {
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

    const listDecentralizations =
      await this.decentralizationService.getAllDecentralization(parsedQuery);

    const totalDecentralizations =
      await this.decentralizationService.countDecentralizations(parsedQuery);
    const totalPage = Math.ceil(totalDecentralizations / pageSize);

    return {
      data: listDecentralizations,
      paging: {
        page,
        pageSize,
        nextPage: page + 1 <= totalPage ? page + 1 : null,
        prevPage: page - 1 >= 1 ? page - 1 : null,
        totalPage,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addDecentralization(@Body() body: AddDecentralization) {
    const foundDecentralization =
      await this.decentralizationService.getDecentralizationByName(body.name);

    if (foundDecentralization) {
      throw new BadRequestException('Decentralization already exists');
    }

    const newDecentralization =
      await this.decentralizationService.addDecentralization(body);

    return {
      message: 'Create decentralization successfully',
      data: newDecentralization,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async editDecentralization(
    @Param('id') id: string,
    @Body() body: EditDecentralization,
  ) {
    const foundDecentralization =
      await this.decentralizationService.getDecentralizationById(+id);

    if (!foundDecentralization) {
      throw new BadRequestException('Decentralization does not exist');
    }

    const otherDecentralization =
      await this.decentralizationService.getDecentralizationByName(body.name);

    if (
      otherDecentralization &&
      foundDecentralization.id !== otherDecentralization.id
    ) {
      throw new BadRequestException('Decentralization name must be unique');
    }

    const updatedDecentralization =
      await this.decentralizationService.editDecentralization(
        foundDecentralization.id,
        body,
      );

    return {
      message: 'Update decentralization successfully',
      data: updatedDecentralization,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteDecentralization(@Param('id') id: string) {
    await this.authService.updateUserBeforeDelete(+id, 'decentralizationId');

    const deletedDecentralization =
      await this.decentralizationService.deleteDecentralization(+id);

    return {
      message: 'Delete decentralization successfully',
      data: deletedDecentralization,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAllDecentralizations() {
    const listDecentralizations =
      await this.decentralizationService.getOptionsDecentralizations();
    const idsDecentralizations = listDecentralizations.map((el) => el.id);

    await this.authService.updateBeforeDeleteAll(
      idsDecentralizations,
      'decentralizationId',
    );

    const result =
      await this.decentralizationService.deleteAllDecentralizations();

    return {
      message: 'Delete decentralization successfully',
      data: result,
    };
  }
}
