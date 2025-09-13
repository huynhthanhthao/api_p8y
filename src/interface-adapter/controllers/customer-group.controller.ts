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
  CreateCustomerGroupResponseDto,
  GetAllCustomerGroupRequestDto,
  GetAllCustomerGroupResponseDto,
  UpdateCustomerGroupResponseDto
} from '@interface-adapter/dtos/customer-groups'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyQueryDto } from '@common/dtos'
import { CustomerGroup } from '@common/types'
import { Prisma } from '@prisma/client'

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
  ): Promise<CreateCustomerGroupResponseDto> {
    return this._createCustomerGroupUseCase.execute(data, req.userId, req.storeCode)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: CreateCustomerGroupRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<UpdateCustomerGroupResponseDto> {
    return this._updateCustomerGroupUseCase.execute(id, data, req.userId)
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: RequestAccessBranchJWT): Promise<CustomerGroup> {
    return this._deleteCustomerGroupUseCase.execute(id, req.userId, req.storeCode)
  }

  @Delete()
  deleteMany(
    @Query() params: DeleteManyQueryDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyCustomerGroupUseCase.execute(params, req.userId, req.storeCode)
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<CustomerGroup> {
    return this._getOneCustomerGroupUseCase.execute(id)
  }

  @Get()
  getAll(
    @Query() queryParams: GetAllCustomerGroupRequestDto
  ): Promise<GetAllCustomerGroupResponseDto> {
    return this._getAllCustomerGroupUseCase.execute(queryParams)
  }
}
