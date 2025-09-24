import { Prisma } from '@prisma/client'
import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import { GetAllProductRequestDto, GetAllProductResponseDto } from '@interface-adapter/dtos/products'
import { PRODUCT_INCLUDE_FIELDS } from '@common/constants'

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
    const {
      page,
      perPage,
      keyword,
      orderBy,
      sortBy,
      isParent,
      isStockEnabled,
      isDirectSale,
      types,
      productGroupIds,
      manufacturerIds
    } = data

    const where: Prisma.ProductWhereInput = {
      branchId,
      ...(isParent !== undefined &&
        isParent && {
          parentId: null
        }),
      ...(isStockEnabled !== undefined && {
        isStockEnabled
      }),
      ...(isDirectSale !== undefined && {
        isDirectSale
      }),
      ...(types?.length && { type: { in: types } }),
      ...(productGroupIds?.length && { productGroupId: { in: productGroupIds } }),
      ...(manufacturerIds?.length && { manufacturerId: { in: manufacturerIds } })
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
        ...PRODUCT_INCLUDE_FIELDS
      },
      { page, perPage }
    )
  }
}
