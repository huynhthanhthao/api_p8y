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
  GetAllSupplierGroupRequestDto
} from '@interface-adapter/dtos/supplier-groups'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto } from '@common/dtos'

@Controller('supplier-groups')
@UseGuards(AccessTokenGuard)
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
  create(@Body() data: CreateSupplierGroupRequestDto, @Req() req: RequestAccessBranchJWT) {
    return this._createSupplierGroupUseCase.execute(data, req.userId, req.branchId)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: CreateSupplierGroupRequestDto,
    @Req() req: RequestAccessBranchJWT
  ) {
    return this._updateSupplierGroupUseCase.execute(id, data, req.userId, req.branchId)
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: RequestAccessBranchJWT) {
    return this._deleteSupplierGroupUseCase.execute(id, req.userId, req.branchId)
  }

  @Delete('')
  deleteMany(@Body() data: DeleteManyRequestDto, @Req() req: RequestAccessBranchJWT) {
    return this._deleteManySupplierGroupUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: RequestAccessBranchJWT) {
    return this._getOneSupplierGroupUseCase.execute(id, req.branchId)
  }

  @Get()
  getAll(@Query() queryParams: GetAllSupplierGroupRequestDto, @Req() req: RequestAccessBranchJWT) {
    return this._getAllSupplierGroupUseCase.execute(queryParams, req.branchId)
  }
}
