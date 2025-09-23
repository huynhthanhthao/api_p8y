// prisma/seeds/permission.seed.ts
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  try {
    // Load dữ liệu JSON
    const filePath = path.resolve(__dirname, 'data/permissions.json')
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    // Lấy tất cả permissions hiện có trong DB
    const dbPermissions = await prisma.permission.findMany()

    const jsonPermissions: { code: string; name: string; groupCode: string }[] = []
    const jsonPermissionCodes = new Set<string>()

    // Duyệt file JSON => gom ra mảng permissions
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

    // 1. Upsert tất cả permission trong JSON
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

    // 2. Xóa những permission không còn trong JSON
    for (const dbPerm of dbPermissions) {
      if (!jsonPermissionCodes.has(dbPerm.code)) {
        await prisma.permission.delete({
          where: { code: dbPerm.code }
        })
        console.log(`🗑️ Đã xóa permission dư: ${dbPerm.code}`)
      }
    }

    console.log('✅ Đồng bộ permission thành công!')
  } catch (error) {
    console.error('❌ Lỗi khi seed permission:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
