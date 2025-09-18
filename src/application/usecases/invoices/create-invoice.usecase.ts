import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { CreateInvoiceRequestDto } from '@interface-adapter/dtos/invoinces'
import { generateCodeModel } from '@common/utils'
import { INVOICE_INCLUDE_FIELDS } from '@common/constants'
import { HttpException } from '@common/exceptions'
import { INVOICE_ERROR } from '@common/errors'
import { Invoice, Product } from '@common/types'

@Injectable()
export class CreateInvoiceUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(data: CreateInvoiceRequestDto, userId: string, branchId: string): Promise<Invoice> {
    const productIds = data.invoiceItems.map(item => item.productId)

    const productList = (await this.prismaClient.product.findMany({
      where: {
        id: {
          in: productIds
        },
        branchId,
        isDirectSale: true
      },
      select: {
        id: true,
        code: true,
        costPrice: true,
        isStockEnabled: true,
        isLotEnabled: true,
        isDirectSale: true
      }
    })) as Product[]

    /**
     * Kiểm tra sản phẩm hợp lệ
     */
    if (productIds.length !== productList.length)
      throw new HttpException(HttpStatus.NOT_FOUND, INVOICE_ERROR.SOME_INVOICES_NOT_FOUND)

    /**
     * Kiểm tra sản phẩm có lô hợp lệ chưa
     */
    this.checkMissingProductLotId(data, productList)

    /**
     * Xử lý cập nhật kho
     * ...
     */

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

  private checkMissingProductLotId(data: CreateInvoiceRequestDto, productList: Product[]): void {
    // Tạo Map từ invoiceItems để tra cứu nhanh productLotId theo productId
    const invoiceItemMap = new Map(
      data.invoiceItems.map(item => [item.productId, item.productLotId])
    )

    // Tìm sản phẩm đầu tiên trong productList có isLotEnabled: true nhưng thiếu productLotId
    const invalidProduct = productList.find(
      product => product.isLotEnabled && !invoiceItemMap.get(product.id)
    )

    if (invalidProduct) {
      throw new HttpException(HttpStatus.BAD_REQUEST, INVOICE_ERROR.MISSING_PRODUCT_LOT_ID, [
        invalidProduct?.code
      ])
    }
  }
}
