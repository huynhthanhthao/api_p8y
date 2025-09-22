import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { CreateRoleRequestDto } from '@interface-adapter/dtos/roles'
import { ROLE_ERROR } from '@common/errors'
import { Role } from '@common/types'
import { ROLE_SELECT_FIELDS } from '@common/constants'

@Injectable()
export class CreateRoleUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(data: CreateRoleRequestDto, userId: string, storeCode: string): Promise<Role> {
    const existingRecord = await this.prismaClient.role.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive'
        },
        storeCode
      }
    })

    if (existingRecord) throw new HttpException(HttpStatus.CONFLICT, ROLE_ERROR.NAME_ALREADY_EXISTS)

    return await this.prismaClient.role.create({
      data: {
        name: data.name,
        permissions: {
          connect: data.permissionIds.map(code => ({ code }))
        },
        createdBy: userId,
        storeCode
      },
      ...ROLE_SELECT_FIELDS
    })
  }
}
