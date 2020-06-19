import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherServiceService {
  apiUrl = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClient) { }

  getCurrentWeather(cityName) {
    return this.httpClient.get<any>(this.apiUrl + `weather?q=` + cityName + `&appid=1057acc2bc4acacdc45b8d6e73683cb6`)
      .pipe(map(res => {
        return res;
      }));
  }

  getCurrentWeatherByCoords(longitude, latitude) {
    // tslint:disable-next-line: max-line-length
    return this.httpClient.get<any>(this.apiUrl + `weather?lat=` + latitude + `&lon=` + longitude + `&appid=1057acc2bc4acacdc45b8d6e73683cb6`)
      .pipe(map(res => {
        return res;
      }));
  }

  getAllDataInOneCall(coords) {
    // tslint:disable-next-line: max-line-length
    return this.httpClient.get<any>(this.apiUrl + `onecall?lat=` + coords.lat + `&lon=` + coords.long + `&appid=1057acc2bc4acacdc45b8d6e73683cb6`)
      .pipe(map(res => {
        return res;
      }));
  }

  getHistoricalData(coords, date) {
    // tslint:disable-next-line: max-line-length
    return this.httpClient.get<any>(this.apiUrl + `onecall/timemachine?lat=` + coords.lat + `&lon=` + coords.long + `&dt=` + date + `&appid=1057acc2bc4acacdc45b8d6e73683cb6` )
      .pipe(map(res => {
        return res;
      }));
    }
}
