import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { Role } from '@common/types'

export class GetAllRoleRequestDto extends PaginationQueryDto {}

export class GetAllRoleResponseDto extends PaginationResponseDto<Role> {
  constructor(partial: Partial<GetAllRoleResponseDto>) {
    super(partial)
  }
}
