import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('iot-data')
  async getIotData(): Promise<any> {
    return this.appService.getIotData();
  }

  @Get('machine-learning-data')
  async getMachineLearningData(): Promise<any> {
    return this.appService.getMachineLearningData();
  }
}
