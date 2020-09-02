<template>
  <div id="app">
    <div v-if="movies.length === 0" class="center-btn" v-on:click="getMovies()">
      <img id="enter-btn" class="float-efx" @mouseover="changeAnimate(false)" @mouseleave="changeAnimate(true)" src="./assets/bp-btn.png"/>
      <h1>Click here for Marvel movies</h1>
    </div>
    <MovieInfo v-if="movies.length > 1" :movies-list="movies"/>
  </div>
</template>

<script>
import MovieInfo from './components/MovieInfo.vue';
import $ from 'jquery';
import axios from 'axios';

export default {
  name: 'App',
  data: function () {
    return {
      movies: [],
      animate: true,
      speed: 500,
      count: 1
    }
  },
  components: {
    MovieInfo
  },
  methods: {
    getMovies: function () {
      var self = this;
      axios.get('http://127.0.0.1:3000/api/movies/marvel').then((res) => {
        self.movies = res.data;
      })
    },
    changeAnimate: function(animate) {
      if(animate && this.count < 2) {
        this.speed = this.speed / 1.5;
        if (this.speed < 50) this. speed = 1000;
        this.float($('.float-efx'), this.speed, 15, 25);
        this.animate = true;
        this.count ++;
      }
      else this.animate = false;
    },
    float: function (elm,t,d,v) {
      var i = elm;
      var self = this;
      var runIt = function (elm,t,d,v) {
        elm.animate({top:'+='+v},t,"linear",function(){
          $({deg: -d}).animate({deg: d}, {
            duration: t,
            step: function(now){
              elm.css({
                transform: "rotate(" + now + "deg)"
              });
            }
          },"linear");
          elm.animate({top:'-='+v},t,"linear",function(){
            $({deg: d}).animate({deg: -d}, {
              duration: t,
              step: function(now){
                elm.css({
                  transform: "rotate(" + now + "deg)"
                });
              }
            },"linear");
            if (self.animate && self.count < 2) {
              runIt(elm,t,d,v);
            } else {
              self.count--;
            }

          });
        });
      }
      runIt(i,t,d,v);
    }
  },
  mounted () {
    this.float($('.float-efx'), 1500, 15, 50);
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  justify-content: center;
  height: 100vh;
}
.center-btn {
  margin: auto;
}
.enter-btn:hover, .center-btn:hover{
  opacity: 0.7;
}
</style>
