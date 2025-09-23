import { Prisma } from '@prisma/client'

export const permissionGroupSelect = Prisma.validator<Prisma.PermissionGroupFindFirstArgs>()({})

export type PermissionGroup = Prisma.PermissionGroupGetPayload<typeof permissionGroupSelect>
