import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TicketsController } from './tickets.controller.js';
import { TicketsService } from './tickets.service.js';
import { RequestMiddlewareMiddleware } from '../common/request-middleware.middleware.js';
import { RateLimiterMiddleware } from '../common/rateLimiter-middleware.js';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService]
})
export class TicketsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddlewareMiddleware, RateLimiterMiddleware).forRoutes(TicketsController)
  }
}
