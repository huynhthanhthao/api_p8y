import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { CustomerGroup } from '@common/types'
import { HttpException } from '@common/exceptions'
import { CUSTOMER_GROUP_ERROR } from '@common/errors'
import { AccessBranchDecodeJWT } from '@common/interfaces'

@Injectable()
export class DeleteCustomerGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, storeCode: string): Promise<CustomerGroup> {
    const customerGroup = await this.prismaClient.customerGroup.findUnique({
      where: { id, storeCode }
    })

    if (!customerGroup) {
      throw new HttpException(HttpStatus.NOT_FOUND, CUSTOMER_GROUP_ERROR.CUSTOMER_GROUP_NOT_FOUND)
    }

    await this.prismaClient.customerGroup.update({
      where: { id, storeCode },
      data: {
        deletedBy: userId
      }
    })

    return await this.prismaClient.customerGroup.delete({
      where: {
        id,
        storeCode
      },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    })
  }
}
