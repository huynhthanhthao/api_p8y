import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { UpdateProductLotRequestDto } from '@interface-adapter/dtos/product-lots'
import { PRODUCT_LOT_ERROR } from '@common/errors'
import { ProductLot } from '@common/types'

@Injectable()
export class UpdateProductLotUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    id: string,
    data: UpdateProductLotRequestDto,
    userId: string,
    branchId: string
  ): Promise<ProductLot> {
    const productLot = await this.prismaClient.productLot.findUnique({
      where: {
        id: id,
        branchId
      }
    })

    if (!productLot) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_LOT_ERROR.PRODUCT_LOT_NOT_FOUND)
    }

    if (data.name && data.name !== productLot.name) {
      const recordWithSameName = await this.prismaClient.productLot.findFirst({
        where: {
          name: {
            equals: data.name,
            mode: 'insensitive'
          },
          id: {
            not: id
          },
          branchId
        }
      })

      if (recordWithSameName) {
        throw new HttpException(HttpStatus.CONFLICT, PRODUCT_LOT_ERROR.NAME_ALREADY_EXISTS)
      }
    }

    return this.prismaClient.productLot.update({
      where: {
        id: id,
        branchId
      },
      data: {
        name: data.name,
        expiryAt: data.expiryAt,
        updatedBy: userId
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
