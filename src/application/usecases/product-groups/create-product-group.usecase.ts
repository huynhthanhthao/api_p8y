import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { CreateProductGroupRequestDto } from '@interface-adapter/dtos/product-groups'
import { PRODUCT_GROUP_ERROR } from '@common/errors'
import { ProductGroup } from '@common/types'

@Injectable()
export class CreateProductGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: CreateProductGroupRequestDto,
    userId: string,
    branchId: string
  ): Promise<ProductGroup> {
    const existingGroup = await this.prismaClient.productGroup.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive'
        },
        branchId
      }
    })

    if (existingGroup)
      throw new HttpException(HttpStatus.CONFLICT, PRODUCT_GROUP_ERROR.NAME_ALREADY_EXISTS)

    return await this.prismaClient.productGroup.create({
      data: {
        name: data.name,
        parentId: data.parentId,
        createdBy: userId,
        branchId
      },
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
    })
  }
}
