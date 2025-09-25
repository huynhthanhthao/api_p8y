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
  CreateSupplierGroupUseCase,
  DeleteSupplierGroupUseCase,
  DeleteManySupplierGroupUseCase,
  GetAllSupplierGroupUseCase,
  GetOneSupplierGroupUseCase,
  UpdateSupplierGroupUseCase
} from '@usecases/supplier-groups'
import {
  CreateSupplierGroupRequestDto,
  GetAllSupplierGroupRequestDto,
  UpdateSupplierGroupRequestDto
} from '@interface-adapter/dtos/supplier-groups'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { RolesGuard } from '@common/guards'
import { PermissionEnum } from '@common/enums'
import { Roles } from '@common/utils'

@Controller('supplier-groups')
@UseGuards(AccessTokenGuard, RolesGuard)
export class SupplierGroupController {
  constructor(
    private readonly _getAllSupplierGroupUseCase: GetAllSupplierGroupUseCase,
    private readonly _getOneSupplierGroupUseCase: GetOneSupplierGroupUseCase,
    private readonly _createSupplierGroupUseCase: CreateSupplierGroupUseCase,
    private readonly _updateSupplierGroupUseCase: UpdateSupplierGroupUseCase,
    private readonly _deleteSupplierGroupUseCase: DeleteSupplierGroupUseCase,
    private readonly _deleteManySupplierGroupUseCase: DeleteManySupplierGroupUseCase
  ) {}

  @Post()
  @Roles(PermissionEnum.SUPPLIER_GROUP_CREATE)
  create(@Body() data: CreateSupplierGroupRequestDto, @Req() req: RequestAccessBranchJWT) {
    return this._createSupplierGroupUseCase.execute(data, req.userId, req.branchId)
  }

  @Patch(':id')
  @Roles(PermissionEnum.SUPPLIER_GROUP_UPDATE)
  update(
    @Param() params: UUIDParamDto,
    @Body() data: UpdateSupplierGroupRequestDto,
    @Req() req: RequestAccessBranchJWT
  ) {
    return this._updateSupplierGroupUseCase.execute(params.id, data, req.userId, req.branchId)
  }

  @Delete(':id')
  @Roles(PermissionEnum.SUPPLIER_GROUP_DELETE)
  delete(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT) {
    return this._deleteSupplierGroupUseCase.execute(params.id, req.userId, req.branchId)
  }

  @Delete('')
  @Roles(PermissionEnum.SUPPLIER_GROUP_DELETE)
  deleteMany(@Body() data: DeleteManyRequestDto, @Req() req: RequestAccessBranchJWT) {
    return this._deleteManySupplierGroupUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  @Roles(PermissionEnum.SUPPLIER_GROUP_VIEW)
  getOne(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT) {
    return this._getOneSupplierGroupUseCase.execute(params.id, req.branchId)
  }

  @Get()
  @Roles(PermissionEnum.SUPPLIER_GROUP_VIEW)
  getAll(@Query() queryParams: GetAllSupplierGroupRequestDto, @Req() req: RequestAccessBranchJWT) {
    return this._getAllSupplierGroupUseCase.execute(queryParams, req.branchId)
  }
}
