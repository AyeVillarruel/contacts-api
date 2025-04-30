import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
  } from '@nestjs/common';
  import { Prisma } from '@prisma/client';
  import { Response } from 'express';
  
  @Catch(Prisma.PrismaClientKnownRequestError)
  export class PrismaClientExceptionFilter implements ExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      let status = HttpStatus.BAD_REQUEST;
      let message = exception.message;
  
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = 'Unique constraint failed on one or more fields';
      }
  
      response.status(status).json({
        statusCode: status,
        message,
        error: 'Prisma Error',
      });
    }
  }
  