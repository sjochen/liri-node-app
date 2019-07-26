require("dotenv").config();

var moment = require('Moment');
var fs = require('fs')
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var axios = require("axios");
var nodeArgs = process.argv;
var command = process.argv[2];
var event = process.argv.splice(3).join(" ");



switch (command) {
    case "movie-this":
        movies(event);
        break;

    case "spotify-this-song":
        song(event);
        break;

    case "concert-this":
        concert(event);
        break;

    case "do-what-it-says":
        voice(event);
        break;
    default:
        console.log('Input layout should look like this: Node liri.js concert-this Matchbox 20"')
}



function movies(event) {
    var queryUrl = "http://www.omdbapi.com/?t=" + event + "&y=&plot=short&apikey=trilogy";

    if (!event) {
        movies('Mr.Nobody');
    }
    else {
        axios.get(queryUrl).then(
            function (response) {
                var data = response.data;

                console.log("The movie's title is: " + data.Title, "\nRelease Year: " + data.Year, "\nIMDB Rating: " + data.imdbRating, "\nMetacritic Rating: " + data.Metascore, "\nLocation Produced: " + data.Production, "\nLanguage: " + data.Language, "\nPlot: " + data.Plot, "\nActors: " + data.Actors);
            }
        );
    }
}

function concert(event) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + event + "/events?app_id=codingbootcamp";
    if (!event) {
        concert('maroon 5');
    } else {
        axios.get(queryUrl).then(
            function (response) {

                var data = response.data;
                for (var i = 0; i < data.length; i++) {
                    console.log("\nVenue Name: " + data[i].venue.name + "\nVenue Location: " + data[i].venue.city + "\nDate of Event: " + moment(data[i].datetime, 'YYYY-MM-DD HH:mm').format('MM/DD/YYY'));
                }
            }
        )
    }
}

function song(event) {
    if (!event) {
        song('The Sign Ace of Base');
    }
    else {
        spotify.search({ type: 'track', query: event }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            } else {
                var songInfo = data.tracks.items[0];

                console.log("\nArtist: " + songInfo.artists[0].name + "\nSong: " + songInfo.name + "\nAlbum: " + songInfo.album.name + "\nPreview: " + songInfo.preview_url);
            };
        });
    }

}

function voice() {
    fs.readFile("random.txt", "utf8", function (error, data) {


        if (error) {
            return console.log(error);
        }


        console.log(data);


        var dataArr = data.split(",");


        console.log(dataArr);

        switch (dataArr[0]) {
            case "movie-this":
                movies(dataArr[1]);
                break;

            case "spotify-this-song":
                song(dataArr[1]);
                break;

            case "concert-this":
                concert(dataArr[1]);
                break;

            case "do-what-it-says":
                voice(dataArr[1]);
                break;
        }

    });

}




