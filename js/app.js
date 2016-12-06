$.fn.App = function(options) {
    'use strict';

    var panels = {
        active: $('#activeTweets'),
        passive: $('#passiveTweets')
    };

    var tweets = [],
        activeTweets = [],
        currentActiveTweet,
        isActiveAnimating = false,
        tweetIndex = -1,
        lists = {
            combined: [],
            limited: []
        },
        guid = 0;

    var templates = {
        clippy:     $('#templateClippy').html(),
        tweet:      $('#templateTweet').html(),
        tweetImage: $('#templateTweetImage').html()
    };

    var backgrounds = $('[data-image]'),
        backgroundsLength = backgrounds.length,
        body = $('body');

    // default configuration properties
    var defaults = {
        activeTweetDuration:        5000, // time (ms) to display active tweet
        passiveTweetDuration:       5000, // time (ms) between each spawned tweet
        passiveTweetBounds:         63, // horizontal bounds (vw) to spawn tweets (100 - [tweet's % width of screen])
        clippyBounds:               98, // horizontal bounds (vw) to spawn clippy (100 - [clippy's % width of screen])
        clippyDuration:             21000, // time (ms) between each spawned clippy
        backgroundImageDuration:    30000, // time (ms) between each background image
        enableClippy:               true, // enable/disable clippy
        maxTweets:                  15, // total tweets to keep in memory
        maxLimitedTweets:          	5 // total limited tweets to keep in memory
    };


    options = jQuery.extend(defaults, options);

    var init = function() {
        initBackgrounds();

        setTimeout(showPassiveTweet, options.passiveTweetDuration);

        // init clippy drop interval
        if (!!options.enableClippy) {
            setTimeout(dropClippy, options.clippyDuration);
        }

        showPassiveTweet();
    };

    var loadTemplate = function(html, map) {
        for (var key in map) {
            if (!map.hasOwnProperty(key)) {
                continue;
            }

            var regex = new RegExp("\{\{" + key + "\}\}", "g");
            html = html.replace(regex, map[key]);
        }

        return html;
    };

    var initBackgrounds = function() {
        backgrounds.each(function(){
            var background = $(this);
            background.css('background-image', 'url(' + background.attr('data-image') + ')');
        });

        showNextBackground();
    };

    var showNextBackground = function() {
        var i = backgrounds.index('.active');

        if (++i >= backgroundsLength) {
            i = 0;
        }

        backgrounds.parent().find('.active').on('webkitTransitionEnd', showNextBackgroundComplete).addClass('out');
        backgrounds.eq(i).addClass('active');

        setTimeout(showNextBackground, options.backgroundImageDuration);
    };

    var showNextBackgroundComplete = function() {
        backgrounds.parent().find('.out').off('webkitTransitionEnd').removeClass('active out');
    };

    var addTweet = function(tweet) {
        // build image html
        var image = '';
        if (!!tweet.image) {
            image = loadTemplate(templates.tweetImage, {
                image: tweet.image
            });
        }

        // build tweet html
        var tweetHtml = loadTemplate(templates.tweet, {
            image:      tweet.profileImage,
            fullname:   tweet.fullname,
            username:   tweet.username,
            time:       tweet.time,
            message:    tweet.message,
            tweet_image: image
        });

        // find item to remove
        var idToRemove = null;
        if (!tweet.isLimited && lists.combined.length >= options.maxTweets) {
            idToRemove = lists.combined.shift();
        } else if (lists.limited.length >= options.maxLimitedTweets) {
            idToRemove = lists.limited.shift();
        }

        // remove items
        if (!!idToRemove) {
            removeItemFromArray(lists.combined, idToRemove);
            removeItemFromArray(lists.limited, idToRemove);
            if (tweets.hasOwnProperty(idToRemove)) {
                delete tweets[idToRemove];
            }
        }

        // generate new id
        var newID = ++guid;

        // add to lists
        tweets[newID] = tweetHtml;
        if (!!tweet.isNew) {
            activeTweets.push(tweetHtml);
        }

        lists.combined.push(newID);
        if (!!tweet.isLimited) {
            lists.limited.push(newID);
        }

        // attempt to show
        showNextActiveTweet();
    };

    var removeItemFromArray = function(array, item) {
        var i = array.indexOf(item);
        if (i != -1) {
            array.splice(i, 1);
        }
    };

    var showNextActiveTweet = function() {
        if (isActiveAnimating || !activeTweets.length) {
            return;
        }
        isActiveAnimating = true;

        // blur bg
        body.addClass('blur');

        currentActiveTweet = $(activeTweets.shift());
        currentActiveTweet.on('webkitTransitionEnd', showNextActiveTweetAnimateComplete).appendTo(panels.active);

        currentActiveTweet.offset();

        // wait for image to load
        var tweetImage = currentActiveTweet.find('.right img');
        if (tweetImage.length) {
            tweetImage.one("load", showNextActiveTweetAnimate).each(function () {
                if (this.complete) $(this).load();
            });
        } else {
            showNextActiveTweetAnimate();
        }
    };

    var showNextActiveTweetAnimate = function() {
        currentActiveTweet.css('top', currentActiveTweet.height() * -0.5);
        currentActiveTweet.addClass('in');
    };

    var showNextActiveTweetAnimateComplete = function() {
        currentActiveTweet.off('webkitTransitionEnd');

        setTimeout(hideActiveTweet, options.activeTweetDuration);
    };

    var hideActiveTweet = function() {
        currentActiveTweet.on('webkitTransitionEnd', hideActiveTweetComplete).addClass('out');

        isActiveAnimating = false;

        if (activeTweets.length) {
            showNextActiveTweet();
        }
    };

    var hideActiveTweetComplete = function() {
        // hide tweet
        $(this).off('webkitTransitionEnd').remove().removeClass('out');

        if (!isActiveAnimating) {
            // undo blur
            body.removeClass('blur');
        }
    };

    var showPassiveTweet = function() {
		if (!lists.combined.length) {
			return;
		}

        if (++tweetIndex >= lists.combined.length) {
            tweetIndex = 0;
        }
		
        var tweet = tweets[lists.combined[tweetIndex]];

        var x = Math.floor(Math.random() * options.passiveTweetBounds);
        var currentTweet = $(tweet).addClass('level' + Math.round(Math.random() * 4)).css('left', x + 'vw').on('webkitTransitionEnd', showPassiveTweetComplete).appendTo(panels.passive);

        currentTweet.offset();
        currentTweet.addClass('in');

        // schedule next tweet
        setTimeout(showPassiveTweet, options.passiveTweetDuration);
    };

    var showPassiveTweetComplete = function() {
        $(this).remove();
    };

    var dropClippy = function() {
        var x = Math.floor(Math.random() * options.clippyBounds);
        var clippy = $(loadTemplate(templates.clippy)).css('left', x + 'vw').on('webkitTransitionEnd', dropClippyComplete).appendTo(panels.passive);

        clippy.offset();
        clippy.addClass('in');

        // schedule next clippy
        setTimeout(dropClippy, options.clippyDuration);
    };

    var dropClippyComplete = function() {
        $(this).remove();
    };

    init();

    return {
        addTweet: addTweet
    };
};


