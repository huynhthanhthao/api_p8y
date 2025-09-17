import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/prisma'
import { Invoice } from '@common/types'
import { HttpException } from '@common/exceptions'
import { INVOICE_ERROR } from '@common/errors'

@Injectable()
export class GetOneInvoiceUseCase {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(id: string, branchId: string): Promise<Invoice> {
    const invoice = await this.prismaService.invoice.findUnique({
      where: {
        id,
        branchId,
        deletedAt: null
      },
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      },
      include: {
        invoiceItems: {
          omit: {
            deletedAt: true,
            deletedBy: true,
            createdBy: true,
            updatedBy: true
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                code: true,
                deletedAt: true,
                photos: {
                  select: {
                    id: true,
                    filename: true,
                    path: true
                  }
                },
                barcode: true
              }
            }
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            code: true,
            avatar: {
              select: {
                id: true,
                filename: true,
                path: true
              }
            },
            phone: true,
            email: true
          }
        }
      }
    })

    if (!invoice) {
      throw new HttpException(HttpStatus.NOT_FOUND, INVOICE_ERROR.INVOICE_NOT_FOUND)
    }

    return invoice
  }
}
