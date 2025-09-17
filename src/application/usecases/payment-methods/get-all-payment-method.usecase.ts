import { Prisma } from '@prisma/client'
import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import {
  GetAllProductGroupRequestDto,
  GetAllProductGroupResponseDto
} from '@interface-adapter/dtos/product-groups'

@Injectable()
export class GetAllProductGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: GetAllProductGroupRequestDto,
    branchId: string
  ): Promise<GetAllProductGroupResponseDto> {
    const { page, perPage, keyword, orderBy, sortBy, isParent } = data

    const where: Prisma.ProductGroupWhereInput = {
      branchId,
      ...(isParent !== undefined &&
        isParent && {
          parentId: null
        })
    }

    if (keyword) {
      where.OR = [{ name: { contains: keyword, mode: 'insensitive' } }]
    }

    return await this.prismaClient.findManyWithPagination(
      'productGroup',
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
          children: {
            omit: {
              deletedAt: true,
              deletedBy: true,
              createdBy: true,
              updatedBy: true
            },
            include: {
              children: {
                omit: {
                  deletedAt: true,
                  deletedBy: true,
                  createdBy: true,
                  updatedBy: true
                }
              }
            }
          }
        }
      },
      { page, perPage }
    )
  }
}
