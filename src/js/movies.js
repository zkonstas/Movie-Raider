var api_key = {
  'api-key' : "<API-KEY>"
}

var artparam = {
  'api-key' : "<API-KEY>"
}

var mostpop = {
  'api-key' : "<API-KEY>"
}

var movkey = {
  'api-key' : "<API-KEY>"
}
var apikey = "<API-KEY>";
var apikey1 = "<API-KEY>";
var apikey2 = "<API-KEY>";
var apikey3 = "<API-KEY>";
var apikeys = [apikey, apikey1, apikey2, apikey3];
var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";

var nytkeys = ["<API-KEY>", "<API-KEY>", "<API-KEY>"];

var showtimekey = "<API-KEY>";

var movies = [];

var moviesAdded = [];

var limit = 20;
var mObj = [];

var queueOffset = 100;

$('#zip').click(function() {
  $('#zip').val('');
})

$('#date').click(function() {
  $('#date').val('');
})

var main = function() {

  var div = '#movies';
  $(div).append('<img src="images/loading.gif" id="loading-indicator" />');
  getRTReviews(apikeys[0], 1);
  if(typeof(Storage) !== "undefined")
  {
    if (localStorage.getItem("queue") !== null) {
      var queue = JSON.parse(localStorage.getItem("queue"));
      var i;
      if (queue.length == 0)
      {
        $('#queue').append('<h4 id="addtext"><center>Add movies to selection.</center></h4>');
      }
      for(i=0; i<queue.length; i++) {
        addToQueue(null, queue[i]);
      }
    }
  }
  else 
  {
    console.log("Browser does not support storage");
  }

  $("#mostpop").click(function() {
    $("#movies").empty();
    mObj.length = 0;
    var div = '#movies';
    $(div).append('<img src="images/loading.gif" id="loading-indicator" />');
    getRTReviews(apikeys[0], 1);
  });

  $("#queue").on('mouseenter', '.qitem', function(event) {
    var movie = $(this);
    var button = movie.children()[0];
    $(button).show();
  });

  $("#queue").on('mouseleave', '.qitem', function(event) {
    var movie = $(this);
    var button = movie.children()[0]
    $(button).hide();
  });

  $("#queue").on('click', '.rem', function(event) {
    var movie = $(this).parent();
    var movietext = $(this).next().children()[1];
    var movieName = movie[0].innerText;
    removeFromQueue(movieName.substr(2, movieName.length-3), movie);
  });
}

var removeFromQueue = function(movieName, movie) {
  movie.remove();
  var index = -1;
  
  $.each(moviesAdded, function(i, mov) {

    if(mov.movieName.toLowerCase()==movieName.toLowerCase()) {
      index = i;
    }

  });
  var newName = movieName.replace(/[\.,-\/#!'?$%\^&\*;:{}=\-_`~()]/g,"").replace(/ /g,'');
  console.log(newName);
  if(index>-1) {
    moviesAdded.splice(index, 1);
    localStorage.setItem("queue", JSON.stringify(moviesAdded));
    index++;
    $("#myModal"+newName).remove();
  }
  if (moviesAdded.length == 0)
  {
    $('#queue').append('<h4 id="addtext"><center>Add movies to selection.<center></h4>');
  }
}

var addToQueue = function(index, mObject) {

  if ($('#addtext').length > 0)
  {
    $('#addtext').remove();
  } 
  if(moviesAdded.length+1 > 11) {
    alert("Maximum number of movies allowed in selection is 11!");
  }

  var fromStorage = 0;
  var prevSaved = 0;

  if(index==null && mObject!=null) {
    fromStorage = 1;
  }
  else {
    $.each(moviesAdded, function(i, data) {
     if(data.movieName.toLowerCase()===mObj[index].movieName.toLowerCase()) {
      prevSaved = 1;
    }
  });
  }

  if(prevSaved==0 && moviesAdded.indexOf(mObj[index])==-1 && moviesAdded.length<11) {
    var movie;

    if(fromStorage) {
     movie = mObject;
   }
   else {
     movie = mObj[index];	
   }

		//save movie added
    moviesAdded[moviesAdded.length]=movie;

    var title = movie.movieName;
    var newName = movie.movieName.replace(/[\.,-\/#!'?$%\^&\*;:{}=\-_`~()]/g,"").replace(/ /g,'');
    console.log(newName);

     // if(title.length>25) {
     //  title = title.substr(0,25)+"...";
     // }


     var imageUrl = movie.img;
     var i = moviesAdded.length;
     var j = i+queueOffset;

     var item="";
     item += "<div class=\"qitem\">";
     item += "<button type=\"button\" class=\"btn btn-danger btn-circle rem\" aria-label=\"Left Align\">";
     item += "<span class=\"glyphicon glyphicon-remove-sign\" aria-hidden=\"true\"><\/span>";
     item += "<\/button>";
     item += "<div data-toggle='modal' data-target=\"#myModal"+newName+"\">";
     item += "<img class=\"qimage\" src=\""+imageUrl+"\" \/>";
     item += "<div class=\"qtext\">";
     item += title;
     item += "<\/div>";
     item += "<\/div>";
     item += "<\/div>";

     $("#queue").append(item);

     if(typeof(Storage) !== "undefined") {
       localStorage.setItem("queue", JSON.stringify(moviesAdded));
     }
     else {
       console.log("Browser does not support storage");
     }


     var contents =
     '<div class="row">'+
     '<div class="col-sm-2">'+
     '<img src='+movie.img+' alt="Movie Poster" height="115" width="90">'+
     '</div>'+
     '<div class="col-sm-10">'+
     '<p><span style="font-size: 16px; font-weight: bold;">'+ movie.movieName +' </span><span style="color: #707070; font-size: 12px">'+movie.releaseDate+'</span>'+
     '<br><b>MPA Rating: </b>'+movie.mpaRating+'<b> Runtime: </b>'+movie.runtime+ " min"+
     '<br><b>Synopsis: </b>'+movie.synopsis+
     '</p>'+
     '<a href="'+movie.trailer+'" target="_blank">'+'Trailers'+'</a>'+
     '</div>'+
     '</div>'+
     '<div class="panel panel-default">'+
     '<div class="panel-heading" role="tab" id="heading'+j+'">'+
     '<h6 class="panel-title">'+
     '<a class="collapsed" data-toggle="collapse" data-parent="#accordion'+j+'" href="#collapse'+j+'" aria-expanded="false" aria-controls="collapse'+j+'" onclick="getReviewsQueue('+j+');">'+
     'Reviews: '+
     '</a>'+
     '</h4>'+
     '</div>'+
     '<div id="collapse'+j+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading'+j+'">'+
     '<div class="panel-body" id="reviews'+j+'">'+
               //contents2+
               '</div>'+
               '</div>'+
               '</div>';
        //   '</div>'+
        // '</div>';

        var modalString = 
        '<div class="modal fade" id="myModal'+newName+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
        '<div class="modal-dialog">'+
        '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
        '<h4 class="modal-title" id="myModalLabel">'+movie.movieName+'</h4>'+
        '</div>'+
        '<div class="modal-body">'+
        contents+
        '</div>'+
        '<div class="modal-footer">'+
        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>';

        $(".queueModals").append(modalString);
      }
      else if((prevSaved==1 || moviesAdded.indexOf(mObj[index])!=-1) && moviesAdded.length<11) {
        alert("This movie is already added in your selection");
      }

    }

    function getReviewsQueue(i) {
      var div = '#reviews'+i;
      if(!($(div).is(':empty'))) {
        return;
      }
      i = i - queueOffset-1;
      var movie_id = moviesAdded[i]['id'];
      var param_apikey = apikeys[1];
      url = 'http://api.rottentomatoes.com/api/public/v1.0/movies/' 
      + movie_id +  '/reviews.json?apikey=' + param_apikey;
      $.ajax({
        'type' : "GET", 
        'url': url,
        'cache': true,
        'dataType': 'jsonp',
        'success': function(data, textStats, XMLHttpRequest){
          var reviewsString = "";
          reviews = data['reviews'];
          if(reviews.length==0) {
            reviewsString = "No reviews found.";
          }
          for (var j = 0; j < 3 && j<reviews.length; j++)
          { 
            var quote = "No quote available.";
            if(reviews[j]['quote']) {
              quote = '"'+ reviews[j]['quote']+'"';
            }
            var link = "No link available.";
            if (reviews[j]['links']['review']) {
              link = '<a href="'+reviews[j]['links']['review'] + '" target="_blank">Link</a>';
            }
            if ((reviews[j]['quote'] || reviews[j]['links']['review'])) {
              reviewsString = reviewsString + quote + " " + link + '<br>';
            }
          }

      var c_string = "";
      if(parseInt(moviesAdded[i]['criticsScore'])<=60) {
        c_string = '<img src="images/rotten.png" alt="rotten" height="15" width="15">'+" "+moviesAdded[i]['criticsScore'] + "%";
      } else {
        c_string = '<img src="images/fresh.png" alt="fresh" height="15" width="15">'+" "+moviesAdded[i]['criticsScore'] + "%";
      }
      var a_string;
      if(parseInt(moviesAdded[i]['audienceScore'])<=60) {
        a_string = '<img src="images/rotten.png" alt="rotten" height="15" width="15">'+" "+moviesAdded[i]['audienceScore'] + "%";
      } else {
        a_string = '<img src="images/fresh.png" alt="fresh" height="15" width="15">'+" "+moviesAdded[i]['audienceScore'] + "%";
      }
      var t_string = "";
      if(moviesAdded[i]['thousandsbest']==="Yes") {
        t_string = moviesAdded[i]['thousandsbest']+" "+'<img src="images/check.png" alt="check mark" height="15" width="15">';
      } else {
        t_string = moviesAdded[i]['thousandsbest'];
      }
      var contents= 
                '<div class="Reviews">'+
                  '<div class="title_box" id="rotTom">'+
                      '<div id="title"><b>Rotten Tomatoes</b></div>'+
                      '<div id="content">'+
                          '<p><b>Critics Score: </b>'+c_string+'<b> Audience Score: </b>'+a_string+
                          '<br><b>Selected Critics Reviews: </b><br>'+reviewsString+'</p>'+
                      '</div>'+
                  '</div>'+
                  '<p><br></p>'+
                  '<div class="title_box" id="NYTTom">'+
                      '<div id="title"><b>New York Times Review</b></div>'+
                      '<div id="content">'+
                          '<p><b>Thousands Best: </b>'+t_string+
                          '<br><b>Review: </b>'+'<a href="'+moviesAdded[i]['nytLink']+'">'+moviesAdded[i]['nytTitle']+'</a>'+
                          '<br>"'+moviesAdded[i]['nytreview']+'"'+
                          '</p>'+
                      '</div>'+
                  '</div>'+
                '</div>';
        $(div).append(contents);
    }
  });
}

function parseMovie(i)
{
  var JSON_movie = movies[i];
  var thousand_best = 'No';
  if (JSON_movie['thousand_best'] && JSON_movie['thousand_best'] == 1)
  {
    thousand_best = 'Yes';
  }
  var title = JSON_movie['headline'];
  var review_url = JSON_movie['link']['url'];
  var summary = 'Summary Not Found';
  if(JSON_movie['summary_short'])
  {
    summary = JSON_movie['summary_short'];
  }
  else if(JSON_movie['capsule_review'])
  {
    summary = JSON_movie['capsule_review'];
  }
  var related_urls = JSON_movie['related_urls'];
  var trailer1 = "";
  for (var i = 0; i < related_urls.length; i++)
  {
    if (related_urls[i] && related_urls[i]['type'] == 'trailers')
    {
      trailer1 = related_urls[i]['url'];
    }
  }
  mObj.push({movieName: "", mpaRating: "", runtime: "", criticCons: "", trailer: trailer1,
    synopsis: "", criticsScore: "", audienceScore: "", releaseDate: "", img: "", thousandsbest: thousand_best, nytreview: summary, nytTitle: title, nytLink: review_url, id:0});
}

function getMovies() {
  var i;
  for(i=0; i<movies.length; i++)
  {
    var keyword = movies[i]['display_title'];
    parseMovie(i); 
    var passkey = apikeys[i % 4];
    getRT(keyword, passkey, i);
  }

}


function handle(e)
{
 var key=e.keyCode || e.which;
 if (key==13){
   searchMovies();
 }
}

function searchMovies() {
  var div = '#movies';
  $(div).empty();
  $(div).append('<img src="images/loading.gif" id="loading-indicator" />');
  mObj.length=0;
  var keyword = $('#search').val();
  var url = 'http://api.nytimes.com/svc/movies/v2/reviews/search.jsonp?query='+keyword+'&api-key=b5c06f77f4bd3bc6d762aaf3259089c9:11:67621633';
  $.ajax({
    'url' : url,
    'dataType' : 'jsonp',
    'jsonpCallback' : 'cb',
    'cache': true,
    'success' : function(data, textStats, XMLHttpRequest) {
      movies.length = 0;
      $.merge(movies, data.results);
      var i;
      for(i=0; i<movies.length; i++)
      {
        var keyword = movies[i]['display_title'];
        parseMovie(i); 
        var passkey = apikeys[i % 4];
        getRT(keyword, passkey, i);
      }
      if (movies.length == 0)
      {
        $("#movies").append('<h4> No Movies Found :( </h4>');
      }
      $('#loading-indicator').remove();
    }
  });
}

function getRT(movie_name, apikey, j){

  var moviesSearchUrl = baseUrl + '/movies.json?apikey=' + apikey;
  $.ajax({
    'type' : "GET", 
    'url': moviesSearchUrl + '&q=' + encodeURI(movie_name),
    'cache': true,
    'dataType': 'jsonp',
    'success': function(data, textStats, XMLHttpRequest)
    {
      var movies = data['movies'];
      var my_movie = null;
      for (var i = 0; i < movies.length; i++)
      {
        if (movies[i]['title'].toLowerCase() == movie_name.toLowerCase())
        {
          my_movie = movies[i];
          break;
        }
      }
      if (!my_movie)
      {
        my_movie = movies[0];
      }
      if(!my_movie) {
        return;
      }
      var movie_id = my_movie['id'];
      var c_score = my_movie['ratings']['critics_score']; 
      var a_score = my_movie['ratings']['audience_score']; 
      var year = my_movie['year']; 
      var rating1 = my_movie['mpaa_rating']; 
      var runtime1 = my_movie['runtime'];
      var review_summary = "Not Found. ";
      if(my_movie['critics_consensus']) {
        review_summary = my_movie['critics_consensus'];
      }
      var synopsis1 = "Not Found.";
      if(my_movie['synopsis']) {
        var synopsis1 = my_movie['synopsis'];
      }
      var images = my_movie['posters'];
      var image = null; 
      if (images['thumbnail'])
      {
        image = images['thumbnail'];
      }
      else if (images['profile'])
      {
        image = images['profile'];
      }
      else if (images['detailed'])
      {
        image = images['detailed'];
      }
      else if (images['original'])
      {
        image = images['original'];
      }
      var contents = 
      '<div class="movie">'+
      '<div class="panel panel-default">'+
      '<div class="panel-body">'+
      '<div class="row">'+
      '<div class="col-md-2">'+
      '<img src='+image+' alt="Movie Poster" height="125" width="100">'+
      '</div>'+
      '<div class="col-md-10">'+
      '<p><span style="font-size: 16px; font-weight: bold;">'+ movie_name +' </span><span style="color: #707070; font-size: 12px">'+year+'</span>'+
      '<br><b>MPA Rating: </b>'+rating1+'<b> Runtime: </b>'+runtime1+ " min"+
      '<br><b>Synopsis: </b>'+synopsis1+
      '</p>'+
      '<a href="'+mObj[j]['trailer']+'" target="_blank">'+'Trailers'+'</a>'+
      '</div>'+
      '</div>'+
      '<div class="panel panel-default">'+
      '<div class="panel-heading" role="tab" id="heading'+j+'">'+
      '<h6 class="panel-title">'+
      '<a class="collapsed" data-toggle="collapse" data-parent="#accordion'+j+'" href="#collapse'+j+'" aria-expanded="false" aria-controls="collapse'+j+'" onclick="getReviews('+j+');">'+
      'Reviews: '+
      '</a>'+
      '</h4>'+
      '</div>'+
      '<div id="collapse'+j+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading'+j+'">'+
      '<div class="panel-body" id="reviews'+j+'">'+
               //contents2+
               '</div>'+
               '</div>'+
               '</div>'+
               '<button type="button" class="btn btn-info" data-toggle="tooltip" data-placement="right" title="Add to your selection" onclick="addToQueue('+j+');">Add</button>'
               '</div>'+
               '</div>'+
               '</div>';

               $("#movies").append(contents);

               mObj[j]['movieName'] = movie_name;
               mObj[j]['mpaRating'] = rating1;
               mObj[j]['runtime'] = runtime1;
               mObj[j]['criticCons'] = review_summary;
               mObj[j]['synopsis'] = synopsis1;
               mObj[j]['criticsScore'] = c_score;
               mObj[j]['audienceScore'] = a_score;
               mObj[j]['releaseDate'] = year;
               mObj[j]['img'] = image;
               mObj[j]['id'] = movie_id;    
             },
             'error': function (request, status, error) {

              console.log('RottenTomatoes Outer API Call Error');
            }
          });
}

function getReviews(i) {
  var div = '#reviews'+i;
  if(!($(div).is(':empty'))) {
    return;
  }
  var movie_id = mObj[i]['id'];
  var param_apikey = apikeys[1];
  url = 'http://api.rottentomatoes.com/api/public/v1.0/movies/' 
  + movie_id +  '/reviews.json?apikey=' + param_apikey;
  $.ajax({
    'type' : "GET", 
    'url': url,
    'cache': true,
    'dataType': 'jsonp',
    'success': function(data, textStats, XMLHttpRequest){
      var reviewsString = "";
      reviews = data['reviews'];
      if(reviews.length==0) {
        reviewsString = "No reviews found.";
      }
      for (var j = 0; j < 3 && j<reviews.length; j++)
      { 
        var quote = "No quote available.";
        if(reviews[j]['quote']) {
          quote = '"'+ reviews[j]['quote']+'"';
        }
        var link = "No link available.";
        if (reviews[j]['links']['review']) {
          link = '<a href="'+reviews[j]['links']['review'] + '" target="_blank">Link</a>';
        }
        if ((reviews[j]['quote'] || reviews[j]['links']['review'])) {
          reviewsString = reviewsString + quote + " " + link + '<br>';
        }
      }
      var c_string = "";
      if(parseInt(mObj[i]['criticsScore'])<=60) {
        c_string = '<img src="images/rotten.png" alt="rotten" height="15" width="15">'+" "+mObj[i]['criticsScore'] + "%";
      } else {
        c_string = '<img src="images/fresh.png" alt="rotten" height="15" width="15">'+" "+mObj[i]['criticsScore'] + "%";
      }
      var a_string;
      if(parseInt(mObj[i]['audienceScore'])<=60) {
        a_string = '<img src="images/rotten.png" alt="rotten" height="15" width="15">'+" "+mObj[i]['audienceScore'] + "%";
      } else {
        a_string = '<img src="images/fresh.png" alt="rotten" height="15" width="15">'+" "+mObj[i]['audienceScore'] + "%";
      }
      var t_string = "";
      if(mObj[i]['thousandsbest']==="Yes") {
        t_string = mObj[i]['thousandsbest']+" "+'<img src="images/check.png" alt="check mark" height="15" width="15">';
      } else {
        t_string = mObj[i]['thousandsbest'];
      }
      var contents= 
                '<div class="Reviews">'+
                  '<div class="title_box" id="rotTom">'+
                      '<div id="title"><b>Rotten Tomatoes</b></div>'+
                      '<div id="content">'+
                          '<p><b>Critics Score: </b>'+c_string+'<b> Audience Score: </b>'+a_string+
                          '<br><b>Selected Critics Reviews: </b><br>'+reviewsString+'</p>'+
                      '</div>'+
                  '</div>'+
                  '<p><br></p>'+
                  '<div class="title_box" id="NYTTom">'+
                      '<div id="title"><b>New York Times Review</b></div>'+
                      '<div id="content">'+
                          '<p><b>Thousands Best: </b>'+t_string+
                          '<br><b>Review: </b>'+'<a href="'+mObj[i]['nytLink']+'">'+mObj[i]['nytTitle']+'</a>'+
                          '<br>"'+mObj[i]['nytreview']+'"'+
                          '</p>'+
                      '</div>'+
                  '</div>'+
                '</div>';
        $(div).append(contents);
//       '<div class="Reviews">'+
//       '<div class="title_box" id="rotTom">'+
//       '<div id="title"><b>Rotten Tomatoes</b></div>'+
//       '<div id="content">'+
//       '<p><b>Critics Score: </b>'+mObj[i]['criticsScore']+'<b> Audience Score: </b>'+mObj[i]['audienceScore']+
//       '<br><b>Selected Critics Reviews: </b><br>'+reviewsString+'</p>'+
//       '</div>'+
//       '</div>'+
//       '<p><br></p>'+
//       '<div class="title_box" id="NYTTom">'+
//       '<div id="title"><b>New York Times Review</b></div>'+
//       '<div id="content">'+
//       '<p><b>Thousands Best: </b>'+mObj[i]['thousandsbest']+
//       '<br><b>Review: </b>'+'<a href="'+mObj[i]['nytLink']+'">'+mObj[i]['nytTitle']+'</a>'+
//       '<br>"'+mObj[i]['nytreview']+'"'+
//       '</p>'+
//       '</div>'+
//       '</div>'+
//       '</div>'
//       $(div).append(contents);
// >>>>>>> 429b61df49c95cb4e55776db14ee8e242d2c4391
    }
  });
}

function getNYTReviews(j, apikey)
{
  var keyword = mObj[j]['movieName'];
  var url = 'http://api.nytimes.com/svc/movies/v2/reviews/search.jsonp?query='+keyword+'&api-key=' + apikey;
  $.ajax({
    'url' : url,
    'dataType' : 'jsonp',
    'cache': true,
    'success' : function(data, textStats, XMLHttpRequest) {
      var my_movies = data['results'];
      for (var i = 0; i < my_movies.length; i++)
      {
        if (my_movies[i]['display_title'].toLowerCase() === keyword.toLowerCase())
        {
          parseMovieNYT(j, my_movies[i]);
          return;
        }
      }
    }
  });
}

function parseMovieNYT(i, JSON_movie)
{
  var thousand_best = 'No';
  if (JSON_movie['thousand_best'] && JSON_movie['thousand_best'] == 1)
  {
    thousand_best = 'Yes';
  }
  var title = JSON_movie['headline'];
  var review_url = JSON_movie['link']['url'];
  var summary = 'Summary Not Found';
  if(JSON_movie['summary_short'])
  {
    summary = JSON_movie['summary_short'];
  }
  else if(JSON_movie['capsule_review'])
  {
    summary = JSON_movie['capsule_review'];
  }
  var related_urls = JSON_movie['related_urls'];
  var trailer1 = "";
  for (var j = 0; j < related_urls.length; j++)
  {
    if (related_urls[j] && related_urls[j]['type'] == 'trailers')
    {
      trailer1 = related_urls[j]['url'];
    }
  }
  mObj[i]['thousandsbest'] = thousand_best;
  mObj[i]['trailer'] = trailer1;
  mObj[i]['nytreview'] = summary;
  mObj[i]['nytTitle'] = title;
  mObj[i]['nytLink'] = review_url;
  var contents = 
  '<div class="movie">'+
  '<div class="panel panel-default">'+
  '<div class="panel-body">'+
  '<div class="row">'+
  '<div class="col-md-2">'+
  '<img src="'+mObj[i]['img']+'" alt="Movie Poster" height="125" width="100">'+
  '</div>'+
  '<div class="col-md-10">'+
  '<p><span style="font-size: 16px; font-weight: bold;">'+ mObj[i]['movieName'] +' </span><span style="color: #707070; font-size: 12px">'+mObj[i]['releaseDate']+'</span>'+
  '<br><b>MPA Rating: </b>'+mObj[i]['mpaRating']+'<b> Runtime: </b>'+mObj[i]['runtime']+ " min"+
  '<br><b>Synopsis: </b>'+mObj[i]['synopsis']+
  '</p>'+
  '<a href="'+mObj[i]['trailer']+'" target="_blank">'+'Trailers'+'</a>'+
  '</div>'+
  '</div>'+
  '<div class="panel panel-default">'+
  '<div class="panel-heading" role="tab" id="heading'+i+'">'+
  '<h6 class="panel-title">'+
  '<a class="collapsed" data-toggle="collapse" data-parent="#accordion'+i+'" href="#collapse'+i+'" aria-expanded="false" aria-controls="collapse'+i+'" onclick="getReviews('+i+');">'+
  'Reviews: '+
  '</a>'+
  '</h4>'+
  '</div>'+
  '<div id="collapse'+i+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading'+i+'">'+
  '<div class="panel-body" id="reviews'+i+'">'+
             //contents2+
             '</div>'+
             '</div>'+
             '</div>'+
             '<button type="button" class="btn btn-info" data-toggle="tooltip" data-placement="right" title="Add to your selection" onclick="addToQueue('+i+');">Add</button>'
             '</div>'+
             '</div>'+
             '</div>';
             if ($('#loadMore').length > 0)
             {
              $(contents).insertBefore('#loadMore');
            }
            else 
            {
             $("#movies").append(contents);
           }
         }

         function parseMoviesRT(my_movie){
          var movie_title = my_movie['title'];
          var movie_id = my_movie['id'];
          var c_score = my_movie['ratings']['critics_score']; 
          var a_score = my_movie['ratings']['audience_score']; 
          var year = my_movie['year']; 
          var rating1 = my_movie['mpaa_rating']; 
          var runtime1 = my_movie['runtime'];
          var review_summary = "Not Found. ";
          if(my_movie['critics_consensus']) {
            review_summary = my_movie['critics_consensus'];
          }
          var synopsis1 = "Not Found.";
          if(my_movie['synopsis']) {
            var synopsis1 = my_movie['synopsis'];
          }
          var images = my_movie['posters'];
          var image = null; 
          if (images['thumbnail'])
          {
            image = images['thumbnail'];
          }
          else if (images['profile'])
          {
            image = images['profile'];
          }
          else if (images['detailed'])
          {
            image = images['detailed'];
          }
          else if (images['original'])
          {
            image = images['original'];
          }
          mObj.push({movieName: movie_title, mpaRating: rating1, runtime: runtime1, criticCons: review_summary, 
            trailer: "", synopsis: synopsis1, criticsScore: c_score, audienceScore: a_score, 
            releaseDate: year, img: image, thousandsbest: "", nytreview: "", nytTitle: "", 
            nytLink: "", id: movie_id});
        }

        function getRTReviews(param_apikey, page){
          page_limit = 16;
          url = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey='+ param_apikey + '&page=' + page;
          if ($('#loadMore').length > 0)
          { 
            $('#loadMore').remove();
          }
          if ($('#loading-indicator').length == 0)
          {
            $('#movies').append('<img src="images/loading.gif" id="loading-indicator" />');
          }
          $.ajax({
            'type' : "GET", 
            'url': url,
            'cache': true,
            'dataType': 'jsonp',
            'success': function(data, textStats, XMLHttpRequest){
              list_movies = data['movies'];
              for(var i = 0; i < list_movies.length; i++)
              {
                parseMoviesRT(list_movies[i]);
                index = ((page - 1) * page_limit) + i;
                getNYTReviews(index, nytkeys[index%3]);
              }
              if (list_movies.length == page_limit)
              {
                page = page + 1;
                param_apikey = "'" + param_apikey + "'";
                var loading = '<div class="movie" id="loadMore">'+ 
                '<button type="submit" class="btn btn-info" onclick="getRTReviews(' + param_apikey + ',' + page + ');">Load More Movies</button>' 
                +'</div>';
                $("#movies").append(loading); 
              }
              $('#loading-indicator').remove();
            }
          });
}

// aiden's stuff
function searchShowtimes() {
  var date = $('#date').val();
  var zip = $('#zip').val();
  if (zip != "") {
    localStorage.setItem("zip", zip);
  }
  if (moviesAdded.length > 0 && date != "" && zip != "") {
    var request = $.ajax({
      url: 'http://data.tmsapi.com/v1/movies/showings?startDate=' + date + '&zip=' + zip + '&radius=10&api_key=' + showtimekey,
      type: 'GET',
      cache: true,
      dataType: 'json',
      beforeSend: function() { $('.showtimes').append('<center><img src="images/loading.gif" id="st-loading" /></center>'); },
      complete: function() { $('#st-loading').remove(); },
      success: function(data) {

        addShowtimes(data);
      },
      error: function(request, status, error) {
        var err = JSON.parse(request.responseText);
        if (err.errorCode == 1015) {
          stError("That is not a valid zip code. Please enter a valid zip code and try again.");
        }
        if (err.errorCode == 1022) {
          stError("You may only search for future dates. Please enter a valid date and try again.");
        }
      }
    });
  }
  else if (moviesAdded.length == 0) {
    stError("Please add movies to your movie selection first.");
  }
  else if (date == "") {
    stError("Please enter a date first.");
  }
  else if (zip == "") {
    stError("Please enter a zip code first.");
  }
}

function stError(errormsg) {
  $('.showtimes').empty();
  var html = '<h4>' + errormsg + '</h4>';
  $('.showtimes').append(html);
}

function addShowtimes(movies) {
  console.log(movies);
  $('.showtimes').empty();
  var movie_is_added = [];
  for (var m = 0; m < moviesAdded.length; m++)
  {
    movie_is_added.push(0);
  }
  for (var i = 0; i < movies.length; i++) 
  {
    for (var j = 0; j < movies[i].showtimes.length; j++) 
    {
      for (var k = 0; k < moviesAdded.length; k++)
      {
        if (movies[i].title.toLowerCase() == moviesAdded[k].movieName.toLowerCase()) 
        {
          movie_is_added[k] = 1;
          console.log(movie_is_added);
          var theater = movies[i].showtimes[j].theatre.name;
          var theaterid = theater.replace(/[\.,-\/#!'?$%\^&\*;:{}=\-_`~()]/g,"").replace(/ /g,'');
          if ($('#' + theaterid).length == 0) 
          {
            // add theater if isn't there
            var theaterhtml = '<div class="theater" id="' + theaterid + '">' +
            '<span id="panelHeading"><b>' + theater + '</b>' + '</span></div>';
            $('.showtimes').append(theaterhtml);
          }
          
          var movie = movies[i].title;
          var movieid = movie.replace(/[\.,-\/#!$'?%\^&\*;:{}=\-_`~()]/g,"").replace(/ /g,'');
          if ($('#' + theaterid + ' #' + movieid).length == 0) {
            var moviehtml = '<div class="smovie" id="' + movieid + '">' +
            '<span id="movieTitle">' + movie  + '</span></div>';
            $('#' + theaterid).append(moviehtml);
          }

          var datetime = movies[i].showtimes[j].dateTime;
          var ticketuri = movies[i].showtimes[j].ticketURI;
          var timearr = datetime.split("T");
          var time = timearr[1];
          var hmarr = time.split(":");
          var hours = hmarr[0];
          var minutes = hmarr[1];
          var showtimehtml = "";
          var time = formatTime(hours, minutes);
          if (ticketuri === undefined) 
          {
            showtimehtml = '<div class="showtime">' +
            time + '</div>';
          }
          else 
          {
            showtimehtml = '<div class="showtime">' + '<a target="_blank" href="' + ticketuri + '">' +
            time + '</a></div>';
          }
        
          $('#' + theaterid + ' #' + movieid).append(showtimehtml);
        }
      }
    }
  }
  if ($('.showtimes').html() == "")
  {
    $('.showtimes').append('<h4> No results found :( </h4>');
  }
  else 
  {
    console.log(movie_is_added);
    for (var i = 0; i < movie_is_added.length; i++)
    {
      if (movie_is_added[i] == 0)
      {
        $('.showtimes').prepend('<h5>' + moviesAdded[i].movieName + ' was not found in any theater. <br></h5>');
      }
    }
  }
}

function formatToday() {
  var today = new Date();
  var date = today.getDate();
  var month = today.getMonth() + 1;
  var year = today.getFullYear();

  if (date < 10) {
    date = "0" + date;
  }

  if (month < 10) {
    month = "0" + month;
  }

  today = year + "-" + month + "-" + date;
  return today;
}

function formatTime(hours, minutes) {
  var ampm = "";
  var hours = hours;
  var minutes = minutes;
  if (hours > 12) {
    ampm = "PM";
    hours = hours%12;
  }
  else {
    ampm = "AM";
  }

  var time = hours + ":" + minutes + " " + ampm;
  return time;
}

$(document).ready(function() {
  main();
  var today = formatToday();
  $('#date').val(today);
  if (localStorage.getItem("zip") !== null) {
    $('#zip').val(localStorage.getItem("zip"));
  }
  $(document).on('click', '.theater b', function() {
    var id = $(this).closest("div").attr("id");
    $('#' + id + ' ' + '.smovie').toggle();
  });
});

// aiden's stuff ends

