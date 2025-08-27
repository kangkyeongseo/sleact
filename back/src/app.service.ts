import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor( private readonly ConfigService:ConfigService) {}

  getHello() {
    return this.ConfigService.get("SECRET")
  }
}
