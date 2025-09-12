import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@infrastructure/prisma'
import {
  GetAllProvincesRequestDto,
  GetAllProvincesResponseDto
} from '@interface-adapter/dtos/provinces'

@Injectable()
export class GetAllProvinceUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: GetAllProvincesRequestDto): Promise<GetAllProvincesResponseDto> {
    const { page, perPage, keyword } = data

    // Build where condition
    const where: Prisma.ProvinceWhereInput = {}

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { codeName: { contains: keyword, mode: 'insensitive' } },
        { divisionType: { contains: keyword, mode: 'insensitive' } }
      ]
    }

    return await this.prisma.findManyWithPagination(
      'province',
      {
        where,
        orderBy: { name: 'asc' }
      },
      { page, perPage }
    )
  }
}
