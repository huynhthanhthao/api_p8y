import { Prisma } from '@prisma/client'
import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
import {
  CreateStockTransactionUseCase,
  CancelManyStockTransactionUseCase,
  CancelStockTransactionUseCase,
  GetAllStockTransactionUseCase,
  GetOneStockTransactionUseCase,
  UpdateStockTransactionUseCase
} from '@usecases/stock-transactions'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { StockTransaction } from '@common/types'
import {
  CreateStockTransactionRequestDto,
  GetAllStockTransactionRequestDto,
  GetAllStockTransactionResponseDto
} from '@interface-adapter/dtos/stock-transactions'
import { PermissionEnum } from '@common/enums'
import { Roles } from '@common/utils'
import { RolesGuard } from '@common/guards'

@Controller('stock-transactions')
@UseGuards(AccessTokenGuard, RolesGuard)
export class StockTransactionController {
  constructor(
    private readonly _getAllStockTransactionUseCase: GetAllStockTransactionUseCase,
    private readonly _getOneStockTransactionUseCase: GetOneStockTransactionUseCase,
    private readonly _createStockTransactionUseCase: CreateStockTransactionUseCase,
    private readonly _CancelStockTransactionUseCase: CancelStockTransactionUseCase,
    private readonly _cancelManyStockTransactionUseCase: CancelManyStockTransactionUseCase,
    private readonly _updateStockTransactionUseCase: UpdateStockTransactionUseCase
  ) {}

  @Patch(':id')
  @Roles(PermissionEnum.STOCK_TRANSACTION_UPDATE)
  update(
    @Param() params: UUIDParamDto,
    @Req() req: RequestAccessBranchJWT,
    @Body() data: CreateStockTransactionRequestDto
  ): Promise<StockTransaction> {
    return this._updateStockTransactionUseCase.execute(params.id, data, req.userId, req.branchId)
  }

  @Post('cancel')
  @Roles(PermissionEnum.STOCK_TRANSACTION_CANCEL)
  cancelMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._cancelManyStockTransactionUseCase.execute(data, req.userId, req.branchId)
  }

  @Post(':id/cancel')
  @Roles(PermissionEnum.STOCK_TRANSACTION_CANCEL)
  cancel(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._CancelStockTransactionUseCase.execute(params.id, req.userId, req.branchId)
  }

  @Post()
  @Roles(PermissionEnum.STOCK_TRANSACTION_CREATE)
  create(
    @Body() data: CreateStockTransactionRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<StockTransaction> {
    return this._createStockTransactionUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  @Roles(PermissionEnum.STOCK_TRANSACTION_VIEW)
  getOne(
    @Param() params: UUIDParamDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<StockTransaction> {
    return this._getOneStockTransactionUseCase.execute(params.id, req.branchId)
  }

  @Get()
  @Roles(PermissionEnum.STOCK_TRANSACTION_VIEW)
  getAll(
    @Query() queryParams: GetAllStockTransactionRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllStockTransactionResponseDto> {
    return this._getAllStockTransactionUseCase.execute(queryParams, req.branchId)
  }
}
