import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import {
  CreateInvoiceRequestDto,
  CreateInvoiceResponseDto
} from '@interface-adapter/dtos/invoinces'
import { generateCodeModel } from '@common/utils'
import { INVOICE_INCLUDE_FIELDS } from '@common/constants'
import { HttpException } from '@common/exceptions'
import { INVOICE_ERROR } from '@common/errors'

@Injectable()
export class CreateInvoiceUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: CreateInvoiceRequestDto,
    userId: string,
    branchId: string
  ): Promise<CreateInvoiceResponseDto> {
    const productIds = data.invoiceItems.map(item => item.productId)

    const productList = await this.prismaClient.product.findMany({
      where: {
        id: {
          in: productIds
        },
        branchId
      },
      select: {
        id: true,
        costPrice: true
      }
    })

    if (productIds.length !== productList.length)
      throw new HttpException(HttpStatus.NOT_FOUND, INVOICE_ERROR.SOME_INVOICES_NOT_FOUND)

    return this.prismaClient.invoice.create({
      data: {
        code: await generateCodeModel({ model: 'Invoice', branchId }),
        status: data.status,
        customerId: data.customerId,
        discountType: data.discountType,
        discountValue: data.discountValue,
        note: data.note,
        paymentMethodCode: data.paymentMethodCode,
        branchId,
        createdBy: userId,
        invoiceItems: {
          create: data.invoiceItems.map(item => ({
            quantity: item.quantity,
            costPrice: productList.find(p => p.id === item.productId)?.costPrice || 0,
            salePrice: item.salePrice,
            discountValue: item.discountValue,
            discountType: item.discountType,
            note: item.note,
            productId: item.productId,
            productLotId: item.productLotId
          }))
        }
      },
      ...INVOICE_INCLUDE_FIELDS
    })
  }
}
