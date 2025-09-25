import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { SupplierGroup } from '@common/types'

export class GetAllSupplierGroupRequestDto extends PaginationQueryDto {}

export class GetAllSupplierGroupResponseDto extends PaginationResponseDto<SupplierGroup> {
  constructor(partial: Partial<GetAllSupplierGroupResponseDto>) {
    super(partial)
  }
}
