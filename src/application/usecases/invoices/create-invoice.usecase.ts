import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { CreateInvoiceRequestDto } from '@interface-adapter/dtos/invoinces'
import { generateCodeModel, updateStockQuantity } from '@common/utils'
import { INVOICE_INCLUDE_FIELDS } from '@common/constants'
import { HttpException } from '@common/exceptions'
import { INVOICE_ERROR } from '@common/errors'
import { Invoice, Product } from '@common/types'
import { InvoiceStatusEnum, StockCardTypeEnum } from '@common/enums'

@Injectable()
export class CreateInvoiceUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(data: CreateInvoiceRequestDto, userId: string, branchId: string): Promise<Invoice> {
    if (data.status === InvoiceStatusEnum.CANCELED)
      throw new HttpException(HttpStatus.BAD_REQUEST, INVOICE_ERROR.CANNOT_CREATE_CANCELED_INVOICE)

    const productIds = data.invoiceItems.map(item => item.productId)

    const productList = await this.prismaClient.product.findMany({
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
        isDirectSale: true,
        stockQuantity: true
      }
    })

    /**
     * Kiểm tra sản phẩm hợp lệ
     */
    if (productIds.length !== productList.length)
      throw new HttpException(HttpStatus.NOT_FOUND, INVOICE_ERROR.SOME_INVOICES_NOT_FOUND)

    /**
     * Kiểm tra sản phẩm có lô hợp lệ chưa
     */
    this.checkMissingProductLotId(data, productList)

    return await this.prismaClient.$transaction(async (tx: PrismaService) => {
      const invoice = await tx.invoice.create({
        data: {
          code: await generateCodeModel({ model: 'Invoice', branchId }),
          status: data.status,
          customerId: data.customerId,
          discountType: data.discountType,
          moneyReceived: data.moneyReceived,
          discountValue: data.discountValue,
          note: data.note,
          paymentMethodCode: data.paymentMethodCode,
          branchId,
          createdBy: userId,
          invoiceItems: {
            create: data.invoiceItems.map(item => ({
              costPrice: productList.find(p => p.id === item.productId)?.costPrice || 0,
              salePrice: item.salePrice,
              discountValue: item.discountValue,
              quantity: item.quantity,
              discountType: item.discountType,
              note: item.note,
              productId: item.productId,
              productLotId: item.productLotId
            }))
          }
        },
        ...INVOICE_INCLUDE_FIELDS
      })

      /**
       * Xử lý cập nhật kho
       */
      for (const item of data.invoiceItems) {
        const product = productList.find(p => p.id === item.productId)
        if (!product) continue

        /**
         * Chỉ cập nhật kho nếu sản phẩm có bật quản lý kho
         *  */
        if (product.isStockEnabled) {
          await updateStockQuantity(
            {
              productId: product.id,
              isLotEnabled: product.isLotEnabled,
              productLotId: item.productLotId!,
              quantity: item.quantity
            },
            StockCardTypeEnum.INVOICE,
            tx
          )
        }
      }

      return invoice
    })
  }

  private checkMissingProductLotId(
    data: CreateInvoiceRequestDto,
    productList: Pick<Product, 'id' | 'isLotEnabled' | 'code'>[]
  ): void {
    for (const product of productList) {
      const item = data.invoiceItems.find(i => i.productId === product.id)

      if (!item) continue

      if (product.isLotEnabled) {
        /**
         * Quản lý theo lô: bắt buộc có lots, quantity = 0
         */
        if (!item.productLotId) {
          throw new HttpException(HttpStatus.BAD_REQUEST, INVOICE_ERROR.MISSING_PRODUCT_LOT_ID, [
            product.code
          ])
        }
      } else {
        /**
         * Không quản lý lô: không được truyền lots
         */
        if (item.productLotId) {
          throw new HttpException(HttpStatus.BAD_REQUEST, INVOICE_ERROR.UNEXPECTED_PRODUCT_LOT, [
            product.code
          ])
        }
      }
    }
  }
}
