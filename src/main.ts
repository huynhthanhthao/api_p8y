import * as cookieParser from 'cookie-parser'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './interface-adapter/app.module'
import { json, static as static_ } from 'express'
import { BadRequestException, HttpStatus, ValidationPipe } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { GlobalExceptionFilter } from './common/exceptions/global.exception'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug']
    })
    const cfgService = app.get(ConfigService)

    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', '*')
      res.header('Access-Control-Allow-Headers', '*')
      res.header('Access-Control-Allow-Credentials', 'true')
      req.method === 'OPTIONS' ? res.status(200).end() : next()
    })

    app.use('/uploads', static_('uploads'))
    app.use(json({ limit: '5mb' }))
    app.use(cookieParser())

    app.useGlobalFilters(new GlobalExceptionFilter())

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        skipMissingProperties: false,
        disableErrorMessages: false,
        skipNullProperties: false,
        exceptionFactory: (errors: ValidationError[]) => {
          const messages = errors.flatMap(error => Object.values(error.constraints || {}))

          return new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Dữ liệu không hợp lệ',
            errors: messages
          })
        }
      })
    )

    const port = cfgService.get<number>('PORT') || 3000

    await app.listen(port)

    console.log(`🌟 Server is running on http://localhost:${port}`)
    console.log(`Swagger documentation available at: http://localhost:${port}/api`)
  } catch (error) {
    console.error('❌ Failed to start server:', error)
  }
}

bootstrap()
