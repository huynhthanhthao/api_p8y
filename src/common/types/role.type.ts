import { ROLE_SELECT_FIELDS } from '@common/constants'
import { Prisma } from '@prisma/client'

export const roleSelect = Prisma.validator<Prisma.RoleFindFirstArgs>()({
  ...ROLE_SELECT_FIELDS
})

export type Role = Prisma.RoleGetPayload<typeof roleSelect>
