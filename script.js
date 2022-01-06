const searchFormEl = document.querySelector("#searchForm");
const searchHistoryEl = document.querySelector(".searchHistory");
const resultsEl = document.querySelector(".results");
const oldBtn = document.querySelector("ul");
const todayResultsEl = document.querySelector(".today");
const disTitleEl = document.querySelector("#disTitle");
const localStorageSearches = JSON.parse(
  localStorage.getItem("weatherDashSearches")
);
let pastSearch = [];

const addToPastSearch = (newSearch) => {
  const LCSearch = newSearch.toLowerCase();

  const caseInsensitive = pastSearch.filter((element) => {
    return element.toLowerCase() === LCSearch;
  });

  if (caseInsensitive.length === 0) {
    const newSearchFirstCap =
      LCSearch.charAt(0).toUpperCase() + LCSearch.slice(1);
    pastSearch.push(newSearchFirstCap);
  }
};

const getInfo = (event) => {
  event.preventDefault();
  let searchInputVal = document.querySelector("#searchInput").value.trim();

  if (!searchInputVal) {
    console.log("please search for a city");
    return;
  }
  gettingResults(searchInputVal);
};

const gettingResults = async (searchInput) => {
  try {
    const searchApiRoute = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&appid=43ae064b43fdce4552702399802b6511&units=metric`;

    const response = await fetch(searchApiRoute);
    const readableApi = await response.json();

    await addToPastSearch(searchInput);
    await createList();
    await displayResults(readableApi);

    const todaysSearch = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=43ae064b43fdce4552702399802b6511&units=metric`;

    const todaysResponse = await fetch(todaysSearch);
    const readableTodaysResponse = await todaysResponse.json();

    await displayTodaysResults(readableTodaysResponse);
  } catch (err) {
    console.log(err);
    return;
  }
};

function displayResults(Api) {
  resultsEl.innerHTML = "";
  disTitleEl.style.display = "block";
  //increments through one in eight, which is 24 hours apart, return only one result per day.
  for (let i = 0; i < Api.list.length; i += 8) {
    let weatherCardEl = document.createElement("div");
    weatherCardEl.classList = "infoCard";

    let dayEl = document.createElement("div");
    dayEl.innerText = moment.unix(Api.list[i].dt).format("dddd");
    weatherCardEl.appendChild(dayEl);

    let dateEl = document.createElement("div");
    dateEl.innerText = moment.unix(Api.list[i].dt).format("DD/MM/YYYY");
    weatherCardEl.appendChild(dateEl);

    let icon = document.createElement("img");
    icon.src = `http://openweathermap.org/img/wn/${Api.list[i].weather[0].icon}@2x.png`;
    weatherCardEl.appendChild(icon);

    let tempEl = document.createElement("div");
    tempEl.innerText = `Temp: ${Math.round(Api.list[i].main.temp)} °C`;
    weatherCardEl.appendChild(tempEl);

    let windSpeedEl = document.createElement("div");
    windSpeedEl.innerText = `Wind: ${Math.round(
      Api.list[i].wind.speed * 3.6
    )} km/h`;
    weatherCardEl.appendChild(windSpeedEl);

    let humidityEl = document.createElement("div");
    humidityEl.innerText = `Humidity: ${Api.list[i].main.humidity} %`;
    weatherCardEl.appendChild(humidityEl);

    resultsEl.appendChild(weatherCardEl);
  }
}

function displayTodaysResults(Api) {
  todayResultsEl.style.display = "block";
  todayResultsEl.innerHTML = "";

  let todayEl = document.createElement("h2");
  todayEl.innerText = moment
    .unix(Api.dt + Api.timezone - 39600)
    .format("dddd, Mo MMMM, h:mmA");
  todayResultsEl.appendChild(todayEl);

  let tempNow = document.createElement("div");
  tempNow.innerText = `The temperature now is ${Math.floor(Api.main.temp)} °C`;
  todayResultsEl.appendChild(tempNow);

  let descNow = document.createElement("div");
  descNow.innerText = `It is currently ${Api.weather[0].description}`;
  todayResultsEl.appendChild(descNow);
}

function displayOld(event) {
  if (event.target.matches("button") === true) {
    let thisSearch = element.innerHTML;
    gettingResults(thisSearch);
  }
}

function createList() {
  searchHistoryEl.innerHTML = "";
  if (localStorageSearches != undefined) {
    pastSearch = localStorageSearches;
  }

  if (pastSearch.length > 5) {
    for (let i = 5; i < pastSearch.length; i++) {
      pastSearch.shift();
    }
  }

  for (let i = 0; i < pastSearch.length; i++) {
    let button = document.createElement("button");
    button.innerText = pastSearch[i];

    let li = document.createElement("li");
    li.appendChild(button);

    searchHistoryEl.appendChild(li);
  }
  localStorage.setItem("weatherDashSearches", JSON.stringify(pastSearch));
}

createList();
oldBtn.addEventListener("click", displayOld);
searchFormEl.addEventListener("submit", getInfo);
