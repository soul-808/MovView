const axios = require('axios').default;
const mongoose = require('mongoose');
var Movie = require('../models/Movie');
var Utils = require('../utils/util');
mongoose.connect('mongodb://localhost/MovView');

const apikey = process.argv[2];
const imgPath = 'client/src/assets/movie-images/';
var imdbIds = [
  'tt0371746',
  'tt1228705',
  'tt0800080',
  'tt0800369',
  'tt0458339',
  'tt0848228',
  'tt1300854',
  'tt1981115',
  'tt1843866',
  'tt2015381',
  'tt2395427',
  'tt0478970',
  'tt3498820',
  'tt1211837',
  'tt3896198',
  'tt2250912',
  'tt3501632',
  'tt1825683',
  'tt4154756',
  'tt5095030',
  'tt4154664',
  'tt4154796',
  'tt6320628',
  'tt6791350',
];

function buildMovieList () {
  let len = imdbIds.length;
  const moviesList = [];
  function pushMovieToList(mov, resolve) {
    let path = imgPath + mov['imdbID'] + '.jpg';
    moviesList.push(mov);
    Utils.downloadImage(mov['Poster'], path);
    if (moviesList.length === len) {
      resolve(moviesList);
    }
  }
  return new Promise(function (resolve, reject) {
    for (const m of imdbIds) {
      try {
        Movie.findOne({imdbID: m}, (err, movie) => {
          if (!movie) {
            axios.get('http://www.omdbapi.com/?' +
              'apikey=' + apikey +
              '&i=' + m +
              '&plot=full'
            ).then((res) => {
              new Movie(res.data).save();
              pushMovieToList(res.data, resolve);
            });
          } else if (movie) {
            pushMovieToList(movie, resolve);
          }
          if (err) {
            console.log(err);
          }
        });
      } catch (err) {
        len--;
        console.log(err);
        if (moviesList.length === len) {
          resolve(moviesList);
        }
      }
    }
  });
};

const MovieService = {
  buildMovieList: buildMovieList,
};

module.exports = MovieService;