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
  CreateManufacturerUseCase,
  DeleteManufacturerUseCase,
  DeleteManyManufacturerUseCase,
  GetAllManufacturerUseCase,
  GetOneManufacturerUseCase,
  UpdateManufacturerUseCase
} from '@usecases/manufacturers'
import {
  CreateManufacturerRequestDto,
  GetAllManufacturerRequestDto,
  GetAllManufacturerResponseDto,
  UpdateManufacturerRequestDto
} from '@interface-adapter/dtos/manufacturers'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { Manufacturer } from '@common/types'
import { RolesGuard } from '@common/guards'
import { PermissionEnum } from '@common/enums'
import { Roles } from '@common/utils'

@Controller('manufacturers')
@UseGuards(AccessTokenGuard, RolesGuard)
@UseGuards(AccessTokenGuard)
export class ManufacturerController {
  constructor(
    private readonly _getAllManufacturerUseCase: GetAllManufacturerUseCase,
    private readonly _getOneManufacturerUseCase: GetOneManufacturerUseCase,
    private readonly _createManufacturerUseCase: CreateManufacturerUseCase,
    private readonly _updateManufacturerUseCase: UpdateManufacturerUseCase,
    private readonly _deleteManufacturerUseCase: DeleteManufacturerUseCase,
    private readonly _deleteManyManufacturerUseCase: DeleteManyManufacturerUseCase
  ) {}

  @Post()
  @Roles(PermissionEnum.MANUFACTURER_CREATE)
  create(
    @Body() data: CreateManufacturerRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Manufacturer> {
    return this._createManufacturerUseCase.execute(data, req.userId, req.branchId)
  }

  @Patch(':id')
  @Roles(PermissionEnum.MANUFACTURER_UPDATE)
  update(
    @Param() params: UUIDParamDto,
    @Body() data: UpdateManufacturerRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Manufacturer> {
    return this._updateManufacturerUseCase.execute(params.id, data, req.userId, req.branchId)
  }

  @Delete(':id')
  @Roles(PermissionEnum.MANUFACTURER_DELETE)
  delete(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._deleteManufacturerUseCase.execute(params.id, req.userId, req.branchId)
  }

  @Delete('')
  @Roles(PermissionEnum.MANUFACTURER_DELETE)
  deleteMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyManufacturerUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  @Roles(PermissionEnum.MANUFACTURER_VIEW)
  getOne(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<Manufacturer> {
    return this._getOneManufacturerUseCase.execute(params.id, req.branchId)
  }

  @Get()
  @Roles(PermissionEnum.MANUFACTURER_VIEW)
  getAll(
    @Query() queryParams: GetAllManufacturerRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllManufacturerResponseDto> {
    return this._getAllManufacturerUseCase.execute(queryParams, req.branchId)
  }
}
