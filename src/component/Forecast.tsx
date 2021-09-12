import React from 'react';

interface WeatherData {
  readonly main: { temp: number };
  readonly name: string;
  readonly weather: [{ icon: string, description: string }];
  readonly sys: {
    readonly country: string;
    readonly sunrise: number;
    readonly sunset: number;
  };
  readonly cod: number;
}

interface CityNotFound {
  readonly state: boolean;
  readonly message: string;
}

interface ForecastState {
  weatherData: WeatherData | null;
  cityNotFound: CityNotFound | null;
}

const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default class Forecast extends React.Component {
  API_KEY = "c647ab49b15757dbe184259fff6fe4c5";

  state: ForecastState = {
    weatherData: null,
    cityNotFound: null
  }

  private searchField = React.createRef<HTMLInputElement>();
  private temperatureText = React.createRef<HTMLParagraphElement>();
  private sunriseTime = React.createRef<HTMLParagraphElement>();
  private sunsetTime = React.createRef<HTMLParagraphElement>();
  private locationText = React.createRef<HTMLParagraphElement>();
  private weatherIcon = React.createRef<HTMLImageElement>();
  private descriptionText = React.createRef<HTMLParagraphElement>();
  private failureMessage = React.createRef<HTMLParagraphElement>();

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate() {
    if (this.state.weatherData) {
      if (this.temperatureText.current) this.temperatureText.current.innerText = Math.round(this.state.weatherData.main.temp).toString();
      if (this.sunriseTime.current) this.sunriseTime.current.innerText = this.getFormattedTime(this.state.weatherData.sys.sunrise);
      if (this.sunsetTime.current) this.sunsetTime.current.innerText = this.getFormattedTime(this.state.weatherData.sys.sunset);
      if (this.locationText.current) this.locationText.current.innerText = `${this.state.weatherData.name}, ${this.state.weatherData.sys.country}`;
      if (this.weatherIcon.current) this.weatherIcon.current.src = `https://openweathermap.org/img/wn/${this.state.weatherData.weather[0].icon}@2x.png`;
      if (this.descriptionText.current) this.descriptionText.current.innerText = capitalizeFirstLetter(this.state.weatherData.weather[0].description);
    }

    if (this.state.cityNotFound && this.failureMessage.current) {
      if (this.state.cityNotFound.state === true) this.failureMessage.current.innerText = capitalizeFirstLetter(this.state.cityNotFound.message);
      else this.failureMessage.current.innerText = "";
    }
  }

  async loadData() {
    const cityName = this.searchField.current?.value ? this.searchField.current.value : 'Kyiv';

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${this.API_KEY}`);
    const data = await response.json();

    if (data.cod !== 200) {
      this.setState({ cityNotFound: { state: true, message: data?.message } });
      return;
    }

    this.setState({ weatherData: data, cityNotFound: { state: false, message: '' } });
  }

  getFormattedTime(time: number): string {
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    const date = new Date(time * 1000);

    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();

    // Will display time in hh:mm:ss format
    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return formattedTime;
  }

  render() {
    return (
      <div className="bg-green-700 w-full h-screen flex flex-col items-center justify-center">
        <div className="mb-5">
          <input type="text" placeholder="Kyiv" ref={this.searchField} onSubmit={this.loadData.bind(this)}
            className="text-center bg-white p-4 bg-opacity-70 rounded-3xl flex space-x-12 items-center shadow-md focus:outline-none focus:bg-white focus:border-purple-500"
          />
          {this.state.cityNotFound?.state &&
            <div className="text-center pt-5 lg:px-4">
              <div className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none rounded-full flex lg:inline-flex" role="alert">
                <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">Error</span>
                <span ref={this.failureMessage} className="font-semibold mr-2 text-left flex-auto" />
              </div>
            </div>
          }
        </div>
        <button onClick={this.loadData.bind(this)} id="Update" className="rounded-full text-center bg-red-900 text-white w-40 my-7 py-4 font-bold">
            Select city
            </button>

        <div className="bg-white bg-opacity-70 p-8 rounded-3xl flex space-x-12 items-center shadow-md">
          <div>
            <img ref={this.weatherIcon} src="" className="h-32 w-32" alt="weather icon" />
            <p ref={this.descriptionText} className="text-center text-gray-500 mt-2 text-sm">Cloudy</p>
          </div>

          <div>
            <p className="text-7xl font-bold text-right text-gray-900"><span ref={this.temperatureText} />&#176;C</p>
            <div className="flex flex-row">
              <p ref={this.sunriseTime} className="text-gray-900 mt-2 text-sm" />
            </div>
            <div className="flex flex-row">
              <p ref={this.sunsetTime} className="text-gray-900 mt-2 text-sm" />
            </div>
            <p ref={this.locationText} className="text-gray-500 text-sm" />
          </div>
        </div>
      </div >
    );
  }
}