import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const { cityName } = req.body;
  if (!cityName) {
    return res.status(400).json({ error: 'cityName is required.' });
  }

  // TODO: save city to search history using the addCity function 

  try {

    const city = await HistoryService.addCity(cityName);

    const weatherData = await WeatherService.getWeatherForCity(cityName);
    console.log(weatherData);

    return res.status(201).json({weatherData, city})
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  return
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const savedCities = await HistoryService.getCities();
    res.json(savedCities);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const cityID = req.params.id;
    if (!cityID) {
      res.status(400).json({ msg: "City id is required" })
    }
    await HistoryService.removeCity(cityID);
    res.json({ success: "City successfully removed from search history" })
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;

