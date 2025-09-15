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
import { DeleteManyRequestDto } from '@common/dtos'
import {
  CreateSupplierRequestDto,
  GetAllSupplierRequestDto
} from '@interface-adapter/dtos/suppliers'

@Controller('suppliers')
@UseGuards(AccessTokenGuard)
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
  create(@Body() data: CreateSupplierRequestDto, @Req() req: RequestAccessBranchJWT) {
    return this._createSupplierUseCase.execute(data, req.userId, req.branchId)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: CreateSupplierRequestDto,
    @Req() req: RequestAccessBranchJWT
  ) {
    return this._updateSupplierUseCase.execute(id, data, req.userId, req.branchId)
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: RequestAccessBranchJWT) {
    return this._deleteSupplierUseCase.execute(id, req.userId, req.branchId)
  }

  @Delete('')
  deleteMany(@Body() data: DeleteManyRequestDto, @Req() req: RequestAccessBranchJWT) {
    return this._deleteManySupplierUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: RequestAccessBranchJWT) {
    return this._getOneSupplierUseCase.execute(id, req.branchId)
  }

  @Get()
  getAll(@Query() queryParams: GetAllSupplierRequestDto, @Req() req: RequestAccessBranchJWT) {
    return this._getAllSupplierUseCase.execute(queryParams, req.branchId)
  }
}
