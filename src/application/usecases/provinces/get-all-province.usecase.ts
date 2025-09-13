import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@infrastructure/prisma'
import {
  GetAllProvinceRequestDto,
  GetAllProvinceResponseDto
} from '@interface-adapter/dtos/provinces/get-all-province.dto'

@Injectable()
export class GetAllProvinceUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(data: GetAllProvinceRequestDto): Promise<GetAllProvinceResponseDto> {
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
