import { AppService } from './app.service'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './controllers/app.controller'
import { ProvinceController } from './controllers/province.controller'
import { GetAllProvinceUseCase, GetOneProvinceUseCase } from 'src/application/usercases/provinces'
import { PrismaModule, PrismaService } from 'src/infrastructure/prisma'
import { AuthController } from './controllers/auth.controller'
import { SignInUseCase, SignUpUseCase } from 'src/application/usercases/auth'
import { JwtModule } from '@nestjs/jwt'
import { AccessBranchUseCase } from 'src/application/usercases/auth/access-branch.usecase'

const useCases = [
  // Province
  GetAllProvinceUseCase,
  GetOneProvinceUseCase,

  // Auth
  SignInUseCase,
  SignUpUseCase,
  AccessBranchUseCase
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
  controllers: [AppController, ProvinceController, AuthController],
  providers: [AppService, PrismaService, ...useCases]
})
export class AppModule {}
