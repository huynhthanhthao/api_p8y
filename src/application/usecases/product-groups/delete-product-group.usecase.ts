import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { PRODUCT_GROUP_ERROR } from '@common/errors'

@Injectable()
export class DeleteProductGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, branchId: string): Promise<string> {
    const productGroup = await this.prismaClient.productGroup.findUnique({
      where: { id, branchId },
      select: {
        _count: {
          select: {
            children: true
          }
        }
      }
    })

    if (!productGroup) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_GROUP_ERROR.PRODUCT_GROUP_NOT_FOUND)
    }

    if (productGroup._count.children) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_GROUP_ERROR.CANNOT_DELETE_PARENT)
    }

    await this.prismaClient.productGroup.update({
      where: { id, branchId },
      data: {
        deletedBy: userId
      }
    })

    await this.prismaClient.productGroup.delete({
      where: {
        id,
        branchId
      },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    })

    return id
  }
}
