import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import {
  UpdateCustomerRequestDto,
  UpdateCustomerResponseDto
} from '@interface-adapter/dtos/customers'
import { CUSTOMER_ERROR, CUSTOMER_GROUP_ERROR } from '@common/errors'
import { generateCodeModel } from '@common/utils'
import { id } from 'zod/v4/locales/index.cjs'
import { CUSTOMER_INCLUDE_FIELDS } from '@common/constants'

@Injectable()
export class UpdateCustomerUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    id: string,
    data: UpdateCustomerRequestDto,
    userId: string,
    storeCode: string
  ): Promise<UpdateCustomerResponseDto> {
    const customer = await this.prismaClient.customer.findUnique({
      where: {
        id: id,
        storeCode
      }
    })

    if (!customer) {
      throw new HttpException(HttpStatus.CONFLICT, CUSTOMER_ERROR.CUSTOMER_NOT_FOUND)
    }

    if (data.name && data.name !== customer.name) {
      const recordWithSameName = await this.prismaClient.customer.findFirst({
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
        throw new HttpException(HttpStatus.CONFLICT, CUSTOMER_GROUP_ERROR.NAME_ALREADY_EXISTS)
      }
    }

    await this.validateUniqueFields(data, storeCode, id)

    return this.prismaClient.customer.update({
      where: {
        id: id,
        storeCode
      },
      data: {
        name: data.name,
        code: data.code || (await generateCodeModel({ model: 'Customer', storeCode })),
        avatarId: data.avatarId,
        birthday: data.birthday,
        customerGroupId: data.customerGroupId,
        gender: data.gender,
        email: data.email,
        phone: data.phone,
        note: data.note,
        ...(data.customerInvoiceInfo && {
          customerInvoiceInfo: {
            update: {
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
          }
        }),
        updatedBy: userId
      },
      ...CUSTOMER_INCLUDE_FIELDS
    })
  }

  private async validateUniqueFields(
    data: UpdateCustomerRequestDto,
    storeCode: string,
    currentId: string
  ): Promise<void> {
    const existingCustomer = await this.prismaClient.customer.findFirst({
      where: {
        id: {
          not: currentId
        },
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
