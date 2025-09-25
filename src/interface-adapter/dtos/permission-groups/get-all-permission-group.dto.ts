import { PaginationQueryDto } from '@common/dtos/pagination-query.dto'
import { PaginationResponseDto } from '@common/dtos/pagination-response.dto'
import { PermissionGroup } from '@common/types'

export class GetAllPermissionGroupRequestDto extends PaginationQueryDto {}

export class GetAllPermissionGroupResponseDto extends PaginationResponseDto<PermissionGroup> {
  constructor(partial: Partial<GetAllPermissionGroupResponseDto>) {
    super(partial)
  }
}
