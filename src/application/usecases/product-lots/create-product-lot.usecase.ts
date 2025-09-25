import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { CreateProductLotRequestDto } from '@interface-adapter/dtos/product-lots'
import { PRODUCT_LOT_ERROR } from '@common/errors'
import { ProductLot } from '@common/types'

@Injectable()
export class CreateProductLotUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: CreateProductLotRequestDto,
    userId: string,
    branchId: string
  ): Promise<ProductLot> {
    const existingRecord = await this.prismaClient.productLot.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive'
        },
        productParentId: data.productParentId,
        branchId
      }
    })

    if (existingRecord)
      throw new HttpException(HttpStatus.CONFLICT, PRODUCT_LOT_ERROR.NAME_ALREADY_EXISTS)

    const product = await this.prismaClient.product.findUnique({
      where: { id: data.productParentId },
      select: {
        parent: {
          select: {
            id: true
          }
        }
      }
    })

    if (!product) throw new HttpException(HttpStatus.CONFLICT, PRODUCT_LOT_ERROR.PRODUCT_NOT_FOUND)

    if (product.parent !== null)
      throw new HttpException(HttpStatus.CONFLICT, PRODUCT_LOT_ERROR.PRODUCT_NOT_BASE_UNIT)

    return await this.prismaClient.productLot.create({
      data: {
        name: data.name,
        expiryAt: data.expiryAt,
        productParentId: data.productParentId,
        createdBy: userId,
        branchId
      },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    })
  }
}
