import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { ProductLot } from '@common/types'
import { HttpException } from '@common/exceptions'
import { PRODUCT_LOT_ERROR } from '@common/errors'

@Injectable()
export class GetOneProductLotUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, branchId: string): Promise<ProductLot> {
    const productLot = await this.prismaClient.productLot.findUnique({
      where: { id, branchId },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    })

    if (!productLot) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_LOT_ERROR.PRODUCT_LOT_NOT_FOUND)
    }

    return productLot
  }
}
