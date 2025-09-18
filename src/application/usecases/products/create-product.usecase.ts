import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import { generateCodeIncrease, generateCodeModel, validateUniqueFields } from '@common/utils'
import { CreateProductRequestDto } from '@interface-adapter/dtos/products'
import { validateStockRange } from '@common/utils/validate-stock-range'
import { getProductById } from '@common/utils/get-product-by-id.util'
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
     */
    validateStockRange(data.minStock, data.maxStock)

    /**
     * Kiểm tra mã sản phẩm, barcode không trùng
     */

    await validateUniqueFields(this.prismaClient, data, branchId)

    const productCode = data.code || (await generateCodeModel({ model: 'Product', branchId }))

    /**
     * Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
     */
    const newProduct = await this.prismaClient.$transaction(async tx => {
      return await tx.product.create({
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
          isStockEnabled: data.isStockEnabled,
          isLotEnabled: data.isLotEnabled,
          maxStock: data.maxStock,
          minStock: data.minStock,
          package: data.package,
          country: data.country,
          manufacturerId: data.manufacturerId,
          unitName: data.unitName,
          code: productCode,
          createdBy: userId,
          branchId,
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
    })

    return await getProductById(this.prismaClient, newProduct.id, branchId)
  }
}
