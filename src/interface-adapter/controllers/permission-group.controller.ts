import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import {
  GetAllPermissionGroupRequestDto,
  GetAllPermissionGroupResponseDto
} from '@interface-adapter/dtos/permission-groups'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { GetAllPermissionGroupUseCase } from '@usecases/permissions'

@Controller('permission-groups')
@UseGuards(AccessTokenGuard)
export class PermissionGroupController {
  constructor(private readonly _getAllPermissionGroupUseCase: GetAllPermissionGroupUseCase) {}

  @Get()
  getAll(
    @Query() queryParams: GetAllPermissionGroupRequestDto
  ): Promise<GetAllPermissionGroupResponseDto> {
    return this._getAllPermissionGroupUseCase.execute(queryParams)
  }
}
