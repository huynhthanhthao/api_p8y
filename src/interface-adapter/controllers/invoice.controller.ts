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
  CreateInvoiceUseCase,
  CancelManyInvoiceUseCase,
  CancelInvoiceUseCase,
  GetAllInvoiceUseCase,
  GetOneInvoiceUseCase
} from '@usecases/invoices'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { Invoice } from '@common/types'
import {
  CreateInvoiceRequestDto,
  GetAllInvoiceRequestDto,
  GetAllInvoiceResponseDto
} from '@interface-adapter/dtos/invoinces'
import { RolesGuard } from '@common/guards'
import { Roles } from '@common/utils'
import { PermissionEnum } from '@common/enums'

@Controller('invoices')
@UseGuards(AccessTokenGuard, RolesGuard)
export class InvoiceController {
  constructor(
    private readonly _getAllInvoiceUseCase: GetAllInvoiceUseCase,
    private readonly _getOneInvoiceUseCase: GetOneInvoiceUseCase,
    private readonly _createInvoiceUseCase: CreateInvoiceUseCase,
    private readonly _CancelInvoiceUseCase: CancelInvoiceUseCase,
    private readonly _cancelManyInvoiceUseCase: CancelManyInvoiceUseCase
  ) {}

  @Post('/cancel')
  @Roles(PermissionEnum.INVOICE_CANCEL)
  cancelMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._cancelManyInvoiceUseCase.execute(data, req.userId, req.branchId)
  }

  @Post(':id/cancel')
  @Roles(PermissionEnum.INVOICE_CANCEL)
  cancel(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._CancelInvoiceUseCase.execute(params.id, req.userId, req.branchId)
  }

  @Post()
  @Roles(PermissionEnum.INVOICE_CREATE)
  create(
    @Body() data: CreateInvoiceRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Invoice> {
    return this._createInvoiceUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  @Roles(PermissionEnum.INVOICE_VIEW)
  getOne(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<Invoice> {
    return this._getOneInvoiceUseCase.execute(params.id, req.branchId)
  }

  @Get()
  @Roles(PermissionEnum.INVOICE_VIEW)
  getAll(
    @Query() queryParams: GetAllInvoiceRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllInvoiceResponseDto> {
    return this._getAllInvoiceUseCase.execute(queryParams, req.branchId)
  }
}
