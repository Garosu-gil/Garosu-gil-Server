import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import moment from 'moment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = new Date();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    const ip = this.getIP(request);

    return next.handle().pipe(
      tap(() => {
        console.log(
          // eslint-disable-next-line prettier/prettier
          `[INFO] ${moment(now).utc().format('yyyy-MM-DD HH:mm:ss.SSS')} ${ip} ${
            request.method
            // eslint-disable-next-line prettier/prettier
          } ${request.url} ${response.statusCode} ${JSON.stringify(request.body)}`,
        );
      }),
    );
  }

  private getIP(request: any): string {
    let ip: string;
    const ipAddr = request.headers['x-forwarded-for'];
    if (ipAddr) {
      const list = ipAddr.split(',');
      ip = list[list.length - 1];
    } else {
      ip = request.connection.remoteAddress;
    }
    return ip.replace('::ffff:', '');
  }
}
