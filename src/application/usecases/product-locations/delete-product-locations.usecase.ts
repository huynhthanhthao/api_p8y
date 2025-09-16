import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { PRODUCT_LOCATION_ERROR } from '@common/errors'

@Injectable()
export class DeleteProductLocationUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, branchId: string): Promise<string> {
    const productLocation = await this.prismaClient.productLocation.findUnique({
      where: { id, branchId }
    })

    if (!productLocation) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        PRODUCT_LOCATION_ERROR.PRODUCT_LOCATION_NOT_FOUND
      )
    }

    await this.prismaClient.productLocation.update({
      where: { id, branchId },
      data: {
        deletedBy: userId
      }
    })

    await this.prismaClient.productLocation.delete({
      where: {
        id,
        branchId
      },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return id
  }
}
