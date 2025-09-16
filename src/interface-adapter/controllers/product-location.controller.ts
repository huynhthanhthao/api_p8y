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
  CreateProductLocationUseCase,
  DeleteProductLocationUseCase,
  DeleteManyProductLocationUseCase,
  GetAllProductLocationUseCase,
  GetOneProductLocationUseCase,
  UpdateProductLocationUseCase
} from '@usecases/product-locations'
import {
  CreateProductLocationRequestDto,
  CreateProductLocationResponseDto,
  GetAllProductLocationRequestDto,
  GetAllProductLocationResponseDto,
  UpdateProductLocationResponseDto
} from '@interface-adapter/dtos/product-locations'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto } from '@common/dtos'
import { ProductLocation } from '@common/types'

@Controller('product-locations')
@UseGuards(AccessTokenGuard)
export class ProductLocationController {
  constructor(
    private readonly _getAllProductLocationUseCase: GetAllProductLocationUseCase,
    private readonly _getOneProductLocationUseCase: GetOneProductLocationUseCase,
    private readonly _createProductLocationUseCase: CreateProductLocationUseCase,
    private readonly _updateProductLocationUseCase: UpdateProductLocationUseCase,
    private readonly _deleteProductLocationUseCase: DeleteProductLocationUseCase,
    private readonly _deleteManyProductLocationUseCase: DeleteManyProductLocationUseCase
  ) {}

  @Post()
  create(
    @Body() data: CreateProductLocationRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<CreateProductLocationResponseDto> {
    return this._createProductLocationUseCase.execute(data, req.userId, req.branchId)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: CreateProductLocationRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<UpdateProductLocationResponseDto> {
    return this._updateProductLocationUseCase.execute(id, data, req.userId, req.branchId)
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._deleteProductLocationUseCase.execute(id, req.userId, req.branchId)
  }

  @Delete('')
  deleteMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyProductLocationUseCase.execute(data, req.userId, req.branchId)
  }

  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: RequestAccessBranchJWT): Promise<ProductLocation> {
    return this._getOneProductLocationUseCase.execute(id, req.branchId)
  }

  @Get()
  getAll(
    @Query() queryParams: GetAllProductLocationRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllProductLocationResponseDto> {
    return this._getAllProductLocationUseCase.execute(queryParams, req.branchId)
  }
}
