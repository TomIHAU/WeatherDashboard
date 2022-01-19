const searchFormEl = document.querySelector("#searchForm");
const searchHistoryEl = document.querySelector(".searchHistory");
const resultsEl = document.querySelector(".results");
const oldBtn = document.querySelector("ul");
const todayResultsEl = document.querySelector(".today");
const disTitleEl = document.querySelector("#disTitle");
let localStorageSearches = JSON.parse(
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
  console.log(Api);
  resultsEl.innerHTML = "";
  disTitleEl.style.display = "block";
  //increments through one in eight, which is 24 hours apart, return only one result per day.
  for (let i = 0; i < Api.list.length; i += 8) {
    let weatherCardEl = document.createElement("div");
    weatherCardEl.classList = "infoCard";
    weatherCardEl.innerHTML = `<div class="infoTop">
    <div>${moment.unix(Api.list[i].dt).format("ddd").toUpperCase()}</div>
    <div>${moment
      .unix(Api.list[i].dt)
      .format("MMM D")
      .toUpperCase()}</div></div>
    <img src="http://openweathermap.org/img/wn/${
      Api.list[i].weather[0].icon
    }@2x.png">
    <div>Temp: ${Math.round(Api.list[i].main.temp)} °C</div>
    <div>Wind: ${Math.round(Api.list[i].wind.speed * 3.6)} km/h</div>
    <div>Humidity: ${Api.list[i].main.humidity} %</div>
    `;

    resultsEl.appendChild(weatherCardEl);
  }
}

function displayTodaysResults(Api) {
  todayResultsEl.style.display = "block";
  todayResultsEl.innerHTML = `
  <h2>Today</h2>
  <h2>${moment
    .unix(Api.dt + Api.timezone - 39600)
    .format("dddd, Mo MMMM, h:mmA")}</h2>
  <div>The temperature now is ${Math.floor(Api.main.temp)} °C</div>
  <div>It is currently ${Api.weather[0].description}</div>
  `;
}

function displayOld(event) {
  if (event.target.matches("button") === true) {
    let thisSearch = event.target.innerHTML;
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
