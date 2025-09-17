import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { createSoftDeleteExtension } from 'prisma-extension-soft-delete'
import { paginator, PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination'
import { PAGINATE_DEFAULT_PER_PAGE } from '@common/constants'
import { PaginationArgs } from '@common/interfaces'
import { AnyObject } from '@common/interfaces/any-object.interface'

const softDelete = createSoftDeleteExtension({
  models: {
    Role: true,
    User: true,
    Branch: true,
    Customer: true,
    Supplier: true,
    Product: true,
    ProductGroup: true,
    CustomerGroup: true,
    ProductLocation: true,
    SupplierGroup: true,
    MedicineRoute: true,
    CustomerInvoiceInfo: true,
    Invoice: true,
    InvoiceItem: true,
    DeliveryInfo: true,
    Permission: true,
    PermissionGroup: true,
    ProductWeight: true,
    TransportInfo: true,
    Manufacturer: true,
    MedicineInfo: true,
    StockTransaction: true,
    StockItem: true,
    StockCard: true
  },
  defaultConfig: {
    field: 'deletedAt',
    allowToOneUpdates: true,
    createValue: deleted => {
      if (deleted) return new Date()
      return null
    }
  }
})

// Type for Prisma model delegate with pagination support
type PrismaModelDelegate = {
  findMany: (args: AnyObject) => Promise<any[]>
  count: (args: AnyObject) => Promise<number>
}

// Custom paginate function that works with extended client
export async function customPaginate(
  prismaModel: PrismaModelDelegate,
  queryArgs: AnyObject,
  paginationArgs: PaginationArgs
) {
  const paginateFn: PaginatorTypes.PaginateFunction = paginator({
    perPage: paginationArgs.perPage || PAGINATE_DEFAULT_PER_PAGE
  })

  const result = await paginateFn(prismaModel, queryArgs, paginationArgs)

  const totalPages = Math.ceil(result.meta.total / result.meta.perPage)

  return {
    meta: {
      ...result.meta,
      totalPages
    },
    list: result.data as any
  }
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  public readonly client: PrismaService

  constructor() {
    super()
    this.client = this.$extends(softDelete) as PrismaService
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  // Sửa thành arrow function để khớp với property signature
  findManyWithPagination = async <T extends keyof PrismaClient>(
    model: T,
    queryArgs: AnyObject = {},
    paginationArgs: PaginationArgs = { page: 1, perPage: PAGINATE_DEFAULT_PER_PAGE }
  ) => {
    const prismaModel = this.client[model] as PrismaModelDelegate
    return customPaginate(prismaModel, queryArgs, paginationArgs)
  }
}
