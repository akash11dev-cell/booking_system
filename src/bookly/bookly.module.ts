import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BooklyController } from './bookly.controller.js';
import { BooklyService } from './bookly.service.js';
import { RequestMiddlewareMiddleware } from '../common/request-middleware.middleware.js';
import { RateLimiterMiddleware } from '../common/rateLimiter-middleware.js';

@Module({
  controllers: [BooklyController],
  providers: [BooklyService]
})
export class BooklyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddlewareMiddleware, RateLimiterMiddleware).forRoutes(BooklyController)
  }
}
