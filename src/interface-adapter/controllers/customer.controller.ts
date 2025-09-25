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
  CreateCustomerUseCase,
  DeleteCustomerUseCase,
  DeleteManyCustomerUseCase,
  GetAllCustomerUseCase,
  GetOneCustomerUseCase,
  UpdateCustomerUseCase
} from '@usecases/customers'
import {
  CreateCustomerRequestDto,
  GetAllCustomerRequestDto,
  GetAllCustomerResponseDto,
  UpdateCustomerRequestDto
} from '@interface-adapter/dtos/customers'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { Customer } from '@common/types'
import { RolesGuard } from '@common/guards'
import { Roles } from '@common/utils'
import { PermissionEnum } from '@common/enums'

@Controller('customers')
@UseGuards(AccessTokenGuard, RolesGuard)
export class CustomerController {
  constructor(
    private readonly _getAllCustomerUseCase: GetAllCustomerUseCase,
    private readonly _getOneCustomerUseCase: GetOneCustomerUseCase,
    private readonly _createCustomerUseCase: CreateCustomerUseCase,
    private readonly _updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly _deleteCustomerUseCase: DeleteCustomerUseCase,
    private readonly _deleteManyCustomerUseCase: DeleteManyCustomerUseCase
  ) {}

  @Post()
  @Roles(PermissionEnum.CUSTOMER_CREATE)
  create(
    @Body() data: CreateCustomerRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Customer> {
    return this._createCustomerUseCase.execute(data, req.userId, req.storeCode)
  }

  @Patch(':id')
  @Roles(PermissionEnum.CUSTOMER_UPDATE)
  update(
    @Param() params: UUIDParamDto,
    @Body() data: UpdateCustomerRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Customer> {
    return this._updateCustomerUseCase.execute(params.id, data, req.userId, req.storeCode)
  }

  @Delete(':id')
  @Roles(PermissionEnum.CUSTOMER_DELETE)
  delete(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._deleteCustomerUseCase.execute(params.id, req.userId, req.storeCode)
  }

  @Delete('')
  @Roles(PermissionEnum.CUSTOMER_DELETE)
  deleteMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyCustomerUseCase.execute(data, req.userId, req.storeCode)
  }

  @Get(':id')
  @Roles(PermissionEnum.CUSTOMER_VIEW)
  getOne(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<Customer> {
    return this._getOneCustomerUseCase.execute(params.id, req.storeCode)
  }

  @Get()
  @Roles(PermissionEnum.CUSTOMER_VIEW)
  getAll(
    @Query() queryParams: GetAllCustomerRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllCustomerResponseDto> {
    return this._getAllCustomerUseCase.execute(queryParams, req.storeCode)
  }
}
