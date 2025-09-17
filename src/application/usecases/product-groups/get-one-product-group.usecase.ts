import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { ProductGroup } from '@common/types'
import { HttpException } from '@common/exceptions'
import { PRODUCT_GROUP_ERROR } from '@common/errors'

@Injectable()
export class GetOneProductGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, branchId: string): Promise<ProductGroup> {
    const productGroup = await this.prismaClient.productGroup.findUnique({
      where: { id, branchId },
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
          },
          include: {
            children: {
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
            }
          }
        }
      }
    })

    if (!productGroup) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_GROUP_ERROR.PRODUCT_GROUP_NOT_FOUND)
    }

    return productGroup
  }
}
