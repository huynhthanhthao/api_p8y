import { Prisma } from '@prisma/client'

const customerSelect = Prisma.validator<Prisma.CustomerSelect>()({
  id: true,
  name: true,
  code: true,
  storeCode: true,
  email: true,
  phone: true,
  birthday: true,
  gender: true,
  avatarUrl: true,
  note: true,
  customerGroupId: true,
  customerGroup: {
    omit: {
      deletedAt: true,
      deletedBy: true,
      createdBy: true,
      updatedBy: true
    }
  },
  customerInvoiceInfo: true
})

export type Customer = Prisma.CustomerGetPayload<{
  select: typeof customerSelect
}>
