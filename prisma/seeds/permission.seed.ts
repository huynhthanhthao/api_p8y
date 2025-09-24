import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  try {
    // Load dữ liệu JSON
    const filePath = path.resolve(__dirname, 'data/permissions.json')
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    // ====== 1. Upsert PermissionGroup trước ======
    const jsonGroups: { code: string; name: string }[] = jsonData.map((group: any) => ({
      code: group.code,
      name: group.name
    }))

    for (const group of jsonGroups) {
      await prisma.permissionGroup.upsert({
        where: { code: group.code },
        update: { name: group.name },
        create: { code: group.code, name: group.name }
      })
    }

    // ====== 2. Upsert Permission ======
    const dbPermissions = await prisma.permission.findMany()
    const jsonPermissions: { code: string; name: string; groupCode: string }[] = []
    const jsonPermissionCodes = new Set<string>()

    for (const group of jsonData) {
      for (const perm of group.permissions) {
        jsonPermissions.push({
          code: perm.code,
          name: perm.name,
          groupCode: group.code
        })
        jsonPermissionCodes.add(perm.code)
      }
    }

    for (const perm of jsonPermissions) {
      await prisma.permission.upsert({
        where: { code: perm.code },
        update: {
          name: perm.name,
          groupCode: perm.groupCode
        },
        create: {
          code: perm.code,
          name: perm.name,
          groupCode: perm.groupCode
        }
      })
    }

    // ====== 3. Xoá Permission dư trong DB (không có trong JSON) ======
    for (const dbPerm of dbPermissions) {
      if (!jsonPermissionCodes.has(dbPerm.code)) {
        await prisma.permission.delete({
          where: { code: dbPerm.code }
        })
        console.log(`🗑️ Đã xóa permission dư: ${dbPerm.code}`)
      }
    }

    console.log('✅ Đồng bộ Permission & PermissionGroup thành công!')
  } catch (error) {
    console.error('❌ Lỗi khi seed permission:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
