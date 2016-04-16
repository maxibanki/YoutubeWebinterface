var prefix = "", maxResults = 6, nextPageToken;

function tplawesome(e, t) {
    res = e;
    for (var n = 0; n < t.length; n++) {
        res = res.replace(/\{\{(.*?)\}\}/g, function(e, r) {
            return t[n][r]
        });
    }
    return res
}
$(function() {
    $("form").on("submit", function(e) {
        e.preventDefault();
        // prepare the request
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent($("#search")
                    .val())
                .replace(/%20/g, "+"),
            maxResults: maxResults,
            order: "relevance"
        });
        // execute the request
        request.execute(function(response) {
            var result = response.result;
            nextPageToken = result.nextPageToken;
            console.log("nextPageToken: " + nextPageToken);
            $("#results").html("");
            $.each(result.items, function(index, item) {
                $.get("src/yt.html", function(data) {
                    $("#results")
                        .append(tplawesome(data, [{
                            "title": item.snippet.title,
                            "videoid": item.id.videoId
                        }]));
                });
            });
            resetVideoHeight();
        });
    });
    $(window).on("resize", resetVideoHeight);
});

function resetVideoHeight() {
    $(".video")
        .css("height", $("#results")
            .width() * 9 / 16);
}

function init() {
    gapi.client.setApiKey("AIzaSyC87fSxWOAp8hzKTBCWF8dpqUYMHVfbWNo");
    gapi.client.load("youtube", "v3", function() {
    });
}

//YT END Start Sinusbot Connection

$(document).ready(function() {
	var instanceList = $('#dropdown');
	// Get the list of instances using the currently logged in user account
	$.ajax({ url: prefix + '/api/v1/bot/instances', headers: { 'Authorization': 'bearer ' + window.localStorage.token }}).done(function(data) {
		data.forEach(function(instance) {
			// When clicking an entry, we post a request to the script interface and return the result
			$('<li/>').appendTo(instanceList).html('<a href="#">' + instance.nick + '</a>').click(function() {
                instanceid = instance.uuid;
			});
		});
        $('.dropd1 > li > a').click(function() {
            $("#dropdb1").html($(this).text() + ' <span class="caret"></span>');
        });
	});
    
    $('#loadmore').click(function () {
        $('#loadmore').html('<i class="fa fa-spinner fa-pulse fa-fw"></i>Loading...');
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent($("#search")
                    .val())
                .replace(/%20/g, "+"),
            maxResults: maxResults,
            pageToken: nextPageToken,
            order: "relevance"
        });
        // execute the request
        request.execute(function(response) {
            var result = response.result;
            nextPageToken = result.nextPageToken;
            console.log("nextPageToken: " + nextPageToken);
            $.each(result.items, function(index, item) {
                $.get("src/yt.html", function(data) {
                    $("#results")
                        .append(tplawesome(data, [{
                            "title": item.snippet.title,
                            "videoid": item.id.videoId
                        }]));
                });
            });
            resetVideoHeight();
            $('#loadmore').html('Load more');
        });
    });
});

function endplay(url) {
    if (instanceid) {
        $.ajax({
          url: prefix + '/api/v1/bot/i/' + instanceid + '/scriptEvent/ytplay',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + window.localStorage.token
          },
          data: JSON.stringify(url)
        }).done(function(data) {
          // The result will be an array with answers from the script
          var answerList = $('#answers')
          answerList.html('');
          data.forEach(function(answer) {
            $('<li/>').appendTo(answerList).text(answer.script + ' returned ' + JSON.stringify(answer.data));
          });
          $('.alert > #title').text("Success!");
          $('.alert > #text').text("The video, will be successfully played.");
          $('.none' ).fadeIn( 400 ).delay( 2000 ).fadeOut( 400 );
        });
    }
}

function endenqueue(url) {
    if (instanceid) {
        $.ajax({
          url: prefix + '/api/v1/bot/i/' + instanceid + '/scriptEvent/ytenq',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + window.localStorage.token
          },
          data: JSON.stringify(url)
        }).done(function(data) {
          // The result will be an array with answers from the script
          var answerList = $('#answers')
          answerList.html('');
          data.forEach(function(answer) {
            $('<li/>').appendTo(answerList).text(answer.script + ' returned ' + JSON.stringify(answer.data));
          });
          $('.alert > #title').text("Success!");
          $('.alert > #text').text("The video, will be successfully enqueued.");
          $('.none' ).fadeIn( 400 ).delay( 2000 ).fadeOut( 400 );
        });
    }
}

function enddownload(url) {
    if (instanceid) {
        $.ajax({
          url: prefix + '/api/v1/bot/i/' + instanceid + '/scriptEvent/ytdl',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + window.localStorage.token
          },
          data: JSON.stringify(url)
        }).done(function(data) {
          // The result will be an array with answers from the script
          var answerList = $('#answers')
          answerList.html('');
          data.forEach(function(answer) {
            $('<li/>').appendTo(answerList).text(answer.script + ' returned ' + JSON.stringify(answer.data));
          });
          $('.alert > #title').text("Success!");
          $('.alert > #text').text("The video, will be successfully downloaded.");
          $('.none' ).fadeIn( 400 ).delay( 2000 ).fadeOut( 400 );
        });
    }
}
