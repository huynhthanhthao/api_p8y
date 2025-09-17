import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { CustomerGroup } from '@common/types'
import { HttpException } from '@common/exceptions'
import { CUSTOMER_GROUP_ERROR } from '@common/errors'

@Injectable()
export class GetOneCustomerGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, storeCode: string): Promise<CustomerGroup> {
    const customerGroup = await this.prismaClient.customerGroup.findUnique({
      where: { id, storeCode },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    })

    if (!customerGroup) {
      throw new HttpException(HttpStatus.NOT_FOUND, CUSTOMER_GROUP_ERROR.CUSTOMER_GROUP_NOT_FOUND)
    }

    return customerGroup
  }
}
