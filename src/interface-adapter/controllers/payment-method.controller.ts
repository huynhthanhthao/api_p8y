import { Body, Controller, Get, Param, Put, Query, Req, UseGuards } from '@nestjs/common'
import {
  GetAllPaymentMethodUseCase,
  GetOnePaymentMethodUseCase,
  UpsertPaymentMethodUseCase
} from '@usecases/payment-methods'
import {
  GetAllPaymentMethodRequestDto,
  GetAllPaymentMethodResponseDto,
  UpsertPaymentMethodRequestDto
} from '@interface-adapter/dtos/payment-methods'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { PaymentMethod } from '@common/types'
import { PermissionEnum } from '@common/enums'
import { Roles } from '@common/utils'
import { RolesGuard } from '@common/guards'

@Controller('payment-methods')
@UseGuards(AccessTokenGuard, RolesGuard)
export class PaymentMethodController {
  constructor(
    private readonly _getAllPaymentMethodUseCase: GetAllPaymentMethodUseCase,
    private readonly _getOnePaymentMethodUseCase: GetOnePaymentMethodUseCase,
    private readonly _upsertPaymentMethodUseCase: UpsertPaymentMethodUseCase
  ) {}

  @Put('')
  @Roles(PermissionEnum.PAYMENT_METHOD_UPSERT)
  deleteMany(
    @Body() data: UpsertPaymentMethodRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<PaymentMethod> {
    return this._upsertPaymentMethodUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: RequestAccessBranchJWT): Promise<PaymentMethod> {
    return this._getOnePaymentMethodUseCase.execute(id, req.branchId)
  }

  @Get()
  getAll(
    @Query() queryParams: GetAllPaymentMethodRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllPaymentMethodResponseDto> {
    return this._getAllPaymentMethodUseCase.execute(queryParams, req.branchId)
  }
}
