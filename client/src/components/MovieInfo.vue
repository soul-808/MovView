<template>
  <div class="movies">
    <h1>Marvel Movies</h1>
    <div>
      <select name="filters" id="filters" v-model="sortBy">
        <option value="year">Year</option>
        <option value="Runtime">Runtime</option>
        <option value="rating">Rating</option>
        <option value="Title">Title</option>
        <option value="">Default</option>
      </select>
    </div>
    <div class="movies-list">
      <div class="movie-card" :key="mov.Title" v-for="mov in movies">
        <div class="poster">
          <img class="poster-img" :src="require('../assets/movie-images/' + mov['imdbID'] + '.jpg')"/>
        </div>
        <div class="information">
          <div class="info flex">
            <p class="info-value info-title" > {{ mov['Title'] + ' (' + mov['Year'] + ')' }}</p>
          </div>
          <div :id="'info-'+ k.name " class="info flex" :key="k.name" v-for="k in keys">
            <p class="info-key" v-if="k.show && k.name !== 'Link'"> {{ k.name }}: </p>&nbsp;
            <p class="info-value" v-if="k.name !== 'Link'"> {{ !k.func ? mov[k.name] : k.func(mov[k.key], mov) }}</p>
            <p class="info-value" v-if="k.name === 'Link'"><a :href="k.func(mov[k.key])">Read more on IMDb</a></p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'MovieInfo',
  data: function() {
    return {
      sortBy: '',
      keys: [
        {
          name: 'Ratings',
          show: true,
          key: 'Ratings',
          func: (v, obj) => {
            let total = 0, len = 0;
            v.forEach((rating) => {
              var values = rating['Value'].replace('/', '$').replace('%', '$').split('$')
              total += (values.length > 1 && values[1] !== "" ?
                  Number.parseFloat(values[0])/Number.parseFloat(values[1]) : Number.parseFloat(values[0])/100);
              len++;
            })
            obj['rating'] = total ? (total/len * 100).toFixed(2) : 0;
            return total ? (total/len * 100).toFixed(2) + '%' : 'None';
          },
        },
        {
          name: 'Runtime',
          show: true,
        },
        {
          name: 'Plot',
          key: 'Plot',
          func: (v) => {
            return v.length > 250 ? v.slice(0,250) + '...' : v;
          }
        },
        {
          name: 'Link',
          key: 'imdbID',
          func: (v) => {
            return 'https://www.imdb.com/title/' + v + '/';
          }
        },
      ],
    }
  },
  props: {
    moviesList: Array,
  },
  computed: {
    movies: function() {
      if (this.sortBy !== '') {
        let temp = _.map(this.moviesList, function(obj) {
          obj['year'] = parseInt(obj['Year']);
          return obj;
        });
        let order = ['rating', 'year'].indexOf(this.sortBy) < 0  ? 'asc' : 'desc';
        return _.orderBy(temp, [this.sortBy, 'Title'], [order]);
      }
      return this.moviesList;
    }
  },
  mounted () {
    this.sortBy = 'rating';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  border-bottom: rgba(100,100,100,.1) 1px solid;
  margin-bottom: 30px;
}
a {
  color: #42b983;
}
.flex {
  display: flex;
  justify-content: center;
}
.movies {
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.movies-list {
  width: 90%;
  display: flex;
  margin: auto;
  flex-wrap: wrap;
  justify-content: center;
}
.movie-card {
  max-width: 300px;
  max-height: 270px;
  min-width: 300px;
  overflow: hidden;
  margin: 20px;
  background-color: rgba(200,200,255, 0.05);
  box-shadow: 0px 1px 15px -2px rgba(0,0,0, 0.2);
  border-radius: 10px;
  padding: 0 15px;
  position: relative;
}
.information {
  padding: 18px 2px;
}
.info {
  margin-bottom: 5px;
}
.info-key, .info-value {
  margin: 0;
  font-size: 18px;
}
.info-title {
  font-size: 22px;
  font-weight: 600;
}
#info-Plot {
  min-height: 150px;
  margin-bottom: 25px;
}
#info-Plot .info-value {
  padding: 0 12px;
}
#info-Link {
  bottom: 0;
  position: absolute;
  margin-bottom: 5px;
  width: 100%;
}
.poster {
  width: 54%;
  height: auto;
  display: flex;
  margin: auto;
}
.poster-img {
  max-width: 100%;
}
select {
  font-size: 20px;
  color: rgba(100,100,100, 1);
  padding: 5px;
  border-radius: 20px;
  border-color: rgba(100,100,100,0.1);
  margin: 5px;
  outline: 0;
}

@media only screen and (min-width: 801px) {
  .movie-card {
    max-height: unset;
    display: block;
    padding: 0;
  }
  .poster {
    width: 100%;
    max-height: 429px;
  }
}

@media only screen and (max-width: 800px) {
  .movie-card {
    max-height: unset;
    display: block;
    padding: 0;
  }
  .poster {
    width: 100%;
  }
}
</style>
