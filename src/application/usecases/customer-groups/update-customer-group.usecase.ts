import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import {
  UpdateCustomerGroupRequestDto,
  UpdateCustomerGroupResponseDto
} from '@interface-adapter/dtos/customer-groups'
import { CUSTOMER_GROUP_ERROR } from '@common/errors/customer-group.error'

@Injectable()
export class UpdateCustomerGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    id: string,
    data: UpdateCustomerGroupRequestDto,
    userId: string
  ): Promise<UpdateCustomerGroupResponseDto> {
    const existingGroup = await this.prismaClient.customerGroup.findUniqueOrThrow({
      where: {
        id: id
      }
    })

    if (data.name && data.name !== existingGroup.name) {
      const groupWithSameName = await this.prismaClient.customerGroup.findFirst({
        where: {
          name: {
            equals: data.name,
            mode: 'insensitive'
          },
          id: {
            not: id
          }
        }
      })

      if (groupWithSameName) {
        throw new HttpException(HttpStatus.CONFLICT, CUSTOMER_GROUP_ERROR.NAME_ALREADY_EXISTS)
      }
    }

    return this.prismaClient.customerGroup.update({
      where: {
        id: id
      },
      data: {
        name: data.name,
        discountValue: data.discountValue,
        discountType: data.discountType,
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
