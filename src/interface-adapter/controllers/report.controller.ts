import { ReportQueryDto } from '@common/dtos'
import { PermissionEnum } from '@common/enums'
import { RolesGuard } from '@common/guards'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { Roles } from '@common/utils'
import {
  ReportBestProductResponseDto,
  ReportRevenueResponseDto,
  ReportTopCustomerByOrderResponseDto
} from '@interface-adapter/dtos/reports'
import { Controller, UseGuards, Req, Query, Get } from '@nestjs/common'
import {
  ReportTopCustomerByOrderUseCase,
  ReportBestProductSalesUseCase,
  ReportRevenueUseCase
} from '@usecases/reports'

@Controller('reports')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ReportController {
  constructor(
    private readonly _reportRevenueUseCase: ReportRevenueUseCase,
    private readonly _reportBestProductSalesUseCase: ReportBestProductSalesUseCase,
    private readonly _reportTopCustomerByOrderUseCase: ReportTopCustomerByOrderUseCase
  ) {}

  @Get('revenue')
  @Roles(PermissionEnum.REPORT_VIEW)
  reportRevenue(
    @Query() params: ReportQueryDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<ReportRevenueResponseDto> {
    return this._reportRevenueUseCase.execute(params, req.branchId)
  }

  @Get('product/top-sales')
  @Roles(PermissionEnum.REPORT_VIEW)
  reportBestProductSales(
    @Query() params: ReportQueryDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<ReportBestProductResponseDto> {
    return this._reportBestProductSalesUseCase.execute(params, req.branchId)
  }

  @Get('customer/top-sales')
  @Roles(PermissionEnum.REPORT_VIEW)
  reportTopCustomerByOrder(
    @Query() params: ReportQueryDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<ReportTopCustomerByOrderResponseDto> {
    return this._reportTopCustomerByOrderUseCase.execute(params, req.branchId)
  }
}
