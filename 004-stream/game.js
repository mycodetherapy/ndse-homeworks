const fs = require('fs');
const path = require('path');
const readline = require('readline');

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
