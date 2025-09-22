import { Prisma } from '@prisma/client'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import {
  CreateRoleUseCase,
  DeleteManyRoleUseCase,
  DeleteRoleUseCase,
  GetAllRoleUseCase,
  GetOneRoleUseCase,
  UpdateRoleUseCase
} from '@usecases/roles'
import {
  CreateRoleRequestDto,
  GetAllRoleRequestDto,
  GetAllRoleResponseDto,
  UpdateRoleRequestDto
} from '@interface-adapter/dtos/roles'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { Role } from '@common/types'

@Controller('roles')
@UseGuards(AccessTokenGuard)
export class RoleController {
  constructor(
    private readonly _getAllRoleUseCase: GetAllRoleUseCase,
    private readonly _getOneRoleUseCase: GetOneRoleUseCase,
    private readonly _createRoleUseCase: CreateRoleUseCase,
    private readonly _updateRoleUseCase: UpdateRoleUseCase,
    private readonly _deleteRoleUseCase: DeleteRoleUseCase,
    private readonly _deleteManyRoleUseCase: DeleteManyRoleUseCase
  ) {}

  @Post()
  create(@Body() data: CreateRoleRequestDto, @Req() req: RequestAccessBranchJWT): Promise<Role> {
    return this._createRoleUseCase.execute(data, req.userId, req.storeCode)
  }

  @Patch(':id')
  update(
    @Param() params: UUIDParamDto,
    @Body() data: UpdateRoleRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Role> {
    return this._updateRoleUseCase.execute(params.id, data, req.userId, req.storeCode)
  }

  @Delete(':id')
  delete(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._deleteRoleUseCase.execute(params.id, req.userId, req.storeCode)
  }

  @Delete('')
  deleteMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyRoleUseCase.execute(data, req.userId, req.storeCode)
  }

  @Get(':id')
  getOne(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<Role> {
    return this._getOneRoleUseCase.execute(params.id, req.storeCode)
  }

  @Get()
  getAll(
    @Query() queryParams: GetAllRoleRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllRoleResponseDto> {
    return this._getAllRoleUseCase.execute(queryParams, req.storeCode)
  }
}
