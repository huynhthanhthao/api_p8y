import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { Province } from '@common/types/province.type'

export class GetAllProvinceRequestDto extends PaginationQueryDto {}

export class GetAllProvinceResponseDto extends PaginationResponseDto<Province> {
  constructor(partial: Partial<GetAllProvinceResponseDto>) {
    super(partial)
  }
}
