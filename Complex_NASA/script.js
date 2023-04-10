const locationsTable = document.getElementById('locations-table');
const weatherInfo = document.getElementById('weather-info');
let selectedLocation = null;
const locations = new Set();

// Get NASA locations
fetch('https://data.nasa.gov/resource/gvk9-iz74.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(location => {
      const key = `${location.center}-${location.city}-${location.state}`;
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
      }
    });
  })
  .catch(error => console.log(error));

// add event listeners to all the locations
locationsTable.addEventListener('click', e => {
  const locationCell = e.target.closest('.location');
  if (locationCell) {
    const center = locationCell.dataset.center;
    const city = locationCell.dataset.city;
    const state = locationCell.dataset.state;
    selectedLocation = { center, city, state };
    displayWeather();
  }
});

// get weather info for locations
function displayWeather() {
  if (selectedLocation) {
    const { center, city, state } = selectedLocation;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},US&appid=fd5c60d78a677d5dfe66577a9cf8044d&units=imperial`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const description = data.weather[0].description;
        const temperature = Math.round(data.main.temp);
        weatherInfo.innerText = `${center}: ${description}, ${temperature}°F`;
      })
      .catch(error => console.log(error));
  }
}