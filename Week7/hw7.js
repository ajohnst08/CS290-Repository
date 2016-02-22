var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/',function(req,res){
  res.render('home.handlebars');
});

app.get('/getme',function(req,res){
	var Params = [];
	for (var p in req.query) {
		Params.push({'name':p, 'value':req.query[p]});
	}
	var context = {};
	context.lst = Params;
	res.render('getme', context);
});

app.post('/postme',function(req,res){
	var Params = [];
	for (var p in req.body) {
		Params.push({'name':p, 'value':req.body[p]});
	}
	var context = {};
	context.lst = Params;
  res.render('postme', context);
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