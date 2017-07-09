var FeedReadrApp = {};
FeedReadrApp.currentArticles = [];

FeedReadrApp.sources = {
  digg: {
    url: "https://accesscontrolalloworiginall.herokuapp.com/http://digg.com/api/news/popular.json",
  },
  mashable: {
    url: "https://accesscontrolalloworiginall.herokuapp.com/http://mashable.com/stories.json",
  },
  reddit: {
    url: "https://www.reddit.com/top.json",
  }
};

FeedReadrApp.sources.digg.refreshFeed = function(){
  var request = $.ajax({
    url: this.url
  });

  request.done(function(data){
    if (data.status !== 'ok') {
      alert("The Feed Failed to Load");
    } else {    
      var output = [];
      var results = data.data.feed;

      for(var i=0; i<results.length; i++){
        var article = {
          "ARTICLE-ID": results[i].story_id,                        // should this be results[i].content.content_id?
          "ARTICLE-TITLE": results[i].content.title,
          "ARTICLE-CATAGORY": results[i].content.tags[0].display_name,
          "ARTICLE-IMPRESSIONS": results[i].diggs.count,
          "ARTICLE-IMAGE-LINK": results[i].content.media.images[0].original_url,
          "ARTICLE-LINK": results[i].content.original_url
        };
        output.push(article);
      };
      console.log(output);
      FeedReadrApp.currentArticles = output;

      for (var i=0; i<output.length; i++){
        var tempContent = output[i];
        var articleHTML = FeedReadrApp.compileHandlebars(tempContent);
        $('#main').append(articleHTML);
      };
    };
  });
}

FeedReadrApp.sources.mashable.refreshFeed = function(){
  var request = $.ajax({
    url: this.url
  });

  request.done(function(data){   
      var output = [];
      var results = data.hot;

      for(var i=0; i<results.length; i++){
        var article = {
          "ARTICLE-ID": results[i]._id,
          "ARTICLE-TITLE": results[i].title,
          "ARTICLE-CATAGORY": results[i].channel,
          "ARTICLE-IMPRESSIONS": results[i].formatted_shares,
          "ARTICLE-IMAGE-LINK": results[i].feature_image,
          "ARTICLE-LINK": results[i].short_url
        };
        output.push(article);
      };
      console.log(output);
      FeedReadrApp.currentArticles = output;

      for (var i=0; i<output.length; i++){
        var tempContent = output[i];
        var articleHTML = FeedReadrApp.compileHandlebars(tempContent);
        $('#main').append(articleHTML);
      };
  });
}

FeedReadrApp.sources.reddit.refreshFeed = function(){
  var request = $.ajax({
    url: this.url
  });

  request.done(function(data){   
      var output = [];
      var results = data.data.children;

      for(var i=0; i<results.length; i++){
        var article = {
          "ARTICLE-ID": results[i].data.id,
          "ARTICLE-TITLE": results[i].data.title,
          "ARTICLE-CATAGORY": results[i].data.subreddit_name_prefixed,
          "ARTICLE-IMPRESSIONS": results[i].data.score,
          "ARTICLE-IMAGE-LINK": results[i].data.thumbnail, // results[i].preview.images?
          "ARTICLE-LINK": results[i].data.url
        };
        output.push(article);
      };
      console.log(output);
      FeedReadrApp.currentArticles = output;

      for (var i=0; i<output.length; i++){
        var tempContent = output[i];
        var articleHTML = FeedReadrApp.compileHandlebars(tempContent);
        $('#main').append(articleHTML);
      };
  });
}

FeedReadrApp.compileHandlebars = function(data) {
  var source = $('#result_list_item_template').html();
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
});