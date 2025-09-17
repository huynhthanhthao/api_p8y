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
  DeleteManyInvoiceUseCase,
  DeleteInvoiceUseCase,
  GetAllInvoiceUseCase,
  GetOneInvoiceUseCase
} from '@usecases/invoices'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { Invoice } from '@common/types'
import {
  CreateInvoiceRequestDto,
  CreateInvoiceResponseDto,
  GetAllInvoiceRequestDto,
  GetAllInvoiceResponseDto
} from '@interface-adapter/dtos/invoinces'

@Controller('invoices')
@UseGuards(AccessTokenGuard)
export class InvoiceController {
  constructor(
    private readonly _getAllInvoiceUseCase: GetAllInvoiceUseCase,
    private readonly _getOneInvoiceUseCase: GetOneInvoiceUseCase,
    private readonly _createInvoiceUseCase: CreateInvoiceUseCase,
    private readonly _deleteInvoiceUseCase: DeleteInvoiceUseCase,
    private readonly _deleteManyInvoiceUseCase: DeleteManyInvoiceUseCase
  ) {}

  @Post()
  create(
    @Body() data: CreateInvoiceRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<CreateInvoiceResponseDto> {
    return this._createInvoiceUseCase.execute(data, req.userId, req.branchId)
  }

  @Delete(':id')
  delete(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._deleteInvoiceUseCase.execute(params.id, req.userId, req.branchId)
  }

  @Delete('')
  deleteMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyInvoiceUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  getOne(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<Invoice> {
    return this._getOneInvoiceUseCase.execute(params.id, req.branchId)
  }

  @Get()
  getAll(
    @Query() queryParams: GetAllInvoiceRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllInvoiceResponseDto> {
    return this._getAllInvoiceUseCase.execute(queryParams, req.branchId)
  }
}
