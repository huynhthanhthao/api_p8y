import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import {
  generateCodeIncrease,
  generateCodeModel,
  validateUniqueFields,
  validateUniqueUnitNames,
  validateValidEnableLot
} from '@common/utils'
import { CreateProductRequestDto } from '@interface-adapter/dtos/products'
import { validateStockRange } from '@common/utils/products/validate-stock-range'
import { getProductById } from '@common/utils/products/get-product-by-id.util'
import { Product } from '@common/types'

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(data: CreateProductRequestDto, userId: string, branchId: string): Promise<Product> {
    /**
     * Kiểm tra thông tin tồn kho
     * Kiểm tra số lượng kho không được để trống nếu quản lý kho không theo lô
     * Kiểm tra mã sản phẩm, barcode không trùng
     * Kiểm tra đơn vị tính không trùng
     */
    validateStockRange(data.minStock, data.maxStock)
    validateValidEnableLot(data.isLotEnabled, data.isStockEnabled, data.stockQuantity)
    validateUniqueUnitNames(data)

    await validateUniqueFields(this.prismaClient, data, branchId)

    const productCode = data.code || (await generateCodeModel({ model: 'Product', branchId }))

    /**
     * Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
     */
    const result = await this.prismaClient.$transaction(async tx => {
      const newProduct = await tx.product.create({
        data: {
          name: data.name,
          productGroupId: data.productGroupId,
          type: data.type,
          barcode: data.barcode,
          shortName: data.shortName,
          description: data.description,
          isDirectSale: data.isDirectSale,
          salePrice: data.salePrice,
          costPrice: data.costPrice,
          maxStock: data.maxStock,
          minStock: data.minStock,
          package: data.package,
          country: data.country,
          manufacturerId: data.manufacturerId,
          unitName: data.unitName,
          code: productCode,
          createdBy: userId,
          branchId,
          ...(data.isStockEnabled && {
            isStockEnabled: data.isStockEnabled,
            isLotEnabled: data.isLotEnabled,
            stockQuantity: data.stockQuantity
          }),
          ...(data.photoIds && {
            photos: {
              connect: data.photoIds.map(id => ({ id }))
            }
          }),
          ...(data.productLocationIds && {
            productLocations: {
              connect: data.productLocationIds.map(id => ({ id }))
            }
          }),
          ...(data.productWeight && {
            productWeight: {
              create: {
                unit: data.productWeight.unit,
                value: data.productWeight.value
              }
            }
          }),
          ...(data.medicineInfo && {
            medicineInfo: {
              create: {
                dosage: data.medicineInfo.dosage,
                ingredient: data.medicineInfo.ingredient,
                regNumber: data.medicineInfo.regNumber,
                routeId: data.medicineInfo.routeId
              }
            }
          })
        },
        select: {
          id: true,
          code: true
        }
      })

      /**
       * Tạo các biến thể nếu có
       */
      if (data.variants && data.variants.length > 0) {
        const variantPromises = data.variants.map((variant, index) =>
          tx.product.create({
            data: {
              /**
               * data with parent
               */
              branchId,
              createdBy: userId,
              name: data.name,
              shortName: data.shortName,
              productGroupId: data.productGroupId,
              package: data.package,
              country: data.country,
              manufacturerId: data.manufacturerId,
              ...(data.isStockEnabled && {
                isStockEnabled: data.isStockEnabled,
                isLotEnabled: data.isLotEnabled
              }),
              ...(data.photoIds && {
                photos: {
                  connect: data.photoIds.map(id => ({ id }))
                }
              }),
              /**
               * data with variant
               */
              parentId: newProduct.id,
              code: variant.code || generateCodeIncrease(newProduct.code, index + 1),
              unitName: variant.unitName,
              conversion: variant.conversion,
              barcode: variant.barcode,
              salePrice: variant.salePrice,
              isDirectSale: variant.isDirectSale,
              costPrice: data.costPrice * variant.conversion
            }
          })
        )

        await Promise.all(variantPromises)
      }

      return newProduct
    })

    return await getProductById(this.prismaClient, result.id, branchId)
  }
}
