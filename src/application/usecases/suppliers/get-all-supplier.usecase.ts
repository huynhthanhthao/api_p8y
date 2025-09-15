import { PrismaService } from '@infrastructure/prisma'
import {
  GetAllSupplierRequestDto,
  GetAllSupplierResponseDto
} from '@interface-adapter/dtos/suppliers'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Injectable()
export class GetAllSupplierUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    params: GetAllSupplierRequestDto,
    branchId: string
  ): Promise<GetAllSupplierResponseDto> {
    const { page, perPage, keyword, orderBy, sortBy, supplierGroupIds } = params

    const where: Prisma.SupplierWhereInput = {
      branchId,
      ...(!!supplierGroupIds?.length && {
        supplierGroupId: {
          in: supplierGroupIds
        }
      })
    }

    if (keyword) {
      where.OR = [{ name: { contains: keyword, mode: 'insensitive' } }]
    }

    return await this.prismaClient.findManyWithPagination(
      'supplier',
      {
        where,
        orderBy: { [sortBy]: orderBy },
        omit: {
          deletedAt: true,
          deletedBy: true,
          createdBy: true,
          updatedBy: true
        },
        include: {
          supplierGroup: {
            omit: {
              deletedAt: true,
              deletedBy: true,
              createdBy: true,
              updatedBy: true
            }
          }
        }
      },
      { page, perPage }
    )
  }
}
