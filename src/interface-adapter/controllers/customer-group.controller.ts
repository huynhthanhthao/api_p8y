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
  CreateCustomerGroupUseCase,
  DeleteCustomerGroupUseCase,
  DeleteManyCustomerGroupUseCase,
  GetAllCustomerGroupUseCase,
  GetOneCustomerGroupUseCase,
  UpdateCustomerGroupUseCase
} from '@usecases/customer-groups'
import {
  CreateCustomerGroupRequestDto,
  GetAllCustomerGroupRequestDto,
  GetAllCustomerGroupResponseDto
} from '@interface-adapter/dtos/customer-groups'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { CustomerGroup } from '@common/types'

@Controller('customer-groups')
@UseGuards(AccessTokenGuard)
export class CustomerGroupController {
  constructor(
    private readonly _getAllCustomerGroupUseCase: GetAllCustomerGroupUseCase,
    private readonly _getOneCustomerGroupUseCase: GetOneCustomerGroupUseCase,
    private readonly _createCustomerGroupUseCase: CreateCustomerGroupUseCase,
    private readonly _updateCustomerGroupUseCase: UpdateCustomerGroupUseCase,
    private readonly _deleteCustomerGroupUseCase: DeleteCustomerGroupUseCase,
    private readonly _deleteManyCustomerGroupUseCase: DeleteManyCustomerGroupUseCase
  ) {}

  @Post()
  create(
    @Body() data: CreateCustomerGroupRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<CustomerGroup> {
    return this._createCustomerGroupUseCase.execute(data, req.userId, req.storeCode)
  }

  @Patch(':id')
  update(
    @Param() params: UUIDParamDto,
    @Body() data: CreateCustomerGroupRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<CustomerGroup> {
    return this._updateCustomerGroupUseCase.execute(params.id, data, req.userId, req.storeCode)
  }

  @Delete(':id')
  delete(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._deleteCustomerGroupUseCase.execute(params.id, req.userId, req.storeCode)
  }

  @Delete('')
  deleteMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyCustomerGroupUseCase.execute(data, req.userId, req.storeCode)
  }

  @Get(':id')
  getOne(
    @Param() params: UUIDParamDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<CustomerGroup> {
    return this._getOneCustomerGroupUseCase.execute(params.id, req.storeCode)
  }

  @Get()
  getAll(
    @Query() queryParams: GetAllCustomerGroupRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllCustomerGroupResponseDto> {
    return this._getAllCustomerGroupUseCase.execute(queryParams, req.storeCode)
  }
}
