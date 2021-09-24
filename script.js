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
        console.log(moment.unix(Api.list[i].dt).format("LLLL"))
    }
    })
}

function displayResults(){
    
}
//api.openweathermap.org/data/2.5/weather?q=London&appid={API key}
//apikey = 43ae064b43fdce4552702399802b6511
//&units=metric



searchFormEl.addEventListener("submit", getInfo);