import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { HttpException } from '@common/exceptions'
import { USER_ERROR } from '@common/errors/'
import { generateTimesTamp } from '@common/helpers'
@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, userId: string, storeCode: string): Promise<string> {
    const user = await this.prismaClient.user.findUnique({
      where: { id, storeCode }
    })

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, USER_ERROR.USER_NOT_FOUND)
    }

    if (user.id === userId)
      throw new HttpException(HttpStatus.BAD_REQUEST, USER_ERROR.CANNOT_DELETE_YOURSELF)

    await this.prismaClient.user.update({
      where: { id, storeCode },
      data: {
        phone: `del_${user.phone}_${generateTimesTamp()}`,
        email: user.email ? `del_${user.email}_${generateTimesTamp()}` : null,
        deletedBy: userId
      }
    })

    await this.prismaClient.user.delete({
      where: {
        id,
        storeCode
      }
    })

    return id
  }
}
