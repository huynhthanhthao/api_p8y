import { PrismaService } from '@infrastructure/prisma'
import {
  GetAllCustomerRequestDto,
  GetAllCustomerResponseDto
} from '@interface-adapter/dtos/customers'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Injectable()
export class GetAllCustomerUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    params: GetAllCustomerRequestDto,
    storeCode: string
  ): Promise<GetAllCustomerResponseDto> {
    const { page, perPage, keyword, orderBy, sortBy, customerGroupIds } = params

    const where: Prisma.CustomerWhereInput = {
      storeCode,
      ...(!!customerGroupIds?.length && {
        customerGroupId: {
          in: customerGroupIds
        }
      })
    }

    if (keyword) {
      const searchKeys = ['name', 'phone', 'email']

      where.OR = searchKeys.map(key => ({
        [key]: {
          contains: keyword,
          mode: 'insensitive'
        }
      }))
    }

    return await this.prismaClient.findManyWithPagination(
      'customer',
      {
        where,
        orderBy: { [sortBy]: orderBy },
        omit: {
          deletedAt: true,
          deletedBy: true,
          createdBy: true,
          updatedBy: true
        },
        include: {
          customerGroup: {
            omit: {
              deletedAt: true,
              deletedBy: true,
              createdBy: true,
              updatedBy: true
            }
          },
          avatar: {
            omit: {
              deletedAt: true,
              deletedBy: true,
              createdBy: true,
              updatedBy: true
            }
          }
        }
      },
      { page, perPage }
    )
  }
}
