import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { UpdateRoleRequestDto } from '@interface-adapter/dtos/roles'
import { Role } from '@common/types'
import { ROLE_ERROR } from '@common/errors'
import { ROLE_SELECT_FIELDS } from '@common/constants'

@Injectable()
export class UpdateRoleUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    id: string,
    data: UpdateRoleRequestDto,
    userId: string,
    storeCode: string
  ): Promise<Role> {
    const role = await this.prismaClient.role.findUnique({
      where: {
        id: id,
        storeCode
      }
    })

    if (!role) {
      throw new HttpException(HttpStatus.NOT_FOUND, ROLE_ERROR.ROLE_NOT_FOUND)
    }

    if (data.name && data.name !== role.name) {
      const recordWithSameName = await this.prismaClient.role.findFirst({
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
        throw new HttpException(HttpStatus.CONFLICT, ROLE_ERROR.NAME_ALREADY_EXISTS)
      }
    }

    return this.prismaClient.role.update({
      where: {
        id: id,
        storeCode
      },
      data: {
        name: data.name,
        ...(data.permissionIds && {
          permissions: {
            set: data.permissionIds.map(code => ({ code }))
          }
        }),
        updatedBy: userId
      },
      ...ROLE_SELECT_FIELDS
    })
  }
}
