import { USER_SELECT_FIELDS } from '@common/constants'
import { PrismaService } from '@infrastructure/prisma'
import { GetAllUserRequestDto, GetAllUserResponseDto } from '@interface-adapter/dtos/users'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Injectable()
export class GetAllUserUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(params: GetAllUserRequestDto, storeCode: string): Promise<GetAllUserResponseDto> {
    const { page, perPage, keyword, orderBy, sortBy, roleIds, branchIds } = params

    const where: Prisma.UserWhereInput = {
      storeCode,
      ...(!!roleIds?.length && {
        roles: {
          some: {
            id: { in: roleIds }
          }
        }
      }),
      ...(!!branchIds?.length && {
        branches: {
          some: {
            id: { in: branchIds }
          }
        }
      })
    }

    if (keyword) {
      const searchKeys = ['firstName', 'lastName', 'phone', 'email']

      where.OR = searchKeys.map(key => ({
        [key]: {
          contains: keyword,
          mode: 'insensitive'
        }
      }))
    }

    return await this.prismaClient.findManyWithPagination(
      'user',
      {
        where,
        orderBy: { [sortBy]: orderBy },
        ...USER_SELECT_FIELDS
      },
      { page, perPage }
    )
  }
}
