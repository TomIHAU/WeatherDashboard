var searchFormEl = document.querySelector("#searchForm");
var searchHistoryEl = document.querySelector(".searchHistory");
var resultsEl = document.querySelector(".results");
var oldBtn = document.querySelector("ul");
var todayResultsEl = document.querySelector(".today");
var disTitleEl = document.querySelector("#disTitle");
var oldSearches = JSON.parse(localStorage.getItem("weatherDashSearches"));
var pastSearch = [];

function getInfo(event) {
  event.preventDefault();
  var searchInputVal = document.querySelector("#searchInput").value.trim();

  if (!searchInputVal) {
    console.log("please search for a city");
    return;
  }

  gettingResults(searchInputVal);
}

function gettingResults(searchInput) {
  var searchApi =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    searchInput +
    "&appid=43ae064b43fdce4552702399802b6511&units=metric";

  fetch(searchApi)
    .then(function (response) {
      if (!response.ok) {
        throw error;
      }
      return response.json();
    })
    .then(function (Api) {
      pastSearch.push(searchInput);
      createList();
      displayResults(Api);
    })
    .catch(function (error) {
      console.log(error);
      return;
    });
  var todaysSearch =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchInput +
    "&appid=43ae064b43fdce4552702399802b6511&units=metric";
  fetch(todaysSearch)
    .then(function (response) {
      if (!response.ok) {
        throw error;
      }

      return response.json();
    })
    .then(function (Api) {
      displayTodaysResults(Api);
    })
    .catch(function (error) {
      console.log(error);
      return;
    });
}

function displayResults(Api) {
  resultsEl.innerHTML = "";
  disTitleEl.style.display = "block";
  for (let i = 0; i < Api.list.length; i += 8) {
    var weatherCardEl = document.createElement("div");
    weatherCardEl.classList = "infoCard";

    var dayEl = document.createElement("div");
    dayEl.innerText = moment.unix(Api.list[i].dt).format("dddd");
    weatherCardEl.appendChild(dayEl);

    var dateEl = document.createElement("div");
    dateEl.innerText = moment.unix(Api.list[i].dt).format("DD/MM/YYYY");
    weatherCardEl.appendChild(dateEl);

    var icon = document.createElement("img");
    icon.src =
      "http://openweathermap.org/img/wn/" +
      Api.list[i].weather[0].icon +
      "@2x.png";
    weatherCardEl.appendChild(icon);

    var tempEl = document.createElement("div");
    tempEl.innerText = "Temp: " + Math.round(Api.list[i].main.temp) + " °C";
    weatherCardEl.appendChild(tempEl);

    var windSpeedEl = document.createElement("div");
    windSpeedEl.innerText =
      "Wind: " + Math.round(Api.list[i].wind.speed * 3.6) + " km/h";
    weatherCardEl.appendChild(windSpeedEl);

    var humidityEl = document.createElement("div");
    humidityEl.innerText = "Humidity: " + Api.list[i].main.humidity + " %";
    weatherCardEl.appendChild(humidityEl);

    resultsEl.appendChild(weatherCardEl);
  }
}

function displayTodaysResults(Api) {
  todayResultsEl.style.display = "block";
  todayResultsEl.innerHTML = "";

  var todayEl = document.createElement("h2");
  todayEl.innerText = moment
    .unix(Api.dt + Api.timezone - 39600)
    .format("dddd, Mo MMMM, h:mmA");
  todayResultsEl.appendChild(todayEl);

  var tempNow = document.createElement("div");
  tempNow.innerText =
    "The temperature now is " + Math.floor(Api.main.temp) + " °C";
  todayResultsEl.appendChild(tempNow);

  var descNow = document.createElement("div");
  descNow.innerText = "It is currently " + Api.weather[0].description;
  todayResultsEl.appendChild(descNow);
}

function displayOld(event) {
  var element = event.target;
  if (element.matches("button") === true) {
    var thisSearch = element.innerHTML;

    gettingResults(thisSearch);
  }
}

function createList() {
  searchHistoryEl.innerHTML = "";
  if (oldSearches != undefined) {
    pastSearch = oldSearches;
  }

  if (pastSearch.length > 5) {
    var remove = pastSearch.length;
    for (i = 5; i < remove; i++) {
      pastSearch.shift();
    }
  }

  for (let i = 0; i < pastSearch.length; i++) {
    var button = document.createElement("button");
    button.innerText = pastSearch[i];

    var li = document.createElement("li");
    li.appendChild(button);

    searchHistoryEl.appendChild(li);
  }
  localStorage.setItem("weatherDashSearches", JSON.stringify(pastSearch));
}

createList();
oldBtn.addEventListener("click", displayOld);
searchFormEl.addEventListener("submit", getInfo);
