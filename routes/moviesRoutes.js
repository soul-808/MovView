var express = require('express');
var router = express.Router();
var MovieService = require('../services/MovieService');

/* GET users listing. */
router.get('/marvel', function (req, res, next) {
  MovieService.buildMovieList().then((resp) => {
    res.send(resp);
  });
});

module.exports = router;
