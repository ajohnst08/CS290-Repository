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

app.post('/',function(req,res){
  var context = {};
  var loc = '';
    if(req.body['submit']){
	req.session.city = req.body.city;
	req.session.zip = req.body.zip;
	if (req.session.city==''){
		loc = req.session.zip;
	}
	else { 
	loc = req.session.city;
	}
	request('http://api.openweathermap.org/data/2.5/weather?q=' + loc + '&APPID=29568ddaed32e25923f823b59fc4899a&units=imperial', function(err,response,body){
	   if(!err && response.statusCode < 400){
		context.owm = 'temperature = ' + JSON.parse(body).main.temp;
		console.log(context.owm);
		res.render('home', context);
	   }
	   else {
		   console.log(err);
		   if(response){
			   console.log(response.statusCode);
		   }
		   next(err);
	   }
	})
	}
	else {
		res.render('home',context);
		return;
	}
	context.owm = req.session.body;
	res.render('home',context);
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