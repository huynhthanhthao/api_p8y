import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { GetAllStockCardUseCase } from '@usecases/stock-cards'
import {
  GetAllStockCardRequestDto,
  GetAllStockCardResponseDto
} from '@interface-adapter/dtos/stock-cards'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { RolesGuard } from '@common/guards'
import { PermissionEnum } from '@common/enums'
import { Roles } from '@common/utils'

@Controller('stock-cards')
@UseGuards(AccessTokenGuard, RolesGuard)
export class StockCardController {
  constructor(private readonly _getAllStockCardUseCase: GetAllStockCardUseCase) {}

  @Get()
  @Roles(PermissionEnum.STOCK_CARD_VIEW)
  getAll(
    @Query() queryParams: GetAllStockCardRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllStockCardResponseDto> {
    return this._getAllStockCardUseCase.execute(queryParams, req.branchId)
  }
}
