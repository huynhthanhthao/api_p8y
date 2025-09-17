import { Prisma } from '@prisma/client'

export const PRODUCT_INCLUDE_FIELDS = {
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true
  },
  include: {
    manufacturer: true,
    medicineInfo: {
      include: {
        route: {
          omit: {
            deletedAt: true,
            deletedBy: true,
            createdBy: true,
            updatedBy: true
          }
        }
      }
    },
    productWeight: true,
    photos: {
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    },
    productLocations: {
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    },
    variants: {
      select: {
        id: true,
        salePrice: true,
        costPrice: true,
        isDirectSale: true,
        barcode: true,
        code: true,
        unitName: true,
        conversion: true
      }
    }
  }
} as const satisfies Partial<Prisma.ProductFindUniqueArgs>
