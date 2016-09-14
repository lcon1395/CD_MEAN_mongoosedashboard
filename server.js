var express = require("express");
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var port = 8000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/cat_db');

var CatSchema = new mongoose.Schema({
 name: String,
 age: Number,
 size: String
});
mongoose.model('Cat', CatSchema); 
var Cat = mongoose.model('Cat'); 

app.get('/', function(req, res) {
	Cat.find({}, function(err, results) {
		if (err){ 
			console.log(err);
		} else {
			res.render('index', {cats: results})
		}
	});
});

app.get('/new', function(req, res){
	res.render('new')
})
app.post('/', function(req, res){
	Cat.create(req.body, function(err, results){
		if (err){
			console.log(err);
		} else {
			res.redirect('/')
		}
	});
});
app.get('/:id', function(req, res){
	Cat.find({ _id: req.params.id }, function(err, cat){
		if (err){
			console.log(err);
		} else {
			res.render('show', {cat: cat[0]});
		}
	});
});
app.get('/:id/edit/', function(req, res){
	Cat.find({ _id: req.params.id }, function(err, cat){
		if (err){
			console.log(err);
		} else {
			res.render('edit', {cat: cat[0]});
		}
	});
});
app.post('/cats/:id', function(req, res){
	Cat.update({ _id: req.params.id }, req.body, function(err, cat){
		if (err){
			console.log(err);
		} else {
			res.redirect('/')
		}
	});
});
app.post('/:id/destroy', function(req, res){
	Cat.remove({ _id: req.params.id }, function(err, result){
		if (err){
			console.log(err);
		} else {
			res.redirect('/')
		}
	});
});

app.listen(port, function() {
	 console.log("listening on port " + port);
})



