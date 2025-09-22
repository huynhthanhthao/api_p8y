import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { User } from '@common/types'
import { HttpException } from '@common/exceptions'
import { USER_ERROR } from '@common/errors'
import { USER_SELECT_FIELDS } from '@common/constants'

@Injectable()
export class GetOneUserUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, storeCode: string): Promise<User> {
    const user = await this.prismaClient.user.findUnique({
      where: { id, storeCode },
      ...USER_SELECT_FIELDS
    })

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, USER_ERROR.USER_NOT_FOUND)
    }

    return user
  }
}
