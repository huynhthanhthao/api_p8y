import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import {
  CreateCustomerGroupRequestDto,
  CreateCustomerGroupResponseDto
} from '@interface-adapter/dtos/customer-groups'
import { CUSTOMER_GROUP_ERROR } from '@common/errors'

@Injectable()
export class CreateCustomerGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: CreateCustomerGroupRequestDto,
    userId: string,
    storeCode: string
  ): Promise<CreateCustomerGroupResponseDto> {
    const existingGroup = await this.prismaClient.customerGroup.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive'
        },
        storeCode
      }
    })

    if (existingGroup)
      throw new HttpException(HttpStatus.CONFLICT, CUSTOMER_GROUP_ERROR.NAME_ALREADY_EXISTS)

    return await this.prismaClient.customerGroup.create({
      data: {
        ...data,
        createdBy: userId,
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
