# Visual Studio Live! Twitter Display
An animated, real-time display of Twitter feeds optimized for kiosk/TV displays. Originally developed for Visual Studio Live! Boston 2016.

## Demo
View the demo here: https://ngagne.github.io/vs-live-twitter-display/

## Usage
### Initialize the JavaScript application: 
```js
var app = $('#main').App();`
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
