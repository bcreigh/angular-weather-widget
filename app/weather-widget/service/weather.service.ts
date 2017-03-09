import { Injectable } from '@angular/core';
import { Jsonp, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { FORECAST_KEY, FORECAST_ROOT, GOOGLE_KEY, GOOGLE_ROOT } from '../constants/constants';

@Injectable()

export class WeatherService {

  constructor(private jsonp: Jsonp, private http: Http) { }

  getCurrentLocation(): Observable<any> {
    if (navigator.geolocation) {
      return Observable.create(observer => {
        navigator.geolocation.getCurrentPosition(pos => {
          observer.next(pos)
        }),
          err => {
            return Observable.throw(err);
          }
      });
    } else {
      return Observable.throw('Geolocation not available');
    }
  }

  getCurrentWeather(lat: number, lon: number): Observable<any> {
    const url = FORECAST_ROOT + '/' + FORECAST_KEY + "/" + lat + "," + lon;
    const queryParams = "?callback=JSONP_CALLBACK";

    return this.jsonp.get(url + queryParams)
      .map(data => data.json())
      .catch(err => {
        console.error("Unable to get weather data - ", err);
        return Observable.throw(err.json());
      });
  }

  getLocationName(lat: number, lon: number): Observable<any> {
    const url = GOOGLE_ROOT;
    const queryParams = "?latlng=" + lat + "," + lon + "&key=" + GOOGLE_KEY;

    return this.http.get(url + queryParams)
      .map(loc => loc.json())
      .catch(err => {
        console.error("Unable to get location name - ", err);
        return Observable.throw(err);
      });
  }

}