var searchFormEl = document.querySelector("#searchForm");
var searchHistoryEl = document.querySelector(".searchHistory");

function getInfo(event){
    event.preventDefault();
    var searchInputVal = document.querySelector("#searchInput").value.trim();

    if (!searchInputVal){
        console.log("please search for a city")
        return;
    }

    var findLL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInputVal + "&appid=43ae064b43fdce4552702399802b6511&units=metric"
    console.log(findLL);

    fetch(findLL)
    .then(function(response){
        if (!response){
            throw(error);
        }
        return response.json()
    })
    .then(function(LLApi){
        
        var location = "https://api.openweathermap.org/data/2.5/onecall?lat=" + LLApi.city.coord.lat + "&lon=" +LLApi.city.coord.lon  + "&appid=43ae064b43fdce4552702399802b6511&units=metric"
        console.log(location) 
        fetch(location)
        .then(function(response){
            if (!response){
                throw(error);
            }
            return response.json()
        }).then(function(Api){
                console.log(Api)
            // for(let i = 0; i < Api.list.length; i += 8){
            // console.log(moment.unix(Api.list[i].dt).format("LLLL"))}
        })



        
    
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