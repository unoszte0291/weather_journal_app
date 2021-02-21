/* Global Variables */
// API URL & key
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&units=metric&appid=ac5557c61203ad31a3fe2fab20a5c101';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// Event listener for the click
document.getElementById('generate').addEventListener('click', getWeather);

function getWeather(e) {
  e.preventDefault();
  const zipCode = document.getElementById('zip').value;
  const feelings = document.getElementById('feelings').value;
  getWeatherInfo(baseURL, zipCode, apiKey)
  .then(function (weatherData) {
    const temperature = weatherData.main.temp;
    const city = weatherData.name;
    const humidity = weatherData.main.humidity;
    const feeling = feelings;
    const country = weatherData.sys.country;
    // Weather info posted to the server
    postData('/add', {
        temperature, 
        city,  
        humidity,
        feeling,
        country
    }).then(() => {updateUI();})
    // updateUI function to be called after the click is fired off and the weather info is gathered
});
}

// Takes the url + zip + API and calls the API for the data
const getWeatherInfo = async (baseURL, zipCode, apiKey) => {

  const response = await fetch(baseURL + zipCode + apiKey)
  try {
      const newData = await response.json();
      console.log(newData)
      return newData;
  } 
  catch(error) {
      console.log("error", error);
  }
};

// POST function to server
async function postData(url, data) {
  await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(data),
  });
}

async function updateUI() {
  // GET function that takes the info from the server
  const response = await fetch('/all');
  const lastEntry = await response.json();
  console.log(lastEntry);
  document.querySelector('.city').innerText = "Weather in " + lastEntry.city;
  document.querySelector('.country').innerText = lastEntry.country;
  document.querySelector('.temperature').innerText = Math.floor(lastEntry.temperature) + "°C";
  document.querySelector('.humidity').innerText = "Humidity: " + lastEntry.humidity + "%";
  document.querySelector('.date').innerText = d;
  document.querySelector('.content').innerText = lastEntry.feeling;
}
