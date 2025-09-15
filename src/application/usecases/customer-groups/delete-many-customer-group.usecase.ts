import { Prisma } from '@prisma/client'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { DeleteManyRequestDto } from '@common/dtos'
import { HttpException } from '@common/exceptions'
import { CUSTOMER_GROUP_ERROR } from '@common/errors'

@Injectable()
export class DeleteManyCustomerGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: DeleteManyRequestDto,
    userId: string,
    storeCode: string
  ): Promise<Prisma.BatchPayload> {
    const existingCount = await this.prismaClient.customerGroup.count({
      where: {
        id: { in: data.ids },
        storeCode
      }
    })

    if (existingCount !== data.ids.length) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        CUSTOMER_GROUP_ERROR.SOME_CUSTOMER_GROUPS_NOT_FOUND
      )
    }

    await this.prismaClient.customerGroup.updateMany({
      where: { id: { in: data.ids }, storeCode },
      data: { deletedBy: userId }
    })

    return await this.prismaClient.customerGroup.deleteMany({
      where: {
        id: { in: data.ids },
        storeCode
      }
    })
  }
}
