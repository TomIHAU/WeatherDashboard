var searchFormEl = document.querySelector("#searchForm");
var searchHistoryEl = document.querySelector(".searchHistory");

function getInfo(event){
    event.preventDefault();
    var searchInputVal = document.querySelector("#searchInput").value.trim();

    console.log(searchInputVal);

    if (!searchInputVal){
        console.log("please search for a city")
        return;
    }

    var searchApi = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInputVal + "&appid=43ae064b43fdce4552702399802b6511&units=metric"
    console.log(searchApi);

    fetch(searchApi)
    .then(function(response){
        if (!response){
            throw(error);
        }
        return response.json()
    })
    .then(function(Api){
        console.log(Api)
        for(let i = 0; i < Api.list.length; i += 8){
            console.log(Api.list[i].weather[0].icon)
        console.log("http://openweathermap.org/img/wn/" + Api.list[i].weather[0].icon + "@2x.png")
        console.log(moment.unix(Api.list[i].dt).format("DD/MM/YYYY"))
        console.log(Math.round(Api.list[i].main.temp))
        console.log(Api.list[i].main.humidity)
        console.log(Math.round(Api.list[i].wind.speed * 3.6))
    }
    })
}

function displayResults(){
    
}
//api.openweathermap.org/data/2.5/weather?q=London&appid={API key}
//apikey = 43ae064b43fdce4552702399802b6511
//&units=metric
/////  the temperature,         list[i].main.temp
///the humidity,                list[i].main.humidity

//the wind speed,                list[i].wind.speed
//and the UV index    


searchFormEl.addEventListener("submit", getInfo);