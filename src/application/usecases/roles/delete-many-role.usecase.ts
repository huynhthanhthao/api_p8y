import { Prisma } from '@prisma/client'
import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { DeleteManyRequestDto } from '@common/dtos'
import { HttpException } from '@common/exceptions'
import { ROLE_ERROR } from '@common/errors'

@Injectable()
export class DeleteManyRoleUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: DeleteManyRequestDto,
    userId: string,
    storeCode: string
  ): Promise<Prisma.BatchPayload> {
    const existingRoles = await this.prismaClient.role.findMany({
      where: {
        id: { in: data.ids },
        storeCode
      },
      select: {
        id: true,
        users: {
          take: 1
        }
      }
    })

    if (existingRoles.length !== data.ids.length) {
      throw new HttpException(HttpStatus.NOT_FOUND, ROLE_ERROR.SOME_ROLES_NOT_FOUND)
    }

    if (existingRoles.some(role => role.users.length > 0))
      throw new HttpException(HttpStatus.BAD_REQUEST, ROLE_ERROR.ROLE_IN_USE)

    return await this.prismaClient.role.deleteMany({
      where: {
        id: { in: data.ids },
        storeCode
      }
    })
  }
}
