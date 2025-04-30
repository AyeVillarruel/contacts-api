import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
  
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
  
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      message = typeof response === 'string' ? response : (response as any).message;
    }
  
    this.logger.error(`Exception on ${request.method} ${request.url}`);
    this.logger.error('Exception:', exception);
  
    if (exception instanceof Error) {
      this.logger.error('Stack trace:', exception.stack);
    }
  
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
  
}
