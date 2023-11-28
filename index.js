const axios = require('axios');
const readline = require('readline');
require('dotenv').config();

const appid = "ef0b0973b783e0614ac87612ec04344b";
const code = "076";
const lang = "pt_br";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Digite a cidade de preferencia: ', (cidade) => {
  rl.close();

  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cidade},${code}&limit=${1}&appid=${appid}&lang=${lang}`;

  axios
    .get(url)
    .then(res => res.data)
    .then((res) => {
      for (let prev of res) {
        const climaUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${prev.lat}&lon=${prev.lon}&appid=${appid}&lang=${lang}`;

        axios.get(climaUrl)
          .then(res => {
            const sensacaoTermicaKelvin = res.data.main.feels_like;
            const sensacaoTermicaCelsius = sensacaoTermicaKelvin - 273.15;
            const descricao = res.data.weather[0].description;

            console.log(`
              ${'Cidade: ' + prev.name}
              ${'Latitude: ' + prev.lat}
              ${'Longitude: ' + prev.lon}
              Sensação Térmica: ${sensacaoTermicaCelsius.toFixed(2)} °C
              Descrição: ${descricao}
            `);
          })
          .catch(error => {
            console.error('Erro ao obter dados meteorológicos:', error);
          });
      }
    })
    .catch(error => {
      console.error('Erro ao obter dados de localização:', error);
    });
});