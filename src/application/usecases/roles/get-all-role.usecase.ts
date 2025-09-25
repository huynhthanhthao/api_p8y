import { Prisma } from '@prisma/client'
import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import { GetAllRoleRequestDto, GetAllRoleResponseDto } from '@interface-adapter/dtos/roles'
import { ROLE_SELECT_FIELDS } from '@common/constants'

@Injectable()
export class GetAllRoleUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(data: GetAllRoleRequestDto, storeCode: string): Promise<GetAllRoleResponseDto> {
    const { page, perPage, keyword, orderBy, sortBy } = data

    const where: Prisma.RoleWhereInput = {
      storeCode
    }

    if (keyword) {
      where.OR = [{ name: { contains: keyword, mode: 'insensitive' } }]
    }

    return await this.prismaClient.findManyWithPagination(
      'role',
      {
        where,
        orderBy: { [sortBy]: orderBy },
        ...ROLE_SELECT_FIELDS
      },
      { page, perPage }
    )
  }
}
