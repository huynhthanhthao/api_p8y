import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { CustomerGroup } from '@common/types'

export class GetAllCustomerGroupRequestDto extends PaginationQueryDto {}

export class GetAllCustomerGroupResponseDto extends PaginationResponseDto<CustomerGroup> {
  constructor(partial: Partial<GetAllCustomerGroupResponseDto>) {
    super(partial)
  }
}
