var express = require('express');
var app = express();

app.use(express.static('public'));

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With", "content-type");
  next();
});

var server = app.listen(8000, '127.0.0.1', function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
