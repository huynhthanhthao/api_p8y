import { PrismaService } from '@infrastructure/prisma'
import {
  GetAllSupplierGroupRequestDto,
  GetAllSupplierGroupResponseDto
} from '@interface-adapter/dtos/supplier-groups'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Injectable()
export class GetAllSupplierGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    params: GetAllSupplierGroupRequestDto,
    branchId: string
  ): Promise<GetAllSupplierGroupResponseDto> {
    const { page, perPage, keyword, orderBy, sortBy } = params

    const where: Prisma.SupplierGroupWhereInput = {
      branchId
    }

    if (keyword) {
      where.OR = [{ name: { contains: keyword, mode: 'insensitive' } }]
    }

    return await this.prismaClient.findManyWithPagination(
      'supplierGroup',
      {
        where,
        orderBy: { [sortBy]: orderBy },
        omit: {
          deletedAt: true,
          deletedBy: true,
          createdBy: true,
          updatedBy: true
        }
      },
      { page, perPage }
    )
  }
}
