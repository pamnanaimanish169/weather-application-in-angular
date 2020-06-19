import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label, MultiDataSet } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WeatherServiceService } from './weather-service.service';
import * as WebFont from 'webfontloader';
import { OwlOptions } from 'ngx-owl-carousel-o';
import * as Chart from 'chart.js';
import { element } from 'protractor';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Variables
  searchForm: FormGroup;
  result;
  celciusTemprature;
  partOfDay;
  skyCondition;
  coords = {
    lat : '',
    long: ''
  };
  myDateInUTCArray = [];
  dailyResponse = [];
  maxDailyTemperatureInCelcius = [];
  minDailyTemperatureInCelcius = [];
  DailyTemperatureInCelciusHourly = [];
  myDateInUTCArrayHourly = [];
  skyConditionHourly;
  skyConditionHourlyArray = [];
  todayMaxTem;
  todayMinTemp;
  daySky;
  nightSky;
  sunrise;
  sunset;
  uviIndex;
  windSpeed;
  maxTemp;
  minTemp;
  averageMaxTemp;
  averageMinTemp;
  // Data
  data = [];
  hourlyDataObject = {
    time: '',
    temp: 0,
    weather: ''
  };
  hourlyData = [];
  dailyTemperatureInCelcius = [];
  temp;
  name;
  weather;
  feelsLike;
  humidity;

  // ng2-charts for Humidity, Wind Speed, Max Spped
  public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: MultiDataSet = [
    [350, 450, 100],
    [50, 150, 120],
    [250, 130, 70],
  ];
  public doughnutChartType: ChartType = 'doughnut';

  public lineChartData: ChartDataSets[] = [
  { data: [], label: 'Temperature'},
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    {
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  canvas: any;
  ctx: any;

  canvas1: any;
  ctx1: any;

  canvas2: any;
  ctx2: any;

  canvas3: any;
  ctx3: any;

  dataInOneCall;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag : false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  // Pie Chart END

  constructor(private weatherService: WeatherServiceService, private fb: FormBuilder, private elRef: ElementRef) {}

  ngOnInit() {
    WebFont.load({
      // tslint:disable-next-line: quotemark
      google: {"families": ["Montserrat: 400, 500, 600, 700", "Noto+Sans:400,700"]},
      active: function() {
        sessionStorage.fonts = true;
      }
    });

    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const time = '0' + hours + ':' + minutes;

    // Judge the Part of the Day
    // We Don't Have to judge the part of the Day, We Just Have to Judge whether it is Day or Night.
    // It doesn't matter if we have to Judge Afternoon, Night, Morning ,etc. It is not needed in Judging the cloudliness

    if ( hours >= 6 && minutes >= 0 && hours <= 17 && minutes <= 59 ) {
      this.partOfDay = 'Day';
    } else if ( hours >= 18 && minutes >= 0 && hours <= 5 && minutes <= 59  ) {
      this.partOfDay = 'Night';
    }
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      cityName: ['', Validators.required]
    });
  }

  search() {
    this.weatherService.getCurrentWeather(this.searchForm.controls['cityName'].value).subscribe(res => {
      this.result = res;


      this.feelsLike = Math.round(this.result.main.feels_like - 273.15);
      console.log( this.feelsLike );
      this.weather = this.result.weather[0].main;
      this.name = this.result.name;
      this.temp = Math.round(this.result.main.temp - 273.15);
      this.humidity = this.result.main.humidity;
      console.log( this.humidity );

      this.sunrise = new Date(this.result.sys.sunrise * 1000).toUTCString().slice(17, 24);
      this.sunset = new Date(this.result.sys.sunset * 1000).toUTCString().slice(17, 24);

      this.coords.lat =  this.result.coord.lat;
      this.coords.long = this.result.coord.lon;

      this.celciusTemprature = Math.round(this.result.main.temp - 273.15) ;

      // If it is day, then calculate climate(Mostly Sunny, Partly Cloudy, etc) according to it.
      if (this.partOfDay == 'Day') {
      if ( this.result.clouds.all >= 0 && this.result.clouds.all <= 12.5 ) {
        this.skyCondition = 'Sunny';
      } else if ( this.result.clouds.all >= 12.5 && this.result.clouds.all <= 37.5  ) {
        this.skyCondition = 'Mostly Sunny';
      } else if ( this.result.clouds.all >= 37.5 && this.result.clouds.all <= 62.5 ) {
        this.skyCondition = 'Partly Sunny';
      } else if ( this.result.clouds.all >= 62.5 && this.result.clouds.all <= 87.5 ) {
        this.skyCondition = 'Mostly Cloudy';
      } else if ( this.result.clouds.all >= 87.5 && this.result.clouds.all <= 100 ) {
        this.skyCondition = 'Cloudy';
      }
    }
      // We Placed the getAllDataInOneCell Inside this API because if you place it outside the scope of the getAllDataInOneCall
      // gets executed first and the coords variable doesn't have a value when it is been passed to weather.service.ts.
      this.weatherService.getAllDataInOneCall(this.coords).subscribe(resposne => {
        this.dataInOneCall = resposne;
        this.uviIndex = resposne.daily[0].uvi;
        this.windSpeed = resposne.daily[0].wind_speed;
        // Max Temperature for Morning
        if ( resposne.hourly[0].clouds >= 0 && resposne.hourly[0].clouds <= 12.5 ) {
          this.daySky = 'Sunny';
        } else if ( resposne.hourly[0].clouds >= 12.5 && resposne.hourly[0].clouds <= 37.5  ) {
          this.daySky = 'Mostly Sunny';
        } else if ( resposne.hourly[0].clouds >= 37.5 && resposne.hourly[0].clouds <= 62.5 ) {
          this.daySky = 'Partly Sunny';
        } else if ( resposne.hourly[0].clouds >= 62.5 && resposne.hourly[0].clouds <= 87.5 ) {
          this.daySky = 'Mostly Cloudy';
        } else if ( resposne.hourly[0].clouds >= 87.5 && resposne.hourly[0].clouds <= 100 ) {
          this.daySky = 'Cloudy';
        }

        // Max Temperature for Night
        if ( resposne.hourly[24].clouds >= 0 && resposne.hourly[24].clouds <= 12.5 ) {
          this.nightSky = 'Sunny';
        } else if ( resposne.hourly[24].clouds >= 12.5 && resposne.hourly[24].clouds <= 37.5  ) {
          this.nightSky = 'Mostly Sunny';
        } else if ( resposne.hourly[24].clouds >= 37.5 && resposne.hourly[24].clouds <= 62.5 ) {
          this.nightSky = 'Partly Sunny';
        } else if ( resposne.hourly[24].clouds >= 62.5 && resposne.hourly[24].clouds <= 87.5 ) {
          this.nightSky = 'Mostly Cloudy';
        } else if ( resposne.hourly[24].clouds >= 87.5 && resposne.hourly[24].clouds <= 100 ) {
          this.nightSky = 'Cloudy';
        }
        resposne.daily.forEach((element, key) => {
          this.todayMaxTem = Math.round(element.temp.max - 273.15);
          this.todayMinTemp = Math.round(element.temp.min - 273.15);
          // this.daySky =
          // https://www.epochconverter.com/programming/
          this.dailyResponse.push(element);
          this.dailyTemperatureInCelcius.push(Math.round(element.temp.max - 273.15));
          this.maxDailyTemperatureInCelcius.push( Math.round(element.temp.max - 273.15) );
          this.minDailyTemperatureInCelcius.push(Math.round(element.temp.min - 273.15));

          this.maxTemp = Math.max(...this.maxDailyTemperatureInCelcius);
          this.minTemp = Math.min(...this.minDailyTemperatureInCelcius);

          let total = 0;
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < this.maxDailyTemperatureInCelcius.length; i ++) {
            total += this.maxDailyTemperatureInCelcius[i];
          }
          this.averageMaxTemp = total / this.maxDailyTemperatureInCelcius.length;

          let averageTotal = 0;

          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < this.minDailyTemperatureInCelcius.length; i ++) {
            averageTotal += this.minDailyTemperatureInCelcius[i];
          }
          this.averageMinTemp = averageTotal / this.minDailyTemperatureInCelcius.length;

          const myDate = new Date(element.dt * 1000);
          const myDateInUTC = myDate.toUTCString().slice(5, 12);
          this.myDateInUTCArray.push(myDateInUTC);
        });
        for (let i =0; i < 4; i++) {
          this.DailyTemperatureInCelciusHourly.push(Math.round(resposne.hourly[i + 4].temp - 273.15));

          const myDate2 = new Date(resposne.hourly[i + 4].dt * 1000);
          const myDateInUTCHourly = myDate2.toUTCString();
          this.myDateInUTCArrayHourly.push(myDateInUTCHourly);

          this.lineChartData.forEach((element1, key) => {
            element1.data.push(Math.round(resposne.hourly[i + 4].temp - 273.15));
          });

          this.lineChartLabels.push(myDateInUTCHourly.slice(17, 24));

          if (this.partOfDay == 'Day') {
                if ( resposne.hourly[i + 4].clouds >= 0 && resposne.hourly[i + 4].clouds <= 12.5 ) {
                  this.skyConditionHourly = 'Sunny';
                  this.skyConditionHourlyArray.push(this.skyConditionHourly);
                } else if ( resposne.hourly[i + 4].clouds >= 12.5 && resposne.hourly[i + 4].clouds <= 37.5  ) {
                  this.skyConditionHourly = 'Mostly Sunny';
                  this.skyConditionHourlyArray.push(this.skyConditionHourly);
                } else if ( resposne.hourly[i + 4].clouds >= 37.5 && resposne.hourly[i + 4].clouds <= 62.5 ) {
                  this.skyConditionHourly = 'Partly Sunny';
                  this.skyConditionHourlyArray.push(this.skyConditionHourly);
                } else if ( resposne.hourly[i + 4].clouds >= 62.5 && resposne.hourly[i + 4].clouds <= 87.5 ) {
                  this.skyConditionHourly = 'Mostly Cloudy';
                  this.skyConditionHourlyArray.push(this.skyConditionHourly);
                } else if ( resposne.hourly[i + 4].clouds >= 87.5 && resposne.hourly[i + 4].clouds <= 100 ) {
                  this.skyConditionHourly = 'Cloudy';
                  this.skyConditionHourlyArray.push(this.skyConditionHourly);
                }
              }
        }

          // Chart 1
        this.canvas = document.getElementById('myChart');
        this.ctx = this.canvas.getContext('2d');
        let myChart = new Chart(this.ctx, {
          type: 'line',
          data: {
              labels: this.lineChartLabels,
              datasets: [{
                  label: '° C',
                  data: this.DailyTemperatureInCelciusHourly,
                  backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      '',
                      ''
                  ],
                  borderWidth: 2
              }]
          },
          options: {
            responsive: false,
          }
        });

    // Chart 2
        this.canvas1 = document.getElementById('myChart1');
        this.ctx1 = this.canvas1.getContext('2d');
        let myChart1 = new Chart(this.ctx1, {
          type: 'line',
          data: {
              labels: this.myDateInUTCArray,
              datasets: [{
                  label: '° C',
                  fill: false,
                  data: this.dailyTemperatureInCelcius,
                  backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      '',
                      ''
                  ],
                  borderColor: "#ffbd35",
                  borderWidth: 1
              }]
          },
          options: {
            responsive: false,
            scales: { yAxes: [{ display: false }],xAxes: [{
                    display: false //this will remove all the x-axis grid lines
                }] }
          },
        });

    // Chart 3
        this.canvas2 = document.getElementById('myChart2');
        this.ctx2 = this.canvas2.getContext('2d');
        let myChart2 = new Chart(this.ctx2, {
          type: 'pie',
          data: {
            // The Legend displayed over Charts
              labels: ['Max Temp', 'Min Temp'],
              datasets: [{
                  label: '° C',
                  fill: false,
                  data: [this.todayMaxTem, this.todayMinTemp],
                  backgroundColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(50, 168, 82)'
                  ],
                  borderColor: "#ffbd35",
                  borderWidth: 1
              }]
          },
          options: {
            responsive: false,
            scales: { yAxes: [{ display: false }],xAxes: [{
                    display: false //this will remove all the x-axis grid lines
                }] },
            elements: {
            line: {
              tension: 0.000001
            }
        },
          },
        });
      });
    });
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    // console.log(event, active);
  }
}
