import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const logResult = (filePath, result) => {
  const logEntry = `${new Date().toISOString()} - ${result}\n`;
  fs.appendFile(filePath, logEntry, (err) => {
    if (err) {
      console.error('Ошибка записи в лог-файл:', err);
    }
  });
};

const analyzeLogsStream = (logFilePath) => {
  const absolutePath = path.resolve(__dirname, logFilePath);
  const readStream = fs.createReadStream(absolutePath, { encoding: 'utf8' });

  let totalGames = 0;
  let wins = 0;
  let losses = 0;

  readStream.on('data', (chunk) => {
    const lines = chunk.trim().split('\n');
    lines.forEach((line) => {
      totalGames++;
      if (line.includes('Победа')) {
        wins++;
      } else if (line.includes('Поражение')) {
        losses++;
      }
    });
  });

  readStream.on('end', () => {
    const winPercentage =
      totalGames > 0 ? ((wins / totalGames) * 100).toFixed(2) : 0;

    console.log('Результаты анализа:');
    console.log(`- Общее количество партий: ${totalGames}`);
    console.log(`- Количество выигранных партий: ${wins}`);
    console.log(`- Количество проигранных партий: ${losses}`);
    console.log(
      `- Процентное соотношение выигранных партий: ${winPercentage}%`
    );
  });

  readStream.on('error', (err) => {
    console.error('Ошибка при чтении файла:', err);
  });
};

const coinFlipGame = (logFileName) => {
  const logFilePath = path.resolve(__dirname, logFileName);

  const playRound = () => {
    const randomNumber = Math.floor(Math.random() * 2) + 1;
    rl.question('Угадайте: 1 (орёл) или 2 (решка)? ', (answer) => {
      const userGuess = parseInt(answer, 10);

      if (isNaN(userGuess) || (userGuess !== 1 && userGuess !== 2)) {
        console.log('Некорректный ввод. Пожалуйста, введите 1 или 2.');
        return playRound();
      }

      if (userGuess === randomNumber) {
        console.log('Поздравляем, вы угадали!');
        logResult(logFilePath, 'Победа');
      } else {
        console.log('Вы не угадали. Попробуйте ещё раз.');
        logResult(logFilePath, 'Поражение');
      }

      analyzeLogsStream(logFilePath);

      rl.question('Хотите сыграть ещё раз? (да/нет): ', (response) => {
        if (response.toLowerCase() === 'да') {
          playRound();
        } else {
          console.log('Спасибо за игру!');
          rl.close();
        }
      });
    });
  };

  playRound();
};

const logFileName = process.argv[2];

if (!logFileName) {
  console.error('Пожалуйста, укажите имя файла для логирования.');
  process.exit(1);
}

coinFlipGame(logFileName);
