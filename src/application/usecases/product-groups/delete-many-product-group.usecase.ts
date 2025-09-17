import { Prisma } from '@prisma/client'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { DeleteManyRequestDto } from '@common/dtos'
import { HttpException } from '@common/exceptions'
import { PRODUCT_GROUP_ERROR } from '@common/errors'

@Injectable()
export class DeleteManyProductGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: DeleteManyRequestDto,
    userId: string,
    branchId: string
  ): Promise<Prisma.BatchPayload> {
    const existingGroups = await this.prismaClient.productGroup.findMany({
      where: {
        id: { in: data.ids },
        branchId
      },
      select: {
        id: true,
        _count: {
          select: {
            children: true
          }
        }
      }
    })

    if (existingGroups.length !== data.ids.length) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        PRODUCT_GROUP_ERROR.SOME_PRODUCT_GROUPS_NOT_FOUND
      )
    }

    // 2. Kiểm tra có nhóm nào là cha (có children > 0)
    const hasChildren = existingGroups.some(g => g._count.children > 0)

    if (hasChildren) {
      throw new HttpException(HttpStatus.BAD_REQUEST, PRODUCT_GROUP_ERROR.CANNOT_DELETE_PARENT)
    }

    await this.prismaClient.productGroup.updateMany({
      where: { id: { in: data.ids }, branchId },
      data: { deletedBy: userId }
    })

    return await this.prismaClient.productGroup.deleteMany({
      where: {
        id: { in: data.ids },
        branchId
      }
    })
  }
}
