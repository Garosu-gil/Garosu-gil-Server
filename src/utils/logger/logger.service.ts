import { Injectable, ConsoleLogger } from '@nestjs/common';
import { ILogger } from './ILogger';

@Injectable()
export class LoggerService extends ConsoleLogger implements ILogger {
  debug(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') super.debug(`[DEBUG] ${message}`, context);
  }
  log(message: string) {
    super.log(`[INFO] ${message}`);
  }
  error(context: string, message: string, trace?: string) {
    super.error(`[ERROR] ${message}`, trace, context);
  }
  warn(context: string, message: string) {
    super.warn(`[WARN] ${message}`, context);
  }
  verbose(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') super.verbose(`[VERBOSE] ${message}`, context);
  }
}
