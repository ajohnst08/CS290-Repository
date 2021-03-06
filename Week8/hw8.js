var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var request = require('request');
var session = require('express-session');
var app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.use(session({secret:'sec'}));

app.get('/',function(req,res,next){
  var context = {};
 request({
        "url":"http://www.colourlovers.com/api/colors",
        "method":"GET",
        "headers":{
          "Content-Type":"application/json"
        },
        "body":'{"keywords":"green","format":"json"}'
      }, function(err, response, body){
    if(!err && response.statusCode < 400){
      context.colr = body;
      res.render('clr',context);
    } else {
      if(response){
        console.log(response.statusCode);
      }
      next(err);
    }
  });
});

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});