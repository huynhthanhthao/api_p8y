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
  CreateProductLotUseCase,
  DeleteManyProductLotUseCase,
  DeleteProductLotUseCase,
  GetAllProductLotUseCase,
  GetOneProductLotUseCase,
  UpdateProductLotUseCase
} from '@usecases/product-lots'
import {
  CreateProductLotRequestDto,
  GetAllProductLotRequestDto,
  GetAllProductLotResponseDto,
  UpdateProductLotRequestDto
} from '@interface-adapter/dtos/product-lots'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { ProductLot } from '@common/types'

@Controller('product-lots')
@UseGuards(AccessTokenGuard)
export class ProductLotController {
  constructor(
    private readonly _getAllProductLotUseCase: GetAllProductLotUseCase,
    private readonly _getOneProductLotUseCase: GetOneProductLotUseCase,
    private readonly _createProductLotUseCase: CreateProductLotUseCase,
    private readonly _updateProductLotUseCase: UpdateProductLotUseCase,
    private readonly _deleteProductLotUseCase: DeleteProductLotUseCase,
    private readonly _deleteManyProductLotUseCase: DeleteManyProductLotUseCase
  ) {}

  @Post()
  create(
    @Body() data: CreateProductLotRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<ProductLot> {
    return this._createProductLotUseCase.execute(data, req.userId, req.branchId)
  }

  @Patch(':id')
  update(
    @Param() params: UUIDParamDto,
    @Body() data: UpdateProductLotRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<ProductLot> {
    return this._updateProductLotUseCase.execute(params.id, data, req.userId, req.branchId)
  }

  @Delete(':id')
  delete(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._deleteProductLotUseCase.execute(params.id, req.userId, req.branchId)
  }

  @Delete('')
  deleteMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyProductLotUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  getOne(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<ProductLot> {
    return this._getOneProductLotUseCase.execute(params.id, req.branchId)
  }

  @Get()
  getAll(
    @Query() queryParams: GetAllProductLotRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllProductLotResponseDto> {
    return this._getAllProductLotUseCase.execute(queryParams, req.branchId)
  }
}
