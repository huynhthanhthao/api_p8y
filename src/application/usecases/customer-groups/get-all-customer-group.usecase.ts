import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import {
  GetAllCustomerGroupRequestDto,
  GetAllCustomerGroupResponseDto
} from '@interface-adapter/dtos/customer-groups'
import { Prisma } from '@prisma/client'

@Injectable()
export class GetAllCustomerGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: GetAllCustomerGroupRequestDto,
    storeCode: string
  ): Promise<GetAllCustomerGroupResponseDto> {
    const { page, perPage, keyword, orderBy, sortBy } = data

    const where: Prisma.CustomerGroupWhereInput = {
      storeCode
    }

    if (keyword) {
      where.OR = [{ name: { contains: keyword, mode: 'insensitive' } }]
    }

    return await this.prismaClient.findManyWithPagination(
      'customerGroup',
      {
        where,
        orderBy: { [sortBy]: orderBy },
        omit: {
          deletedAt: true,
          deletedBy: true,
          createdBy: true,
          updatedBy: true
        }
      },
      { page, perPage }
    )
  }
}
