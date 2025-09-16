import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { MedicineRoute } from '@common/types'

export class GetAllMedicineRouteRequestDto extends PaginationQueryDto {}

export class GetAllMedicineRouteResponseDto extends PaginationResponseDto<MedicineRoute> {
  constructor(partial: Partial<GetAllMedicineRouteResponseDto>) {
    super(partial)
  }
}
