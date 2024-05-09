import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getIotData(): Promise<any> {
    const respuesta = await firstValueFrom(
      this.httpService.get('https://b8khz3214e.execute-api.us-east-2.amazonaws.com/devicedatastage/sensor_data?client_id=client1')
    );
    return respuesta.data;
  }

  async getMachineLearningData(): Promise<any> {
    const respuesta = await firstValueFrom(
      this.httpService.get('https://ujcid3yrgd.execute-api.us-east-2.amazonaws.com/YieldpredStage')
    );
    return respuesta.data;
  }
}
