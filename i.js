const input = document.querySelector(".inp");
const suggestionBox = document.querySelector(".suggestions");
const btn = document.querySelector(".btn");
const mainTemp = document.querySelector(".Temp_now");
const city = document.querySelector(".p1");
const desc = document.querySelector(".p2");
const maxTemp = document.querySelectorAll(".mini_groups p")[1];
const minTemp = document.querySelectorAll(".mini_groups p")[3];
const humidity = document.querySelectorAll(".mini_groups p")[5];
const cloudy = document.querySelectorAll(".mini_groups p")[7];
const wind = document.querySelectorAll(".mini_groups p")[9];

const API_KEY = "0101d8e61bc04c7fb9580547251103";


input.addEventListener("input", async () => {
  const query = input.value.trim();
  if (query.length < 2) {
    suggestionBox.innerHTML = "";
    return;
  }

  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`
    );
    const data = await res.json();

    suggestionBox.innerHTML = data
      .map(
        (city) =>
          `<li class="suggest-item">${city.name}, ${city.country}</li>`
      )
      .join("");

    document.querySelectorAll(".suggest-item").forEach((item) => {
      item.addEventListener("click", async () => {
        const selectedCity = item.textContent.split(",")[0];
        input.value = selectedCity;
        suggestionBox.innerHTML = "";

        
        await getWeather(selectedCity);
      });
    });
  } catch (err) {
    console.error("Autocomplete error:", err);
  }
});


async function getWeather(query) {
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}&aqi=no`
    );
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    mainTemp.textContent = `${Math.round(data.current.temp_c)}°`;
    city.textContent = data.location.name;
    desc.textContent = data.current.condition.text;
    maxTemp.textContent = `${Math.round(data.current.temp_c + 2)}°`;
    minTemp.textContent = `${Math.round(data.current.temp_c - 2)}°`;
    humidity.textContent = `${data.current.humidity}%`;
    cloudy.textContent = `${data.current.cloud}%`;
    wind.textContent = `${data.current.wind_kph} km/h`;
  } catch (err) {
    alert("Error: " + err.message);
  }
}


btn.addEventListener("click", async () => {
  const query = input.value.trim();
  if (query) await getWeather(query);
});
