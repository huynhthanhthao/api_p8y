import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { Role } from '@common/types'
import { HttpException } from '@common/exceptions'
import { ROLE_ERROR } from '@common/errors'
import { ROLE_SELECT_FIELDS } from '@common/constants'

@Injectable()
export class GetOneRoleUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, storeCode: string): Promise<Role> {
    const role = await this.prismaClient.role.findUnique({
      where: { id, storeCode },
      ...ROLE_SELECT_FIELDS
    })

    if (!role) {
      throw new HttpException(HttpStatus.NOT_FOUND, ROLE_ERROR.ROLE_NOT_FOUND)
    }

    return role
  }
}
