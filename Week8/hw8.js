var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/',function(req,res){
  var context = {};
  if (req.body['submit']){
	  req.session.city = req.body.city;
	  req.session.zip = req.body.zip;
	request('http://api.openweathermap.org/data/2.5/weather?q=' + req.session.city + '&APPID=29568ddaed32e25923f823b59fc4899a' + '&units=imperial', function(err,response,body){
	   if(!err && response.statusCode < 400){
		context.owm = body;
		res.render('home', context);
	   }
	   else {
		   console.log(err);
		   if(response){
			   console.log(response.statusCode);
		   }
		   next(err);
	   }
	}
  }
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