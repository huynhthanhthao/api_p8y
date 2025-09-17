import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { UpdateCustomerGroupRequestDto } from '@interface-adapter/dtos/customer-groups'
import { CUSTOMER_GROUP_ERROR } from '@common/errors'
import { CustomerGroup } from '@common/types'

@Injectable()
export class UpdateCustomerGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    id: string,
    data: UpdateCustomerGroupRequestDto,
    userId: string,
    storeCode: string
  ): Promise<CustomerGroup> {
    const customerGroup = await this.prismaClient.customerGroup.findUnique({
      where: {
        id: id,
        storeCode
      }
    })

    if (!customerGroup) {
      throw new HttpException(HttpStatus.NOT_FOUND, CUSTOMER_GROUP_ERROR.CUSTOMER_GROUP_NOT_FOUND)
    }

    if (data.name && data.name !== customerGroup.name) {
      const recordWithSameName = await this.prismaClient.customerGroup.findFirst({
        where: {
          name: {
            equals: data.name,
            mode: 'insensitive'
          },
          id: {
            not: id
          },
          storeCode
        }
      })

      if (recordWithSameName) {
        throw new HttpException(HttpStatus.CONFLICT, CUSTOMER_GROUP_ERROR.NAME_ALREADY_EXISTS)
      }
    }

    return this.prismaClient.customerGroup.update({
      where: {
        id: id,
        storeCode
      },
      data: {
        ...data,
        updatedBy: userId
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
