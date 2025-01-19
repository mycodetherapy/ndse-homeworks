import dotenv from 'dotenv';
dotenv.config();

export const accessKey = process.env.WEATHERSTACK_ACCESS_KEY || '';
export const apiBaseUrl = 'http://api.weatherstack.com';
export const defaultQuery = 'New York';

if (!accessKey) {
  throw new Error('API ключ доступа отсутствует. Проверьте файл .env.');
}
