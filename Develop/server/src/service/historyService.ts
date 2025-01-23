import fs from 'node:fs/promises';
import {v4 as uuidv4} from 'uuid';

// TODO: Define a City class with name and id properties
export class City {
  
  name: string; //client is sending cityName
  id: string;

  constructor(name: string, id: string){
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the db.json file
  private async read() {
    return await fs.readFile('db/db.json',{
      flag: 'a+',
      encoding: 'utf8',
    });
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile('db/db.json',JSON.stringify(cities, null, '\t'));
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCity: City[];

      try {
        parsedCity = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCity =[];
      }
       return parsedCity;
    });
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    if (!city) {
      throw new Error('city cannot be blank')
    }

    //Add a unique ID to the city using uuid 
    const newCity: City ={ name: city, id: uuidv4() };

    //Get all cities then add the new city, write all the updated cities, return newCity
    return await this.getCities()
      .then((cities) => {
        if (cities.find((index) => index.name === city)){
          return cities;
        }
          return [...cities, newCity];
      })
      .then((updatedCities) => this.write(updatedCities))
      .then(() => newCity);
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    return await this.getCities()
    .then((cities) => cities.filter((cities) => cities.id !== id))
    .then((filteredCities) => this.write(filteredCities));
  }
}

export default new HistoryService();
