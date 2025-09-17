import { PrismaService } from '@infrastructure/prisma'
import { Injectable } from '@nestjs/common'
import { generateCodeIncrease, generateCodeModel, validateUniqueFields } from '@common/utils'
import { CreateProductRequestDto, CreateProductResponseDto } from '@interface-adapter/dtos/products'
import { validateStockRange } from '@common/utils/validate-stock-range'
import { getProductById } from '@common/utils/get-product-by-id.util'

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  private get prismaClient(): PrismaService {
    return this.prismaService.client
  }

  async execute(
    data: CreateProductRequestDto,
    userId: string,
    branchId: string
  ): Promise<CreateProductResponseDto> {
    // Kiểm tra thông tin tồn kho
    validateStockRange(data.minStock, data.maxStock)

    // Kiểm tra mã sản phẩm, barcode không trùng
    await validateUniqueFields(this.prismaClient, data, branchId)

    const productCode = data.code || (await generateCodeModel({ model: 'Product', branchId }))

    // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
    const newProduct = await this.prismaClient.$transaction(async tx => {
      // Tạo sản phẩm chính
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

      // Tạo các biến thể nếu có
      if (data.variants && data.variants.length > 0) {
        const variantPromises = data.variants.map((variant, index) =>
          tx.product.create({
            data: {
              name: data.name,
              shortName: data.shortName,
              productGroupId: data.productGroupId,
              parentId: newProduct.id,
              unitName: variant.unitName,
              conversion: variant.conversion || 1,
              code: variant.code || generateCodeIncrease(newProduct.code, index + 1),
              barcode: variant.barcode,
              costPrice: data.costPrice * variant.conversion,
              salePrice: variant.salePrice,
              isDirectSale: variant.isDirectSale,
              isStockEnabled: false,
              isLotEnabled: false,
              package: data.package,
              country: data.country,
              manufacturerId: data.manufacturerId,
              createdBy: userId,
              branchId
            }
          })
        )

        await Promise.all(variantPromises)
      }

      return newProduct
    })

    return await getProductById(this.prismaClient, newProduct.id, branchId)
  }
}
