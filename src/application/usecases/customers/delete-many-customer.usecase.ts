import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { DeleteManyRequestDto } from '@common/dtos'
import { Prisma } from '@prisma/client'
import { HttpException } from '@common/exceptions'
import { CUSTOMER_ERROR } from '@common/errors'

@Injectable()
export class DeleteManyCustomerUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: DeleteManyRequestDto,
    userId: string,
    storeCode: string
  ): Promise<Prisma.BatchPayload> {
    const customers = await this.prismaClient.customer.findMany({
      where: {
        id: { in: data.ids },
        storeCode
      },
      select: {
        id: true,
        code: true,
        phone: true,
        email: true
      }
    })

    if (customers.length !== data.ids.length) {
      throw new HttpException(HttpStatus.NOT_FOUND, CUSTOMER_ERROR.SOME_CUSTOMERS_NOT_FOUND)
    }

    // Cập nhật thông tin trước khi xóa (đánh dấu đã xóa và thay đổi các trường duy nhất)
    const updatePromises = customers.map(customer =>
      this.prismaClient.customer.update({
        where: { id: customer.id, storeCode },
        data: {
          deletedBy: userId
        }
      })
    )

    await Promise.all(updatePromises)

    return await this.prismaClient.customer.deleteMany({
      where: {
        id: { in: data.ids },
        storeCode
      }
    })
  }
}
