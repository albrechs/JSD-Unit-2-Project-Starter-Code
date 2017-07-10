var FeedReadrApp = {};
FeedReadrApp.currentArticles = [];

FeedReadrApp.sources = {
  digg: {
    feedUrl: "https://accesscontrolalloworiginall.herokuapp.com/http://digg.com/api/news/popular.json"
  },
  mashable: {
    feedUrl: "https://accesscontrolalloworiginall.herokuapp.com/http://mashable.com/stories.json"
  },
  reddit: {
    feedUrl: "https://www.reddit.com/top.json"
  }
};

FeedReadrApp.sources.digg.refreshFeed = function(){
  $('#popUp').removeClass('hidden');
  var request = $.ajax({
    url: this.feedUrl
  });

  request.done(function(data){
    if (data.status !== 'ok') {
      alert("The Feed Failed to Load");
    } else {    
      $('#main').empty();
      var output = [];
      var results = data.data.feed;

      for(var i=0; i<results.length; i++){
        var article = {
          "ARTICLE-ID": results[i].story_id,                        // should this be results[i].content.content_id?
          "ARTICLE-TITLE": results[i].content.title,
          "ARTICLE-CATAGORY": results[i].content.tags[0].display_name,
          "ARTICLE-IMPRESSIONS": results[i].diggs.count,
          "ARTICLE-IMAGE-LINK": results[i].content.media.images[0].original_url,
          "ARTICLE-LINK": results[i].content.original_url,
          "ARTICLE-SUMMARY": results[i].content.description,
          "ARTICLE-SOURCE": "digg"
        };
        output.push(article);
      };
      console.log(output);
      FeedReadrApp.currentArticles = output;

      for (var i=0; i<output.length; i++){
        var tempContent = output[i];
        var articleHTML = FeedReadrApp.compileArticle(tempContent);
        $('#main').append(articleHTML);
        $('#popUp.loader').addClass('hidden');
      };
    };
  });
}

FeedReadrApp.sources.mashable.refreshFeed = function(){
  $('#popUp').removeClass('hidden');
  var request = $.ajax({
    url: this.feedUrl
  });

  request.done(function(data){
    if (typeof data == 'undefined') {
      alert("The Feed Failed to Load");
    } else { 
      $('#main').empty();
      var output = [];
      var results = data.hot;

      for(var i=0; i<results.length; i++){
        var article = {
          "ARTICLE-ID": results[i]._id,
          "ARTICLE-TITLE": results[i].title,
          "ARTICLE-CATAGORY": results[i].channel,
          "ARTICLE-IMPRESSIONS": results[i].formatted_shares,
          "ARTICLE-IMAGE-LINK": results[i].feature_image,
          "ARTICLE-LINK": results[i].short_url,
          "ARTICLE-SUMMARY": results[i].excerpt,
          "ARTICLE-SOURCE": "mashable"
        };
        output.push(article);
      };
      console.log(output);
      FeedReadrApp.currentArticles = output;

      for (var i=0; i<output.length; i++){
        var tempContent = output[i];
        var articleHTML = FeedReadrApp.compileArticle(tempContent);
        $('#main').append(articleHTML);
        $('#popUp.loader').addClass('hidden')
      };
    };      
  });
}

FeedReadrApp.sources.reddit.refreshFeed = function(){
  $('#popUp').removeClass('hidden');
  var request = $.ajax({
    url: this.feedUrl,
    data: {t:"day"}
  });

  request.done(function(data){
    if (typeof data == 'undefined') {
      alert("The Feed Failed to Load");
    } else {  
      $('#main').empty();
      var output = [];
      var results = data.data.children;

      for(var i=0; i<results.length; i++){
        var article = {
          "ARTICLE-ID": results[i].data.name,
          "ARTICLE-TITLE": results[i].data.title,
          "ARTICLE-CATAGORY": results[i].data.subreddit_name_prefixed,
          "ARTICLE-IMPRESSIONS": results[i].data.score,
          "ARTICLE-IMAGE-LINK": results[i].data.thumbnail,
          "ARTICLE-LINK": results[i].data.url,
          "ARTICLE-SOURCE": "reddit"
        };
        if ((article["ARTICLE-IMAGE-LINK"] == 'default') || (article["ARTICLE-IMAGE-LINK"] == 'self') || (article["ARTICLE-IMAGE-LINK"] == 'nsfw')){
          article["ARTICLE-IMAGE-LINK"] = '/images/reddit_icon.png';
        }
        output.push(article);
      };
      console.log(output);
      FeedReadrApp.currentArticles = output;

      for (var i=0; i<output.length; i++){
        var tempContent = output[i];
        var articleHTML = FeedReadrApp.compileArticle(tempContent);
        $('#main').append(articleHTML);
        $('#popUp.loader').addClass('hidden')
      };
    };
  });
}

FeedReadrApp.displayArticleDetail = function(article_id) {
  event.preventDefault();
  $('#popUp').removeClass('loader hidden');
  var article = FeedReadrApp.currentArticles.find(function(article){
    return article['ARTICLE-ID'] == article_id;
  });
  console.log(article)

  var displayInfo = {
    "ARTICLE-TITLE": article["ARTICLE-TITLE"],
    "ARTICLE-SUMMARY": article["ARTICLE-SUMMARY"],
    "ARTICLE-LINK": article["ARTICLE-LINK"]
  };

  if (typeof displayInfo["ARTICLE-SUMMARY"] == 'undefined'){
    displayInfo["ARTICLE-SUMMARY"] = article["ARTICLE-CATAGORY"];
  }
  var displayInfoHtml = FeedReadrApp.compilePopUp(displayInfo);
  $('#popUp .container').html(displayInfoHtml);
}

FeedReadrApp.closePopUp = function(){
  $('#popUp .container').empty();
  $('#popUp').addClass('loader hidden');
}

FeedReadrApp.compileArticle = function(data) {
  var source = $('#result_list_item_template').html();
  var template = Handlebars.compile(source);
  return template(data);
}

FeedReadrApp.compilePopUp = function(data) {
  var source = $('#article_popup').html();
  var template = Handlebars.compile(source);
  return template(data);
}

FeedReadrApp.populateFeed = function(source) {
  switch(source) {
    case 'digg':
      FeedReadrApp.sources.digg.refreshFeed();
      break;
    case 'mashable':
      FeedReadrApp.sources.mashable.refreshFeed();
      break;
    case 'reddit':
      FeedReadrApp.sources.reddit.refreshFeed();
      break;
    default:
      console.log('Unrecognized source: ' + source);
  }
}

$(function(){
  FeedReadrApp.populateFeed('reddit');

  $('#main.container').on('click', 'a', function(){
    console.log('CLICKED');
    event.preventDefault();
    var id = $(this).data('id');
    console.log(id)
    FeedReadrApp.displayArticleDetail(id);
  });
});