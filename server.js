//Install express server
const express = require('express');
const path = require('path');
const request = require('request');

const app = express();
const REDDIT_URL  = 'https://www.reddit.com';

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/Reddit'));

app.get('/api/*', function(req,res) {
  request(REDDIT_URL+req.url.split('/api')[1], function (error, response, body) {
    if (!error && response && response.statusCode === 200) {
      res.send(body);
    }
    else {
      console.log("Error "+error)
      res.send(error);
    }
  })
});

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+'/dist/Reddit/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
