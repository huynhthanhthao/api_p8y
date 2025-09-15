import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { Customer } from '@common/types'
import { HttpException } from '@common/exceptions'
import { CUSTOMER_ERROR } from '@common/errors'

@Injectable()
export class GetOneCustomerUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(id: string, storeCode: string): Promise<Customer> {
    const customer = await this.prismaClient.customer.findUnique({
      where: { id, storeCode },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      },
      include: {
        customerInvoiceInfo: true,
        customerGroup: {
          omit: {
            deletedAt: true,
            deletedBy: true,
            createdBy: true,
            updatedBy: true
          }
        },
        avatar: {
          omit: {
            deletedAt: true,
            deletedBy: true,
            createdBy: true,
            updatedBy: true
          }
        }
      }
    })

    if (!customer) {
      throw new HttpException(HttpStatus.NOT_FOUND, CUSTOMER_ERROR.CUSTOMER_NOT_FOUND)
    }

    return customer
  }
}
