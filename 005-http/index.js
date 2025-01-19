import http from 'http';
import { accessKey, apiBaseUrl, defaultQuery } from './config.js';

function fetchWeather(city) {
  const query = city || defaultQuery;
  const url = `${apiBaseUrl}/current?access_key=${accessKey}&query=${encodeURIComponent(
    query
  )}`;

  http
    .get(url, (response) => {
      let body = [];

      response.on('data', (chunk) => {
        body.push(chunk);
      });

      response.on('end', () => {
        try {
          const data = Buffer.concat(body).toString();
          const result = JSON.parse(data);

          if (result.error) {
            console.error(`Ошибка: ${result.error.info}`);
            return;
          }

          const { location, current } = result;
          console.log(`Погода в ${location.name}, ${location.country}:`);
          console.log(`Температура: ${current.temperature}°C`);
          console.log(`Ощущается как: ${current.feelslike}°C`);
          console.log(`Описание: ${current.weather_descriptions.join(', ')}`);
          console.log(`Влажность: ${current.humidity}%`);
          console.log(`Скорость ветра: ${current.wind_speed} км/ч`);
        } catch (error) {
          console.error('Ошибка обработки данных:', error.message);
        }
      });
    })
    .on('error', (err) => {
      console.error('Ошибка запроса:', err.message);
    });
}

const city = process.argv[2];
if (!city) {
  console.log('Укажите название города как аргумент:');
  console.log('node index.js <city-name>');
} else {
  fetchWeather(city);
}
