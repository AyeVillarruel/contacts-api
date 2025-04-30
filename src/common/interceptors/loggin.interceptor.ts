import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
  } from '@nestjs/common';
  import { Observable, tap } from 'rxjs';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const { method, url, headers, ip } = request;
      const userAgent = headers['user-agent'] || '';
      const now = Date.now();
  
      return next.handle().pipe(
        tap(() => {
          const responseTime = Date.now() - now;
          this.logger.log(
            `[${method}] ${url} - ${ip} - ${userAgent} - ${responseTime}ms`,
          );
        }),
      );
    }
  }
  