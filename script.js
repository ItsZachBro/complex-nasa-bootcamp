const locationsTable = document.getElementById('locations-table');
const weatherInfo = document.getElementById('weather-info');
const locations = new Set();

// Get NASA locations
fetch('https://data.nasa.gov/resource/gvk9-iz74.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(location => {
      const key = `${location.center}-${location.city}-${location.state}`;
      console.log('Key:', key); // Add this line for debugging
      
      if (!locations.has(key)) {
        locations.add(key);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="location" data-center="${location.center}" data-city="${location.city}" data-state="${location.state}">
            ${location.center}
          </td>
          <td>${location.city}</td>
          <td>${location.state}</td>
        `;
        locationsTable.appendChild(tr);

        // Add click event listener to the entire row
        tr.addEventListener('click', () => {
          const center = tr.querySelector('.location').dataset.center;
          let city = tr.querySelector('.location').dataset.city;
          const state = tr.querySelector('.location').dataset.state;

          // Location fix for places with wierd locations 
          if (city === 'Moffett Field') {
            city = 'Santa Clara';
          }
          if (city === 'Moffett Field') {
            city = 'Mountain View';
          }
          if (city === 'Kennedy Space Center') {
            city = 'Cape Canaveral';
          }
          if (city === 'Wallops Island') {
            city = 'Chincoteague';
          }
          if (city === 'Stennis Space Center') {
            city = 'Hancock County';
          }

          selectedLocation = { center, city, state };
          displayWeather();
        });
      }
    });
  })
  .catch(error => console.log(error));

// get weather info for locations
function displayWeather() {
  if (selectedLocation) {
    const { center, city, state } = selectedLocation;
    const locationForWeather = `${city},${state},US`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(locationForWeather)}&appid=fd5c60d78a677d5dfe66577a9cf8044d&units=imperial`;
    console.log(apiUrl);
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.weather && data.weather.length > 0) {
          const description = data.weather[0].description;
          const temperature = Math.round(data.main.temp);
          weatherInfo.innerText = `${center}: ${description}, ${temperature}°F`;
        } else {
          weatherInfo.innerText = 'Weather data not available.';
        }
      })
      .catch(error => console.log(error));
  }
}
