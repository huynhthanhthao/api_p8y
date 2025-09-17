import { Prisma } from '@prisma/client'
import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import { GetAllProductRequestDto, GetAllProductResponseDto } from '@interface-adapter/dtos/products'

@Injectable()
export class GetAllProductUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: GetAllProductRequestDto,
    branchId: string
  ): Promise<GetAllProductResponseDto> {
    const { page, perPage, keyword, orderBy, sortBy, isParent } = data

    const where: Prisma.ProductWhereInput = {
      branchId,
      ...(isParent !== undefined &&
        isParent && {
          parentId: null
        })
    }

    if (keyword) {
      const searchKeys = ['name', 'code', 'barcode', 'shortName']

      where.OR = searchKeys.map(key => ({
        [key]: {
          contains: keyword,
          mode: 'insensitive'
        }
      }))
    }

    return await this.prismaClient.findManyWithPagination(
      'product',
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
          photos: {
            omit: {
              deletedAt: true,
              deletedBy: true,
              createdBy: true,
              updatedBy: true
            }
          },
          variants: {
            select: {
              id: true,
              salePrice: true,
              costPrice: true,
              isDirectSale: true,
              barcode: true,
              code: true,
              unitName: true,
              conversion: true
            }
          }
        }
      },
      { page, perPage }
    )
  }
}
