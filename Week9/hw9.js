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
res.render('home',context);
})

app.get('/colors',function(req,res,next){
  var context = {};
  context.colr = [];
 request({
        "url":"http://www.colourlovers.com/api/colors?format=json",
      }, function(err, response, body){
    if(!err && response.statusCode < 400){
      var resp = JSON.parse(body);
	  for (i=0; i<20; i++){
		  context.colr.push(resp[i]);
	  }
      res.render('clr',context);
    } else {
      if(response){
        console.log(response.statusCode);
      }
      next(err);
    }
  });
});

app.get('/palettes',function(req,res,next){
  var context = {};
  context.plt = [];
 request({
        "url":"http://www.colourlovers.com/api/palettes?format=json&keywords=green&orderCol=numVotes",
      }, function(err, response, body){
    if(!err && response.statusCode < 400){
      var resps = JSON.parse(body);
	  for (i=0; i<5; i++){
		  context.plt.push(resps[i]);
	  }
      res.render('palette',context);
    } else {
      if(response){
        console.log(response.statusCode);
      }
      next(err);
    }
  });
});

app.get('/patterns',function(req,res,next){
  var context = {};
  var respss = [];
 request({
        "url":"http://www.colourlovers.com/api/patterns?format=json&keywords=stripes&numResults=1",
      }, function(err, response, body){
    if(!err && response.statusCode < 400){
      respss = JSON.parse(body);
	  context.ptn = respss[0].imageUrl;
      res.render('pattern',context);
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