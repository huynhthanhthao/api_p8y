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
  CreateUserUseCase,
  DeleteUserUseCase,
  DeleteManyUserUseCase,
  GetAllUserUseCase,
  GetOneUserUseCase,
  UpdateUserUseCase
} from '@usecases/users'
import {
  CreateUserRequestDto,
  GetAllUserRequestDto,
  GetAllUserResponseDto,
  UpdateUserRequestDto
} from '@interface-adapter/dtos/users'
import { AccessTokenGuard } from '@common/guards/access-token.guard'
import { RequestAccessBranchJWT } from '@common/interfaces'
import { DeleteManyRequestDto, UUIDParamDto } from '@common/dtos'
import { User } from '@common/types'

@Controller('users')
@UseGuards(AccessTokenGuard)
export class UserController {
  constructor(
    private readonly _getAllUserUseCase: GetAllUserUseCase,
    private readonly _getOneUserUseCase: GetOneUserUseCase,
    private readonly _createUserUseCase: CreateUserUseCase,
    private readonly _updateUserUseCase: UpdateUserUseCase,
    private readonly _deleteUserUseCase: DeleteUserUseCase,
    private readonly _deleteManyUserUseCase: DeleteManyUserUseCase
  ) {}

  @Post()
  create(@Body() data: CreateUserRequestDto, @Req() req: RequestAccessBranchJWT): Promise<User> {
    return this._createUserUseCase.execute(data, req.userId, req.storeCode)
  }

  @Patch(':id')
  update(
    @Param() params: UUIDParamDto,
    @Body() data: UpdateUserRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<User> {
    return this._updateUserUseCase.execute(params.id, data, req.userId, req.storeCode)
  }

  @Delete(':id')
  delete(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<string> {
    return this._deleteUserUseCase.execute(params.id, req.userId, req.storeCode)
  }

  @Delete('')
  deleteMany(
    @Body() data: DeleteManyRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<Prisma.BatchPayload> {
    return this._deleteManyUserUseCase.execute(data, req.userId, req.storeCode)
  }

  @Get(':id')
  getOne(@Param() params: UUIDParamDto, @Req() req: RequestAccessBranchJWT): Promise<User> {
    return this._getOneUserUseCase.execute(params.id, req.storeCode)
  }

  @Get()
  getAll(
    @Query() queryParams: GetAllUserRequestDto,
    @Req() req: RequestAccessBranchJWT
  ): Promise<GetAllUserResponseDto> {
    return this._getAllUserUseCase.execute(queryParams, req.storeCode)
  }
}
