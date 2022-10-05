import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NodeConfigService {
  constructor(
    @Inject(forwardRef(() => ConfigService))
    private configService: ConfigService,
  ) {}

  get host(): string {
    return this.configService.get<string>('typeorm.host');
  }

  get port(): string {
    return this.configService.get<string>('typeorm.port');
  }

  get database(): string {
    return this.configService.get<string>('typeorm.database');
  }

  get username(): string {
    return this.configService.get<string>('typeorm.username');
  }

  get password(): string {
    return this.configService.get<string>('typeorm.password');
  }

  get synchronize(): string {
    return this.configService.get<string>('typeorm.synchronize');
  }

  get logging(): string {
    return this.configService.get<string>('typeorm.logging');
  }
}
