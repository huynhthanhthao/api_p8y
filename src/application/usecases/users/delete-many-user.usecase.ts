import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { DeleteManyRequestDto } from '@common/dtos'
import { Prisma } from '@prisma/client'
import { HttpException } from '@common/exceptions'
import { generateTimesTamp } from '@common/helpers'
import { USER_ERROR } from '@common/errors'

@Injectable()
export class DeleteManyUserUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: DeleteManyRequestDto,
    userId: string,
    storeCode: string
  ): Promise<Prisma.BatchPayload> {
    const users = await this.prismaClient.user.findMany({
      where: {
        id: { in: data.ids },
        storeCode
      },
      select: {
        id: true,
        phone: true,
        email: true
      }
    })

    if (users.length !== data.ids.length) {
      throw new HttpException(HttpStatus.NOT_FOUND, USER_ERROR.SOME_USERS_NOT_FOUND)
    }

    if (users.some(user => user.id === userId))
      throw new HttpException(HttpStatus.BAD_REQUEST, USER_ERROR.CANNOT_DELETE_YOURSELF)

    /**
     * Cập nhật thông tin trước khi xóa (đánh dấu đã xóa và thay đổi các trường duy nhất)
     */
    const updatePromises = users.map(user =>
      this.prismaClient.user.update({
        where: { id: user.id, storeCode },
        data: {
          deletedBy: userId,
          phone: `del_${user.phone}_${generateTimesTamp()}`,
          email: user.email ? `del_${user.email}_${generateTimesTamp()}` : null
        }
      })
    )

    await Promise.all(updatePromises)

    return await this.prismaClient.user.deleteMany({
      where: {
        id: { in: data.ids },
        storeCode
      }
    })
  }
}
