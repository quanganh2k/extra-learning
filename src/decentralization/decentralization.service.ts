import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  AddDecentralization,
  EditDecentralization,
} from './dto/decentralization.dto';
import { Decentralizations } from '@prisma/client';
import { Filters } from 'src/common/models';

@Injectable()
export class DecentralizationService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllDecentralization(query: Filters): Promise<Decentralizations[]> {
    const { page, pageSize, search } = query;
    const skipValue = (page - 1) * pageSize;
    const searchValue = search || '';

    const listDecentralizations = await this.prisma.decentralizations.findMany({
      take: pageSize,
      skip: skipValue,
      where: {
        name: {
          contains: searchValue,
        },
      },
    });

    return listDecentralizations;
  }

  async getOptionsDecentralizations(): Promise<Decentralizations[]> {
    const results = await this.prisma.decentralizations.findMany();

    return results;
  }

  async countDecentralizations(query: Filters): Promise<number> {
    const { search } = query;

    const totalData = await this.prisma.decentralizations.count({
      where: search
        ? {
            name: {
              contains: search,
            },
          }
        : undefined,
    });

    return totalData;
  }

  async getDecentralizationById(id: number): Promise<Decentralizations> {
    const result = await this.prisma.decentralizations.findUnique({
      where: {
        id,
      },
    });

    return result;
  }

  async getDecentralizationByName(name: string): Promise<Decentralizations> {
    const result = await this.prisma.decentralizations.findUnique({
      where: {
        name,
      },
    });

    return result;
  }

  async addDecentralization(
    body: AddDecentralization,
  ): Promise<Decentralizations> {
    const newDecentralization = await this.prisma.decentralizations.create({
      data: body,
    });

    return newDecentralization;
  }

  async editDecentralization(
    id: number,
    body: EditDecentralization,
  ): Promise<Decentralizations> {
    const updatedDecentralization = await this.prisma.decentralizations.update({
      where: {
        id,
      },
      data: body,
    });

    return updatedDecentralization;
  }

  async deleteDecentralization(id: number): Promise<Decentralizations> {
    const result = await this.prisma.decentralizations.delete({
      where: {
        id,
      },
    });

    return result;
  }

  async deleteAllDecentralizations(): Promise<{ count: number }> {
    const result = await this.prisma.decentralizations.deleteMany({});

    return result;
  }
}
