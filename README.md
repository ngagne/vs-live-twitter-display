# Visual Studio Live! Twitter Display
An animated, real-time display of Twitter feeds optimized for kiosk/TV displays. Originally developed for Visual Studio Live! Boston 2016.

## Demo
View the demo here: https://ngagne.github.io/vs-live-twitter-display/

## Usage
### Initialize the JavaScript application: 
```js
var app = $('#main').App();
```

### Optional constructor parameters:
```js
var app = $('#main').App({
        activeTweetDuration: 5000, // time (ms) to display active tweet
       passiveTweetDuration: 5000, // time (ms) between each spawned tweet
         passiveTweetBounds: 63, // horizontal bounds (vw) to spawn tweets (100 - [tweet's % width of screen])
               clippyBounds: 98, // horizontal bounds (vw) to spawn Clippy character (100 - [clippy's % width of screen])
             clippyDuration: 21000, // time (ms) between each spawned Clippy character
    backgroundImageDuration: 30000, // time (ms) between each background image
               enableClippy: true, // enable/disable the Clippy character
                  maxTweets: 15, // total tweets to keep in memory
           maxLimitedTweets: 5 // total limited tweets to keep in memory
});
```

### Add a tweet: 
```js
app.addTweet({
    profileImage: 'path-to-twitter-profile-icon.jpg',
        fullname: 'Profile Name',
        username: '@ProileName',
            time: 'Nov 29',
         message: 'This is a sample tweet message.',
           image: 'optional-path-to-tweet-image.jpg',
           isNew: true, // if true, will display in a popup animation
       isLimited: true // if true, tweets are stored into a limited queue
});
```
