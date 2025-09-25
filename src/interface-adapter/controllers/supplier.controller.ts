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
  CreateSupplierUseCase,
  DeleteSupplierUseCase,
  DeleteManySupplierUseCase,
  GetAllSupplierUseCase,
  GetOneSupplierUseCase,
  UpdateSupplierUseCase
} from '@usecases/suppliers'

import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import {
  CreateSupplierRequestDto,
  GetAllSupplierRequestDto,
  UpdateSupplierRequestDto
} from '@interface-adapter/dtos/suppliers'
import { PermissionEnum } from '@common/enums'
import { Roles } from '@common/utils'
import { RolesGuard } from '@common/guards'

@Controller('suppliers')
@UseGuards(AccessTokenGuard, RolesGuard)
export class SupplierController {
  constructor(
    private readonly _getAllSupplierUseCase: GetAllSupplierUseCase,
    private readonly _getOneSupplierUseCase: GetOneSupplierUseCase,
    private readonly _createSupplierUseCase: CreateSupplierUseCase,
    private readonly _updateSupplierUseCase: UpdateSupplierUseCase,
    private readonly _deleteSupplierUseCase: DeleteSupplierUseCase,
    private readonly _deleteManySupplierUseCase: DeleteManySupplierUseCase
  ) {}

  @Post()
  @Roles(PermissionEnum.SUPPLIER_CREATE)
  create(@Body() data: CreateSupplierRequestDto, @Req() req: RequestAccessBranchJWT) {
    return this._createSupplierUseCase.execute(data, req.userId, req.branchId)
  }

  @Patch(':id')
  @Roles(PermissionEnum.SUPPLIER_UPDATE)
  update(
    @Param() params: UUIDParamDto,
    @Body() data: UpdateSupplierRequestDto,
    @Req() req: RequestAccessBranchJWT
  ) {
    return this._updateSupplierUseCase.execute(params.id, data, req.userId, req.branchId)
  }

  @Delete(':id')
  @Roles(PermissionEnum.SUPPLIER_DELETE)
  delete(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT) {
    return this._deleteSupplierUseCase.execute(params.id, req.userId, req.branchId)
  }

  @Delete('')
  @Roles(PermissionEnum.SUPPLIER_DELETE)
  deleteMany(@Body() data: DeleteManyRequestDto, @Req() req: RequestAccessBranchJWT) {
    return this._deleteManySupplierUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  @Roles(PermissionEnum.SUPPLIER_VIEW)
  getOne(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT) {
    return this._getOneSupplierUseCase.execute(params.id, req.branchId)
  }

  @Get()
  @Roles(PermissionEnum.SUPPLIER_VIEW)
  getAll(@Query() queryParams: GetAllSupplierRequestDto, @Req() req: RequestAccessBranchJWT) {
    return this._getAllSupplierUseCase.execute(queryParams, req.branchId)
  }
}
