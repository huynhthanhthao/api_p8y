import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { Manufacturer } from '@common/types'

export class GetAllManufacturerRequestDto extends PaginationQueryDto {}

export class GetAllManufacturerResponseDto extends PaginationResponseDto<Manufacturer> {
  constructor(partial: Partial<GetAllManufacturerResponseDto>) {
    super(partial)
  }
}
