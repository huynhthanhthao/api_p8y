import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { PrismaModule, PrismaService } from '@infrastructure/prisma'
import { ProvinceController } from './controllers/province.controller'
import { AuthController } from './controllers/auth.controller'
import { AppController } from './controllers/app.controller'
import {
  SignInUseCase,
  SignUpUseCase,
  AccessBranchUseCase,
  GetMeUseCase,
  RefreshTokenUseCase
} from '@usecases/auth'
import { GetAllProvinceUseCase, GetOneProvinceUseCase } from '@usecases/provinces'
import { CustomerGroupController } from './controllers/customer-group.controller'
import {
  CreateCustomerGroupUseCase,
  DeleteCustomerGroupUseCase,
  DeleteManyCustomerGroupUseCase,
  GetAllCustomerGroupUseCase,
  GetOneCustomerGroupUseCase,
  UpdateCustomerGroupUseCase
} from '@usecases/customer-groups'

const useCases = [
  // Province
  GetAllProvinceUseCase,
  GetOneProvinceUseCase,

  // Auth
  SignInUseCase,
  SignUpUseCase,
  AccessBranchUseCase,
  GetMeUseCase,
  RefreshTokenUseCase,

  // Customer group
  CreateCustomerGroupUseCase,
  DeleteCustomerGroupUseCase,
  DeleteManyCustomerGroupUseCase,
  GetAllCustomerGroupUseCase,
  GetOneCustomerGroupUseCase,
  UpdateCustomerGroupUseCase
]

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.EXPIRES_IN_ACCESS_TOKEN }
    })
  ],
  controllers: [AppController, ProvinceController, AuthController, CustomerGroupController],
  providers: [AppService, PrismaService, ...useCases]
})
export class AppModule {}
