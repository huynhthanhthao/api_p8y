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
  GetAllCustomerRequestDto
} from '@interface-adapter/dtos/customers'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto } from '@common/dtos'

@Controller('customers')
@UseGuards(AccessTokenGuard)
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
  create(@Body() data: CreateCustomerRequestDto, @Req() req: RequestAccessBranchJWT) {
    return this._createCustomerUseCase.execute(data, req.userId, req.storeCode)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: CreateCustomerRequestDto,
    @Req() req: RequestAccessBranchJWT
  ) {
    return this._updateCustomerUseCase.execute(id, data, req.userId, req.storeCode)
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: RequestAccessBranchJWT) {
    return this._deleteCustomerUseCase.execute(id, req.userId, req.storeCode)
  }

  @Delete('')
  deleteMany(@Body() data: DeleteManyRequestDto, @Req() req: RequestAccessBranchJWT) {
    return this._deleteManyCustomerUseCase.execute(data, req.userId, req.storeCode)
  }

  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: RequestAccessBranchJWT) {
    return this._getOneCustomerUseCase.execute(id, req.storeCode)
  }

  @Get()
  getAll(@Query() queryParams: GetAllCustomerRequestDto, @Req() req: RequestAccessBranchJWT) {
    return this._getAllCustomerUseCase.execute(queryParams, req.storeCode)
  }
}
