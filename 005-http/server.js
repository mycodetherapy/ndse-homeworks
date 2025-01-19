import http from 'http';
import { accessKey, apiBaseUrl, defaultQuery } from './config.js';

function fetchWeather(city, callback) {
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
            callback(`Ошибка: ${result.error.info}`, null);
            return;
          }

          const { location, current } = result;
          const weatherInfo = `
            <h1>Погода в ${location.name}, ${location.country}</h1>
            <p>Температура: ${current.temperature}°C</p>
            <p>Ощущается как: ${current.feelslike}°C</p>
            <p>Описание: ${current.weather_descriptions.join(', ')}</p>
            <p>Влажность: ${current.humidity}%</p>
            <p>Скорость ветра: ${current.wind_speed} км/ч</p>
          `;
          callback(null, weatherInfo);
        } catch (error) {
          callback('Ошибка обработки данных: ' + error.message, null);
        }
      });
    })
    .on('error', (err) => {
      callback('Ошибка запроса: ' + err.message, null);
    });
}

function renderHTML(content = '') {
  return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Прогноз погоды</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          text-align: center;
        }
        input {
          padding: 10px;
          font-size: 16px;
          margin-right: 10px;
        }
        button {
          padding: 10px;
          font-size: 16px;
        }
        .weather {
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <h1>Прогноз погоды</h1>
      <form method="GET">
        <input type="text" name="city" placeholder="Введите город" required />
        <button type="submit">Узнать погоду</button>
      </form>
      <div class="weather">${content}</div>
    </body>
    </html>
  `;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const city = url.searchParams.get('city');

  if (!city) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderHTML());
  } else {
    fetchWeather(city, (error, weatherInfo) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      if (error) {
        res.end(renderHTML(`<p style="color: red;">${error}</p>`));
      } else {
        res.end(renderHTML(weatherInfo));
      }
    });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
