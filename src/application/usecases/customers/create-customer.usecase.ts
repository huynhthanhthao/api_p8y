import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { CUSTOMER_ERROR } from '@common/errors'
import { CreateCustomerRequestDto } from '@interface-adapter/dtos/customers'
import { generateCodeModel } from '@common/utils'
import { CUSTOMER_INCLUDE_FIELDS } from '@common/constants'
import { Customer } from '@common/types'

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: CreateCustomerRequestDto,
    userId: string,
    storeCode: string
  ): Promise<Customer> {
    await this.validateUniqueFields(data, storeCode)

    return await this.prismaClient.customer.create({
      data: {
        ...data,
        code: data.code || (await generateCodeModel({ model: 'Customer', storeCode })),
        ...(data.customerInvoiceInfo && {
          customerInvoiceInfo: {
            create: {
              buyerName: data.customerInvoiceInfo.buyerName,
              address: data.customerInvoiceInfo.address,
              bankName: data.customerInvoiceInfo.bankName,
              bankAccount: data.customerInvoiceInfo.bankAccount,
              email: data.customerInvoiceInfo.email,
              identityNumber: data.customerInvoiceInfo.identityNumber,
              phone: data.customerInvoiceInfo.phone,
              taxCode: data.customerInvoiceInfo.taxCode,
              ward: data.customerInvoiceInfo.ward,
              province: data.customerInvoiceInfo.province,
              budgetUnitCode: data.customerInvoiceInfo.budgetUnitCode
            }
          },
          createdBy: userId
        }),
        storeCode
      },
      ...CUSTOMER_INCLUDE_FIELDS
    })
  }

  private async validateUniqueFields(
    data: CreateCustomerRequestDto,
    storeCode: string
  ): Promise<void> {
    const existingCustomer = await this.prismaClient.customer.findFirst({
      where: {
        OR: [
          {
            code: data.code
          },
          {
            phone: data.phone
          },
          {
            email: data.email
          }
        ],
        storeCode
      },
      select: {
        phone: true,
        email: true,
        code: true
      }
    })

    if (existingCustomer) {
      if (data.phone && existingCustomer.phone === data.phone) {
        throw new HttpException(HttpStatus.CONFLICT, CUSTOMER_ERROR.PHONE_ALREADY_EXISTS)
      }

      if (data.email && existingCustomer.email === data.email) {
        throw new HttpException(HttpStatus.CONFLICT, CUSTOMER_ERROR.EMAIL_ALREADY_EXISTS)
      }

      if (data.code && existingCustomer.code === data.code) {
        throw new HttpException(HttpStatus.CONFLICT, CUSTOMER_ERROR.CODE_ALREADY_EXISTS)
      }
    }
  }
}
