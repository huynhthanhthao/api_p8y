import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { UpdateProductRequestDto } from '@interface-adapter/dtos/products'
import { PRODUCT_ERROR } from '@common/errors'
import { generateCodeModel, validateUniqueFields, validateValidEnableLot } from '@common/utils'
import { validateStockRange } from '@common/utils/products/validate-stock-range'
import { PRODUCT_INCLUDE_FIELDS } from '@common/constants'
import { Prisma } from '@prisma/client'
import { Product } from '@common/types'
import { StockCardTypeEnum, StockTransactionStatusEnum } from '@common/enums'

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    id: string,
    data: UpdateProductRequestDto,
    userId: string,
    branchId: string
  ): Promise<Product> {
    const existingProduct = await this.prismaClient.product.findUnique({
      where: {
        id: id,
        branchId
      },
      include: {
        variants: true,
        stockCards: {
          take: 1,
          where: {
            type: {
              not: StockCardTypeEnum.STOCK_TRANSACTION_CHECK
            }
          }
        }
      }
    })

    /**
     * Kiểm tra sản phẩm có tồn tại không
     */
    if (!existingProduct) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_ERROR.PRODUCT_NOT_FOUND)
    }

    /**
     * Check cập nhật trạng thái quản lý kho
     */
    if (data.isLotEnabled && data.isLotEnabled !== existingProduct.isLotEnabled) {
      if (existingProduct.stockCards.length > 0) {
        throw new HttpException(HttpStatus.BAD_REQUEST, PRODUCT_ERROR.STOCK_CARD_EXISTS)
      }
    }

    /**
     * Kiểm tra thông tin tồn kho
     * Kiểm tra số lượng kho không được để trống nếu quản lý kho không theo lô
     * Kiểm tra mã sản phẩm, barcode không trùng
     */
    validateStockRange(
      data.minStock ?? existingProduct.minStock,
      data.maxStock ?? existingProduct.maxStock
    )
    validateValidEnableLot(
      data.isLotEnabled ?? existingProduct.isLotEnabled,
      data.isStockEnabled ?? existingProduct.isStockEnabled,
      data.stockQuantity
    )
    await validateUniqueFields(this.prismaClient, data, branchId, id)

    /**
     * Xử lý tạo / cập nhật mã sản phẩm
     */

    return await this.prismaClient.$transaction(async tx => {
      /**
       * check cập nhật số lượng kho
       */
      if (data.stockQuantity && data.stockQuantity !== existingProduct.stockQuantity) {
        await tx.stockTransaction.create({
          data: {
            code: await generateCodeModel({ model: 'StockTransaction', branchId, prefix: 'KK' }),
            type: StockCardTypeEnum.STOCK_TRANSACTION_CHECK,
            note: 'Cập nhật số lượng kho',
            createdBy: userId,
            reviewedBy: userId,
            status: StockTransactionStatusEnum.COMPLETED,
            stockItems: {
              create: {
                previousStock: existingProduct.stockQuantity,
                productId: existingProduct.id,
                quantity: data.stockQuantity
              }
            },
            stockCards: {
              create: {
                type: StockCardTypeEnum.STOCK_TRANSACTION_CHECK,
                products: {
                  connect: { id: existingProduct.id }
                },
                branchId
              }
            },
            branchId
          }
        })
      }

      /**
       * Xử lý cập nhật sản phẩm cùng loại
       */
      if (data.variants) {
        await this.handleVariants(tx, data, existingProduct, userId, branchId)
      }

      /**
       * cập nhật sản phẩm
       */
      return await tx.product.update({
        where: {
          id: id,
          branchId
        },
        data: {
          name: data.name,
          code: data.code || (await generateCodeModel({ model: 'Product', branchId })),
          productGroupId: data.productGroupId,
          type: data.type,
          barcode: data.barcode,
          shortName: data.shortName,
          description: data.description,
          isDirectSale: data.isDirectSale,
          salePrice: data.salePrice,
          costPrice: data.costPrice,
          isStockEnabled: data.isStockEnabled,
          isLotEnabled: data.isLotEnabled,
          maxStock: data.maxStock,
          minStock: data.minStock,
          package: data.package,
          country: data.country,
          manufacturerId: data.manufacturerId,
          unitName: data.unitName,
          updatedBy: userId,
          branchId,
          stockQuantity: data.stockQuantity,
          ...(data.isLotEnabled && {
            stockQuantity: null
          }),
          ...(data.photoIds && {
            photos: {
              set: data.photoIds.map(id => ({ id }))
            }
          }),
          ...(data.productLocationIds && {
            productLocations: {
              set: data.productLocationIds.map(id => ({ id }))
            }
          }),
          ...(data.productWeight && {
            productWeight: {
              upsert: {
                create: {
                  unit: data.productWeight.unit,
                  value: data.productWeight.value
                },
                update: {
                  unit: data.productWeight.unit,
                  value: data.productWeight.value
                }
              }
            }
          }),
          ...(data.medicineInfo && {
            medicineInfo: {
              upsert: {
                create: {
                  dosage: data.medicineInfo.dosage,
                  ingredient: data.medicineInfo.ingredient,
                  regNumber: data.medicineInfo.regNumber,
                  routeId: data.medicineInfo.routeId
                },
                update: {
                  dosage: data.medicineInfo.dosage,
                  ingredient: data.medicineInfo.ingredient,
                  regNumber: data.medicineInfo.regNumber,
                  routeId: data.medicineInfo.routeId
                }
              }
            }
          })
        },
        ...PRODUCT_INCLUDE_FIELDS
      })
    })
  }

  private async handleVariants(
    tx: Prisma.TransactionClient,
    data: UpdateProductRequestDto,
    existingProduct: Awaited<ReturnType<typeof this.prismaClient.product.findUnique>> & {
      variants: Awaited<ReturnType<typeof this.prismaClient.product.findMany>>
    },
    userId: string,
    branchId: string
  ): Promise<void> {
    /**
     * Lấy danh sách variant hiện tại
     */
    const existingVariantIds = existingProduct.variants.map(v => v.id)
    const incomingVariantIds = data.variants!.filter(v => v.id).map(v => v.id as string)

    /**
     * Xóa các variant không còn tồn tại trong dữ liệu mới
     */
    const variantsToDelete = existingVariantIds.filter(id => !incomingVariantIds.includes(id))

    if (variantsToDelete.length > 0) {
      await tx.product.updateMany({
        where: {
          id: { in: variantsToDelete },
          branchId
        },
        data: {
          deletedAt: new Date(),
          deletedBy: userId
        }
      })
    }

    /**
     * Cập nhật hoặc tạo mới các variant
     */

    for (const [index, variant] of data.variants!.entries()) {
      const productCodeNext = await generateCodeModel({ model: 'Product', branchId })

      if (variant.id) {
        /**
         *Cập nhật variant hiện có
         */

        await tx.product.update({
          where: { id: variant.id, branchId },
          data: {
            /**
             * data with parent
             */
            name: data.name,
            shortName: data.shortName,
            isStockEnabled: data.isStockEnabled,
            isLotEnabled: data.isLotEnabled,
            description: data.description,
            manufacturerId: data.manufacturerId,
            maxStock: data.maxStock,
            minStock: data.minStock,
            package: data.package,
            country: data.country,
            ...(data.photoIds && {
              photos: {
                set: data.photoIds.map(id => ({ id }))
              }
            }),

            /**
             * data with variant
             */
            code: variant.code || productCodeNext,
            barcode: variant.barcode,
            unitName: variant.unitName,
            conversion: variant.conversion || 1,
            salePrice: variant.salePrice,
            isDirectSale: variant.isDirectSale,
            updatedBy: userId
          }
        })
      } else {
        /**
         * Tạo variant mới
         */
        await tx.product.create({
          data: {
            /**
             * data with parent
             */
            parentId: existingProduct.id,
            isStockEnabled: data.isStockEnabled || existingProduct.isStockEnabled,
            isLotEnabled: data.isLotEnabled || existingProduct.isLotEnabled,
            name: data.name || existingProduct.name,
            shortName: data.shortName || existingProduct.shortName,
            productGroupId: data.productGroupId || existingProduct.productGroupId,
            package: data.package || existingProduct.package,
            country: data.country || existingProduct.country,
            manufacturerId: data.manufacturerId || existingProduct.manufacturerId,
            ...(data.photoIds && {
              photos: {
                connect: data.photoIds.map(id => ({ id }))
              }
            }),
            /**
             * data with variant
             */
            code: productCodeNext,
            barcode: variant.barcode,
            unitName: variant.unitName,
            conversion: variant.conversion,
            createdBy: userId,
            branchId,
            salePrice: variant.salePrice,
            isDirectSale: variant.isDirectSale
          }
        })
      }
    }
  }
}
