// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import axios from 'axios'

const prisma = new PrismaClient()

async function main() {
  try {
    // Gọi API để lấy dữ liệu
    const response = await axios.get('https://provinces.open-api.vn/api/v2/?depth=2')
    const provincesData = response.data

    for (const provinceData of provincesData) {
      // Tạo tỉnh/thành phố
      const province = await prisma.province.upsert({
        where: { code: provinceData.code },
        update: {
          name: provinceData.name,
          divisionType: provinceData.division_type,
          codeName: provinceData.codename,
          phoneCode: provinceData.phone_code.toString(),
        },
        create: {
          code: provinceData.code,
          name: provinceData.name,
          divisionType: provinceData.division_type,
          codeName: provinceData.codename,
          phoneCode: provinceData.phone_code.toString(),
        },
      })

      // Nếu có dữ liệu phường/xã, thêm vào
      if (provinceData.wards && provinceData.wards.length > 0) {
        let wardCount = 0
        for (const wardData of provinceData.wards) {
          await prisma.ward.upsert({
            where: { code: wardData.code },
            update: {
              name: wardData.name,
              codeName: wardData.codename,
              divisionType: wardData.division_type,
              shortCodeName: wardData.short_codename,
              provinceCode: province.code, 
            },
            create: {
              code: wardData.code,
              name: wardData.name,
              codeName: wardData.codename,
              divisionType: wardData.division_type,
              shortCodeName: wardData.short_codename,
              provinceCode: province.code, 
            },
          })
          wardCount++
        }
        console.log(`➕ Đã thêm ${wardCount} phường/xã cho ${province.name}`)
      }
    }

    console.log('🎉 Seed dữ liệu thành công!')
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })