import { Prisma } from '@prisma/client'

export const select = Prisma.validator<Prisma.PaymentMethodFindFirstArgs>()({})

export type PaymentMethod = Prisma.PaymentMethodGetPayload<typeof select>
