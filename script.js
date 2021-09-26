var searchFormEl = document.querySelector("#searchForm");
var searchHistoryEl = document.querySelector(".searchHistory");
var resultsEl = document.querySelector(".results");
var oldBtn = document.querySelector("ul")
var pastSearch = [];
var pastResult = [];

function getInfo(event){
    event.preventDefault();
    var searchInputVal = document.querySelector("#searchInput").value.trim();
    

    if (!searchInputVal){
        console.log("please search for a city")
        return;
    }

    var searchApi = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInputVal + "&appid=43ae064b43fdce4552702399802b6511&units=metric"
    
    fetch(searchApi)
    .then(function(response){
        if (!response.ok){
            throw(error);
        }
        return response.json()
    })
    .then(function(Api){ 
        pastSearch.push(searchInputVal);
        pastResult.push(Api)
        displayResults(Api);
    })
    .catch(function(error){
        console.log(error);
        return;
      })
}

function displayResults(Api){
    

    resultsEl.innerHTML = "";
    for(let i = 0; i < Api.list.length; i += 8){

        var weatherCardEl = document.createElement('div')
        weatherCardEl.classList = "infoCard";

        var dateEl = document.createElement("h4");
        dateEl.innerText = moment.unix(Api.list[i].dt).format("DD/MM/YYYY");
        weatherCardEl.appendChild(dateEl)

        var icon = document.createElement("img")
        icon.src = "http://openweathermap.org/img/wn/" + Api.list[i].weather[0].icon + "@2x.png"
        weatherCardEl.appendChild(icon)

        var tempEl = document.createElement("div");
        tempEl.innerText = "Temp: " + Math.round(Api.list[i].main.temp) + " °C";
        weatherCardEl.appendChild(tempEl)
        
        var windSpeedEl = document.createElement("div");
        windSpeedEl.innerText ="Wind: " + Math.round(Api.list[i].wind.speed * 3.6) + " km/h"
        weatherCardEl.appendChild(windSpeedEl)

        var humidityEl = document.createElement("div");
        humidityEl.innerText = "Humidity: "+ Api.list[i].main.humidity +" %"
        weatherCardEl.appendChild(humidityEl)
        
        resultsEl.appendChild(weatherCardEl)

        
        
        //console.log(Api.list[i].weather[0].icon)
        //console.log("http://openweathermap.org/img/wn/" + Api.list[i].weather[0].icon + "@2x.png")
        
    }
    createList();
}

function displayOld(event){
    var element = event.target;
    if (element.matches("button") === true) {
        
        var index = element.getAttribute("data-index");
        console.log("hello");
    console.log(index)
    console.log(pastResult[index])
    displayResults(pastResult[index]);
    }
}

function createList(){
    searchHistoryEl.innerHTML = "";
    if(pastSearch.length > 5){
        console.log("hello")
        pastSearch.shift();
        pastResult.shift();
    }
    console.log(pastResult);
    console.log(pastSearch);

    for(let i = 0; i < pastResult.length; i++){
        
        var button = document.createElement("button")
        button.innerText = pastSearch[i];
        button.setAttribute("data-index", i);
        
        var li = document.createElement("li");
        li.appendChild(button)

        searchHistoryEl.appendChild(li);
    }
}

oldBtn.addEventListener("click", displayOld);
searchFormEl.addEventListener("submit", getInfo);
