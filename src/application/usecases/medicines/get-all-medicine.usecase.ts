import { Medicine } from '@common/types'
import { GetAllMedicineRequestDto } from '@interface-adapter/dtos/medicines'
import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class GetAllMedicineUseCase {
  private readonly medicines: Medicine[]

  constructor() {
    const filePath = path.resolve(process.cwd(), 'prisma/seeds/data/medicines.json')
    this.medicines = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  }

  async execute(params: GetAllMedicineRequestDto): Promise<{
    meta: {
      total: number
      lastPage: number
      currentPage: number
      perPage: number
      prev: number | null
      next: number | null
      totalPages: number
    }
    list: Medicine[]
  }> {
    const { page = 1, perPage = 10, keyword } = params

    // 1. Lọc theo keyword
    let data = this.medicines
    if (keyword) {
      const kw = keyword.toLowerCase()
      data = data.filter(
        m =>
          (m.name && m.name.toLowerCase().includes(kw)) ||
          (m.regNumber && m.regNumber.toLowerCase().includes(kw)) ||
          (m.manufacturer && m.manufacturer.toLowerCase().includes(kw))
      )
    }

    // 2. Tính toán meta dựa trên data đã lọc
    const total = data.length
    const lastPage = Math.ceil(total / perPage) || 1
    const currentPage = Math.max(1, Math.min(page, lastPage))
    const start = (currentPage - 1) * perPage
    const end = start + perPage

    // 3. Slice phân trang
    const list = data.slice(start, end)

    return {
      meta: {
        total,
        lastPage,
        currentPage,
        perPage,
        prev: currentPage > 1 ? currentPage - 1 : null,
        next: currentPage < lastPage ? currentPage + 1 : null,
        totalPages: lastPage
      },
      list
    }
  }
}
