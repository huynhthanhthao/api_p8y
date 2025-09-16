import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import {
  UpdateProductGroupRequestDto,
  UpdateProductGroupResponseDto
} from '@interface-adapter/dtos/product-groups'
import { PRODUCT_GROUP_ERROR } from '@common/errors'

@Injectable()
export class UpdateProductGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    id: string,
    data: UpdateProductGroupRequestDto,
    userId: string,
    branchId: string
  ): Promise<UpdateProductGroupResponseDto> {
    const productGroup = await this.prismaClient.productGroup.findUnique({
      where: {
        id: id,
        branchId
      }
    })

    if (!productGroup) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_GROUP_ERROR.PRODUCT_GROUP_NOT_FOUND)
    }

    if (data.name && data.name !== productGroup.name) {
      const recordWithSameName = await this.prismaClient.productGroup.findFirst({
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
        throw new HttpException(HttpStatus.CONFLICT, PRODUCT_GROUP_ERROR.NAME_ALREADY_EXISTS)
      }
    }

    return this.prismaClient.productGroup.update({
      where: {
        id: id,
        branchId
      },
      data: {
        name: data.name,
        parentId: data.parentId,
        updatedBy: userId
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
