var $_ = function (selector, node = document) {
  return node.querySelector(selector);
};

var $$_ = function (selector, node = document) {
  return node.querySelectorAll(selector);
};

var createElement = function (tagName, className, text) {
  var element = document.createElement(tagName);
  element.setAttribute('class', className);

  if (text) {
    element.textContent = text;
  }

  return element;
};

var getSmallYoutubeThumbnail = function(youtubeId) {
  return `http://i3.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}
var getBigYoutubeThumbnail = function(youtubeId) {
  return `http://i3.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
}


/* ===================  html elementlar...  ======================= */
var elForm = $_('.js-search-form');
if(elForm) {
  var elTitleInput = $_('.js-search-form__title-input', elForm);
  var elRatingInput = $_('.js-search-form__rating-input', elForm);
  var elGenreSelect = $_('.js-search-form__genre-select', elForm);
  var elFiltreSelect = $_('.js-search-form__sort-select', elForm);
}
var elSearchResultCount = $_('.search-result-count');
var elSearchResultParent = $_('.search-count-parent-element');
var elOutputList = $_('.search-results');
var elBookmarkOutputList = $_('.bookmarked-movies');


/* ==================== movie larni output qilish funksiyasi ========================= */
var displayMovie = function(array) {
  var elMovieOutputTemplate = $_('#search-result-template').content;
  elOutputList.innerHTML = '';
  var movieItemFragment = document.createDocumentFragment();
  for(var i = 0; i < array.length; i++) {
    elSearchResultCount.textContent = i+1;
    var newItem = elMovieOutputTemplate.cloneNode(true);
    $_('.movie__title', newItem).textContent = array[i].title;
    $_('.movie__year', newItem).textContent = array[i].year;
    $_('.movie__rating', newItem).textContent = array[i].imdb_rating;
    $_('.movie__poster', newItem).src = array[i].youtubeSmallThumbnail;
    $_('.js-movie-bookmark', newItem).dataset.movieId = i;

    movieItemFragment.appendChild(newItem);
    elSearchResultParent.appendChild(elSearchResultCount);
  }
  elOutputList.appendChild(movieItemFragment);
}


/* ===========  movie larni bookmarkga qoshish  ============ */
// var addBookmark = function(array) {
//   if(evt.target.match($_('.js-movie-bookmark', newItem))) {
//     var bookmarkTemplate = $_('#bookmarked-movie-template').content;

//     for(var i = 0; i < array.length; i++) {
//       var newBookmarkItem = bookmarkTemplate.cloneNode(true);
//       $_('.bookmarked-movie__title', newBookmarkItem).textContent = array[i].title;
//     }
//   }
// }


/* ===============  inputlarni clear qlish funksiyasi  ================ */
var clearInputs = function() {
  elTitleInput.value = '';
  elRatingInput.value = '';
  elGenreSelect.value = 'All';
}


/* =======================  janrlarni filtrlab olinishi  ============================= */
var janr = [];
for(var i = 0; i < movies.length; i++) {
  for(var j = 0; j < movies[i].categories.length; j++) {
    if(!janr.includes(movies[i].categories[j])) {
      janr.push(movies[i].categories[j]);
    }
  }
}
/* =====================  janrlar un option yaratilib selectga qoshib qoyildi  =========================== */
for(var i = 0; i < janr.length; i++) {
  var elGenreOption = document.createElement('option');
  elGenreOption.textContent = janr[i];
  elGenreSelect.appendChild(elGenreOption);
}


elForm.addEventListener('submit', function(evt) {
  evt.preventDefault();

  var newInputValue = new RegExp(elTitleInput.value, 'gi');

  if(elFiltreSelect.value === 'rating_desc') {
    var selectedFiltr = movies.sort(function(a, b) {
      if(a.imdb_rating < b.imdb_rating) {
        return 1;
      }
      if(a.imdb_rating > b.imdb_rating) {
        return -1;
      }
      return 0;
    });
    displayMovie(elFiltreSelect);
  }
  if(elFiltreSelect.value === 'az') {
    var newSort = movies.sort(function(a, b) {
      if(a.title > b.title) {
        return 1;
      }
      if(a.title < b.title) {
        return -1;
      }
      return 0;
    });
    displayMovie(newSort);
  }
  if(elFiltreSelect.value === 'za') {
    var newSort = movies.sort(function(a, b) {
      if(a.title < b.title) {
        return 1;
      }
      if(a.title > b.title) {
        return -1;
      }
      return 0;
    });
    displayMovie(newSort);
  }
  if(elFiltreSelect.value === 'year_desc') {
    var newSort = movies.sort(function(a, b) {
      if(a.year < b.year) {
        return 1;
      }
      if(a.year > b.year) {
        return -1;
      }
      return 0;
    });
    displayMovie(newSort);
  }
  if(elFiltreSelect.value === 'year_asc') {
    var newSort = movies.sort(function(a, b) {
      if(a.year > b.year) {
        return 1;
      }
      if(a.year < b.year) {
        return -1;
      }
      return 0;
    });
    displayMovie(newSort);
  }
  if(elFiltreSelect.value === 'rating_asc') {
    var newSort = movies.sort(function(a, b) {
      if(a.imdb_rating > b.imdb_rating) {
        return 1;
      }
      if(a.imdb_rating < b.imdb_rating) {
        return -1;
      }
      return 0;
    });
    displayMovie(newSort);
  }



  var newTitleArr = movies.filter(function(movie) {
    var isAll = elGenreSelect.value === 'All' || movie.categories.includes(elGenreSelect.value);
    return movie.title.toString().match(newInputValue) && movie.imdb_rating >= Number(elRatingInput.value) && isAll && selectedFiltr || newSort;
  });
  displayMovie(newTitleArr);
  // clearInputs();




});



if(elOutputList) {
  elOutputList.addEventListener('click', function() {
    addBookmark(newTitleArr);
  });
}