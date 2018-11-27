
require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var userInput = process.argv[2];

var userSearch = process.argv.slice(3).join(" ");

console.log("\nEnter one of the following commands followed by your search criteria: \ndo-what-it-says \nmovie-this \nspotify-this-song \nconcert-this\n\nExample: liri node spotify-this-song amazing\n");

    switch (userInput) {
        case "spotify-this-song":
        searchSpotify(userSearch);
        break;

        case "concert-this":
        searchBandsInTown(userSearch);
        break;

        case "movie-this":
        searchOMDB(userSearch);
        break;

        case "do-what-it-says":
        searchRandom();
        break;

        default:
        
    }

function searchSpotify(songName) {
    let spotify = new Spotify(keys.spotify);


    if(!songName) {
        songName = "The Sign";
    };

    spotify.search({ type: "track", query: songName }, function(error, data) {
        
        if(error) {
            console.log("Error occurred: " + error.code);
            return;
        };
        console.log("\n****************************\n");
        console.log("Artist(s) Name: " + data.tracks.items[0].album.artists[0].name + "\r\n");
        console.log("Song Name: " + data.tracks.items[0].name + "\r\n");
        console.log("Song Preview Link: " + data.tracks.items[0].href + "\r\n");
        console.log("Album: " + data.tracks.items[0].album.name + "\r\n");
        console.log("\n****************************\n");

        var song = "Artist: " + data.tracks.items[0].album.artists[0].name + "\nSong Name: " + data.tracks.items[0].name + 
        "\n Preview Link: " + data.tracks.items[0].href + "\nAlbum Name: " + data.tracks.items[0].album.name + "\n";

        fs.appendFile("log.txt", song, function (error) {
            if (error) throw error;
        });
        results(data);
    });
};

function searchOMDB(movie) {
    
    if (!movie) {
        movie = "Mr. Nobody";
    }
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.request(movieQueryUrl).then(
        function (response, error) {

            if (error) {
                console.log("Error occurred: " + error.code);
                return;
            }
            else {
                console.log("\n****************************\n");
                console.log("Title: " + response.data.Title + "\r\n");
                console.log("Year Released: " + response.data.Year + "\r\n");
                console.log("IMDB Rating: " + response.data.imdbRating + "\r\n");
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\r\n");
                console.log("Country Where Produced: " + response.data.Country + "\r\n");
                console.log("Language: " + response.data.Language + "\r\n");
                console.log("Plot: " + response.data.Plot + "\r\n");
                console.log("Actors: " + response.data.Actors + "\r\n");
                console.log("\n****************************\n");
        
                results(response);
            };
        }
    )
};

function searchBandsInTown(artist) {

    var artist = userSearch;
    var bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    axios.get(bandQueryURL).then(
        function (response, error) {

            if (error) {
                console.log("Error occurred: " + error.code);
                return;
            }
            else {
                console.log("\n****************************\n");
                console.log("Name of the venue: " + response.data[0].venue.name + "\r\n");
                console.log("Venue Location: " + response.data[0].venue.city + "\r\n");
                console.log("Date of event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\r\n");
                console.log("\n****************************\n");
                results(response);
            }
        }
    )
};

function searchRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log("Error occurred: " + error.code);
            return;

        } else {
            console.log(data);
            
        }
    });
};

function results (data) {
    fs.appendFile("log.txt", data, function (error) {
        if (error) throw error;
    });
};