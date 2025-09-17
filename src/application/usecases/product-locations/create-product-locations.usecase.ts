import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { CreateProductLocationRequestDto } from '@interface-adapter/dtos/product-locations'
import { PRODUCT_LOCATION_ERROR } from '@common/errors'
import { ProductLocation } from '@common/types'

@Injectable()
export class CreateProductLocationUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: CreateProductLocationRequestDto,
    userId: string,
    branchId: string
  ): Promise<ProductLocation> {
    const existingRecord = await this.prismaClient.productLocation.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive'
        },
        branchId
      }
    })

    if (existingRecord)
      throw new HttpException(HttpStatus.CONFLICT, PRODUCT_LOCATION_ERROR.NAME_ALREADY_EXISTS)

    return await this.prismaClient.productLocation.create({
      data: {
        name: data.name,
        createdBy: userId,
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
  }
}
