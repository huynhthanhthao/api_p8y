import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { GetAllStockCardUseCase } from '@usecases/stock-cards'
import {
  GetAllStockCardRequestDto,
  GetAllStockCardResponseDto
} from '@interface-adapter/dtos/stock-cards'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'

@Controller('stock-cards')
@UseGuards(AccessTokenGuard)
export class StockCardController {
  constructor(private readonly _getAllStockCardUseCase: GetAllStockCardUseCase) {}

  @Get()
  getAll(
    @Query() queryParams: GetAllStockCardRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllStockCardResponseDto> {
    return this._getAllStockCardUseCase.execute(queryParams, req.branchId)
  }
}
