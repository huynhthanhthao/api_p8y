import { PrismaService } from '@infrastructure/prisma'
import { HttpStatus, Injectable } from '@nestjs/common'
import { HttpException } from '@common/exceptions'
import { UpdateProductRequestDto, UpdateProductResponseDto } from '@interface-adapter/dtos/products'
import { PRODUCT_ERROR } from '@common/errors'
import { generateCodeIncrease, generateCodeModel, validateUniqueFields } from '@common/utils'
import { validateStockRange } from '@common/utils/validate-stock-range'
import { PRODUCT_INCLUDE_FIELDS } from '@common/constants'
import { Prisma } from '@prisma/client'

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
  ): Promise<UpdateProductResponseDto> {
    const existingProduct = await this.prismaClient.product.findUnique({
      where: {
        id: id,
        branchId
      },
      include: {
        variants: true
      }
    })

    if (!existingProduct) {
      throw new HttpException(HttpStatus.NOT_FOUND, PRODUCT_ERROR.PRODUCT_NOT_FOUND)
    }

    // Kiểm tra thông tin tồn kho
    validateStockRange(
      data.minStock || existingProduct.minStock,
      data.maxStock || existingProduct.maxStock
    )

    // // Kiểm tra mã sản phẩm, barcode không trùng
    await validateUniqueFields(this.prismaClient, data, branchId, id)

    const productCode = data.code || (await generateCodeModel({ model: 'Product', branchId }))

    return await this.prismaClient.$transaction(async tx => {
      if (data.variants) {
        await this.handleVariants(tx, data, existingProduct, productCode, userId, branchId)
      }

      return await tx.product.update({
        where: {
          id: id,
          branchId
        },
        data: {
          name: data.name,
          code: productCode,
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
              update: {
                unit: data.productWeight.unit,
                value: data.productWeight.value
              }
            }
          }),
          ...(data.medicineInfo && {
            medicineInfo: {
              update: {
                dosage: data.medicineInfo.dosage,
                ingredient: data.medicineInfo.ingredient,
                regNumber: data.medicineInfo.regNumber,
                routeId: data.medicineInfo.routeId
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
    productCode: string,
    userId: string,
    branchId: string
  ): Promise<void> {
    // Lấy danh sách variant hiện tại
    const existingVariantIds = existingProduct.variants.map(v => v.id)
    const incomingVariantIds = data.variants!.filter(v => v.id).map(v => v.id as string)

    // Xóa các variant không còn tồn tại trong dữ liệu mới
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

    const costPriceBase = data.costPrice || existingProduct.costPrice || 0

    // Cập nhật hoặc tạo mới các variant
    for (const [index, variant] of data.variants!.entries()) {
      if (variant.id) {
        // Cập nhật variant hiện có
        await tx.product.update({
          where: { id: variant.id, branchId },
          data: {
            name: data.name,
            shortName: data.shortName,
            unitName: variant.unitName,
            conversion: variant.conversion || 1,
            code: variant.code,
            barcode: variant.barcode,
            salePrice: variant.salePrice,
            costPrice: costPriceBase * variant.conversion,
            isDirectSale: variant.isDirectSale,
            updatedBy: userId
          }
        })
      } else {
        // Tạo variant mới
        const variantCode = variant.code || generateCodeIncrease(productCode, index + 1)

        await tx.product.create({
          data: {
            name: data.name || existingProduct.name,
            shortName: data.shortName || existingProduct.shortName,
            productGroupId: data.productGroupId || existingProduct.productGroupId,
            package: data.package || existingProduct.package,
            country: data.country || existingProduct.country,
            manufacturerId: data.manufacturerId || existingProduct.country,
            parentId: existingProduct.id,
            unitName: variant.unitName,
            conversion: variant.conversion,
            code: variantCode,
            barcode: variant.barcode,
            costPrice: costPriceBase,
            salePrice: variant.salePrice,
            isDirectSale: variant.isDirectSale,
            isStockEnabled: false,
            isLotEnabled: false,
            createdBy: userId,
            branchId
          }
        })
      }
    }
  }
}
