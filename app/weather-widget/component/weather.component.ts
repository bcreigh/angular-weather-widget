import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../service/weather.service';
import { Weather } from '../model/weather';

import {WEATHER_COLORS} from '../constants/constants';

declare var Skycons: any;

@Component({
  moduleId: module.id,
  selector: 'weather-widget',
  templateUrl: 'weather.component.html',
  styleUrls: ['weather.component.css'],
  providers: [ WeatherService ]
})
export class WeatherComponent implements OnInit {
  pos: Position;
  weatherData = new Weather(null, null, null, null, null);
  currentSpeedUnit = "mph";
  currentTempUnit = "f";
  currentLocation = "";
  icons = new Skycons();
  dataReceived = false;

  constructor(private service: WeatherService) { }

  ngOnInit() {
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    this.service.getCurrentLocation()
    .subscribe(position => {
      this.pos = position;
      this.getCurrentWeather();
      this.getLocationName();
    },
    err => console.error(err));
  }

  getCurrentWeather() {
    this.service.getCurrentWeather(this.pos.coords.latitude, this.pos.coords.longitude)
        .subscribe(weather => {
          this.weatherData.temp = weather["currently"]["temperature"],
          this.weatherData.summary = weather["currently"]["summary"],
          this.weatherData.wind = weather["currently"]["windSpeed"],
          this.weatherData.humidity = weather["currently"]["humidity"],
          this.weatherData.icon = weather["currently"]["icon"]
          console.log("Weather: ", this.weatherData); //TODO: Remove after testing
          this.setIcon();
          this.dataReceived = true;
        },
        err => console.error(err));
  }

  getLocationName() {
    this.service.getLocationName(this.pos.coords.latitude, this.pos.coords.longitude)
        .subscribe(location => {
            console.log(location); // TODO: Remove after testing
            this.currentLocation = location["results"][1]["formatted_address"].slice(0, -5);
            console.log("Name: ", this.currentLocation); //TODO: Remove after testing
        })
  }
  toggleUnits() {
    this.toggleTempUnits();
    this.toggleSpeedUnits();
  }

  toggleTempUnits() {
    if(this.currentTempUnit == "f") {
      this.currentTempUnit = "c";
    } else {
      this.currentTempUnit = "f";
    }
  }

  toggleSpeedUnits() {
    if(this.currentSpeedUnit == "mph") {
      this.currentSpeedUnit = "kph";
    } else {
      this.currentSpeedUnit = "mph";
    }
  }

  setIcon() {
    this.icons.add("icon", this.weatherData.icon);
    this.icons.play();
  }

  setStyles(): Object {
    if(this.weatherData.icon) {
      this.icons.color = WEATHER_COLORS[this.weatherData.icon]["color"];
      return WEATHER_COLORS[this.weatherData.icon];
    } else {
      return WEATHER_COLORS["default"];
    }
  }

}
