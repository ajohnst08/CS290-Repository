var express = require ('express');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var mysql = require('mysql');
var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port',3000);

var pool = mysql.createPool({
	host: 'localhost',
	user: 'student',
	password: 'default',
	database: 'student'
});

module.exports.pool = pool;  

app.get('/',function(req,res,next){
  var context = {};
pool.query('SELECT * FROM tracker', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.render('home', context);
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
pool.query("DROP TABLE IF EXISTS tracker", function(err){
    var createString = "CREATE TABLE tracker(" +
    "id INT PRIMARY KEY AUTO_INCREMENT," +
    "name VARCHAR(255) NOT NULL," +
    "reps INT," +
	"weight INT" +
    "due DATE)" + 
	"lbs BOOLEAN";
pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.get('/insert',function(req,res,next)){
	var context = {};
	pool.query("INSERT INTO tracker(`name`,`reps`,`weight`,`due`,`lbs`) VALUES (?,?,?,?,?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
  });
	
}

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