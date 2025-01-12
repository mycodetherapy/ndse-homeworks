const fs = require('fs');
const path = require('path');

const analyzeLogs = (logFilePath) => {
  const absolutePath = path.resolve(__dirname, logFilePath);

  fs.readFile(absolutePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка при чтении файла:', err);
      process.exit(1);
    }

    const lines = data.trim().split('\n');
    const totalGames = lines.length;
    const wins = lines.filter((line) => line.includes('Победа')).length;
    const losses = totalGames - wins;
    const winPercentage = ((wins / totalGames) * 100).toFixed(2);

    console.log('Результаты анализа:');
    console.log(`- Общее количество партий: ${totalGames}`);
    console.log(`- Количество выигранных партий: ${wins}`);
    console.log(`- Количество проигранных партий: ${losses}`);
    console.log(
      `- Процентное соотношение выигранных партий: ${winPercentage}%`
    );
  });
};

const logFilePath = process.argv[2];

if (!logFilePath) {
  console.error('Пожалуйста, укажите путь к файлу логов.');
  process.exit(1);
}

analyzeLogs(logFilePath);
