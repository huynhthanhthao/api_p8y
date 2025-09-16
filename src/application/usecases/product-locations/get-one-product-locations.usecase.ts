import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { ProductLocation } from '@common/types'
import { HttpException } from '@common/exceptions'
import { PRODUCT_LOCATION_ERROR } from '@common/errors'

@Injectable()
@Injectable()
export class GetOneProductLocationUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, branchId: string): Promise<ProductLocation> {
    const productLocation = await this.prismaClient.productLocation.findUnique({
      where: { id, branchId },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!productLocation) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        PRODUCT_LOCATION_ERROR.PRODUCT_LOCATION_NOT_FOUND
      )
    }

    return productLocation
  }
}
