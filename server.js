
//Require Express
var express = require( 'express' );
var app = express();

//Get body-parser
var bodyParser = require( 'body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//Set Path
var path = require( 'path' );
app.use(express.static(path.join( __dirname, './static' )));
app.set('views', path.join( __dirname, './views'));
app.set('view engine', 'ejs');

//MongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongoose_crud');
var dogSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2 },
    breed: { type: String, required: true, minlength: 2 },
    age: { type: Number, required: true, minlength: 1 },
    location: { type: String, required: true, minlength: 2 }
}, { timestamps: true });
mongoose.model('Dog', dogSchema);
var Dog = mongoose.model('Dog');
mongoose.Promise = global.Promise;

//Routes
app.get('/', function(req, res){
    Dog.find({}, function(err, dogs){
        if(err) {
            console.log("Error getting data from mongo");
        } else {
            res.render('index', {allDogs: dogs});
        };
    });
});

app.get('/dog/new', function(req, res){
    res.render('new');
});

app.post('/dogs', function(req, res){
    // console.log("POST DATA: ", req.body);
    var dog = new Dog({name: req.body.name, breed: req.body.breed, age: req.body.age, location: req.body.location});

    dog.save(function(err){
        if(err){
            console.log("Error while saving data to Mongo" + err);
        } else {
            res.redirect('/');
        };
    });
});

app.get('/dog/edit/:id', function(req, res){
    Dog.find({_id: req.params.id}, function(err, dog){
        if(err) {
            console.log("Error getting single dog" + err);
        } else {
            res.render('edit', {theDog: dog});
            // console.log(dog)
        };
    });
});

app.post('/dogs/:id', function(req, res){
    // console.log(req.params.id);
    console.log("POST DATA: ", req.body);
    res.redirect('/')
});

//Listen to server
app.listen(8000, function(){
    console.log("listen on 8000")
});