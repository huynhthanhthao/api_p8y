import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { ProductLocation } from '@common/types'

export class GetAllProductLocationRequestDto extends PaginationQueryDto {}

export class GetAllProductLocationResponseDto extends PaginationResponseDto<ProductLocation> {
  constructor(partial: Partial<GetAllProductLocationResponseDto>) {
    super(partial)
  }
}
