import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {

  constructor(

    public city: string,
    public date: string,
    public icon: string,
    public iconDescription: string,
    public tempF: number,
    public humidity: number,
    public windSpeed: number) { }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;

  private apiKey: string;

  private cityName: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || "";
    this.apiKey = process.env.API_KEY || "";
    this.cityName = "";
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(
        query
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      //Parse the data
      const data = await response.json();

      return data;
    } catch (err) {
      console.error("Error fetching location data:", err);
      return null;
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0];
    let coordinates: Coordinates = { lat, lon }
    return coordinates;
  };

  // TODO: Create buildGeocodeQuery method. this will return the URL in a string format. 
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=5&appid=${this.apiKey}`
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {

    const { lat, lon } = coordinates; // Use destructureLocationData

    return `${this.baseURL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
  }
  
  // TODO: Create fetchAndDestructureLocationData method. Will take the coordinates and will return 
  private async fetchAndDestructureLocationData() {
    let data = await this.fetchLocationData(this.buildGeocodeQuery());
    let coordinates = this.destructureLocationData(data);

    return coordinates;
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(
        this.buildWeatherQuery(coordinates)
      )
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      //Parse the data
      const data = await response.json();

      return data;
    } catch (err) {
      console.error("Error fetching weather data:", err);
      return null;
    }
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    let weather: Weather = {
      city: this.cityName,
      date: new Date(response.dt * 1000).toLocaleDateString(),
      icon: response.weather[0].icon,
      iconDescription: response.weather[0].description,
      tempF: response.main.temp,
      windSpeed: response.wind.speed,
      humidity: response.main.humidity
    };

    return weather;
  }

  // TODO: Complete buildForecastArray method
  private async buildForecastArray(currentWeather: Weather, coordinates: Coordinates) {
    try {
      let response = await fetch(`${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      //Parse the data
      const data = await response.json();

      //build a for loop to loop through the list items and filter out 5 items
      const filteredData = [];

      for (let i = 0; i < data.list.length; i = i + 8) {

        let forecastWeather: Weather = {

          city: data.list[i].cityName,
          date: new Date(data.list[i].dt * 1000).toLocaleDateString(),
          icon: data.list[i].weather[0].icon,
          iconDescription: data.list[i].weather[0].description,
          tempF: data.list[i].main.temp,
          windSpeed: data.list[i].wind.speed,
          humidity: data.list[i].main.humidity

        };

        filteredData.push(forecastWeather)
      }

      return [currentWeather, ...filteredData]

    } catch (err) {
      console.error("Error fetching weather data:", err);
      return null;
    }
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    let coordinateData = await this.fetchAndDestructureLocationData();
    let weatherData = await this.fetchWeatherData(coordinateData);

    return this.buildForecastArray(this.parseCurrentWeather(weatherData), coordinateData);
  }
}

export default new WeatherService();