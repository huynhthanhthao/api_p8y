import { INVOICE_INCLUDE_FIELDS } from '@common/constants/'
import { Prisma } from '@prisma/client'

export const invoiceSelect = Prisma.validator<Prisma.InvoiceFindFirstArgs>()({
  ...INVOICE_INCLUDE_FIELDS
})

export type Invoice = Prisma.InvoiceGetPayload<typeof invoiceSelect>
