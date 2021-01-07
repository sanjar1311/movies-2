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
}
var elSearchResultCount = $_('.search-result-count');
var elSearchResultParent = $_('.search-count-parent-element');
var elOutputList = $_('.search-results');
var elMovieOutputTemplate = $_('#search-result-template').content;
var elBookmarkOutputList = $_('.bookmarked-movies');


/* ==================== movie larni output qilish funksiyasi ========================= */
var outputMovie = function(array) {
  elOutputList.innerHTML = '';
  var movieItemFragment = document.createDocumentFragment();
  for(var i = 0; i < array.length; i++) {
    elSearchResultCount.textContent = i+1;
    var newItem = elMovieOutputTemplate.cloneNode(true);
    $_('.movie__title', newItem).textContent = array[i].title;
    $_('.movie__year', newItem).textContent = array[i].year;
    $_('.movie__rating', newItem).textContent = array[i].imdb_rating;
    $_('.movie__poster', newItem).src = array[i].youtubeSmallThumbnail;

    movieItemFragment.appendChild(newItem);
    elSearchResultParent.appendChild(elSearchResultCount);
  }
  elOutputList.appendChild(movieItemFragment);

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

  var newTitleArr = movies.filter(function(movie) {
    var isAll = elGenreSelect.value === 'All' || movie.categories.includes(elGenreSelect.value);
    return movie.title.toString().match(newInputValue) && movie.imdb_rating >= Number(elRatingInput.value) && isAll;
  });
  outputMovie(newTitleArr);
});
