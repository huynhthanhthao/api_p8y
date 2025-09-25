import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { UpdateProductLocationRequestDto } from '@interface-adapter/dtos/product-locations'
import { PRODUCT_LOCATION_ERROR } from '@common/errors'
import { ProductLocation } from '@common/types'

@Injectable()
export class UpdateProductLocationUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    id: string,
    data: UpdateProductLocationRequestDto,
    userId: string,
    branchId: string
  ): Promise<ProductLocation> {
    const productLocation = await this.prismaClient.productLocation.findUnique({
      where: {
        id: id,
        branchId
      }
    })

    if (!productLocation) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        PRODUCT_LOCATION_ERROR.PRODUCT_LOCATION_NOT_FOUND
      )
    }

    if (data.name && data.name !== productLocation.name) {
      const recordWithSameName = await this.prismaClient.productLocation.findFirst({
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
        throw new HttpException(HttpStatus.CONFLICT, PRODUCT_LOCATION_ERROR.NAME_ALREADY_EXISTS)
      }
    }

    return this.prismaClient.productLocation.update({
      where: {
        id: id,
        branchId
      },
      data: {
        name: data.name,
        updatedBy: userId
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
  }
}
