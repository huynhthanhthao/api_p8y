import { Prisma } from '@prisma/client'
import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import {
  GetAllPermissionGroupRequestDto,
  GetAllPermissionGroupResponseDto
} from '@interface-adapter/dtos/permission-groups'

@Injectable()
export class GetAllPermissionGroupUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(data: GetAllPermissionGroupRequestDto): Promise<GetAllPermissionGroupResponseDto> {
    const { page, perPage, keyword, orderBy, sortBy } = data

    const where: Prisma.PermissionGroupWhereInput = {}

    if (keyword) {
      where.OR = [{ name: { contains: keyword, mode: 'insensitive' } }]
    }

    return await this.prismaClient.findManyWithPagination(
      'permissionGroup',
      {
        where,
        orderBy: { name: 'asc' },
        include: {
          permissions: true
        }
      },
      { page, perPage }
    )
  }
}
