import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { ROLE_ERROR } from '@common/errors'

@Injectable()
export class DeleteRoleUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, storeCode: string): Promise<string> {
    const role = await this.prismaClient.role.findUnique({
      where: { id, storeCode },
      select: {
        id: true,
        users: {
          take: 1
        }
      }
    })

    if (!role) {
      throw new HttpException(HttpStatus.NOT_FOUND, ROLE_ERROR.ROLE_NOT_FOUND)
    }

    if (!!role.users.length) throw new HttpException(HttpStatus.BAD_REQUEST, ROLE_ERROR.ROLE_IN_USE)

    await this.prismaClient.role.delete({
      where: {
        id,
        storeCode
      }
    })

    return id
  }
}
