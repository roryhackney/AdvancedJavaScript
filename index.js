'use strict'
import {getAll, getItem} from "./data.js";
import {Dinosaur} from './models/Dinosaur.js';

import exphbs from 'express-handlebars'; //handlebars
import express from 'express'; //express framework
import cors from 'cors'; //cross origin resource sharing for APIs

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static('public')); // set location for static files
app.use(express.urlencoded({extended: true})); //Parse URL-encoded bodies

app.engine("handlebars", exphbs({defaultLayout: false}));
app.set("view engine", "handlebars");

app.use(express.json());
app.use('/api', cors()); //set access control allow origin header for api routes

//////////////
//routes//////
//////////////

app.get('/', (req, res, next) => {
    res.type('text/html');
    Dinosaur.find({}).lean().then((dinos) => {
        // res.render('home', {dinos});
        res.render('home', {dinos: JSON.stringify(dinos)});
    }).catch(err => next(err));
});

app.get('/about', (req, res) => {
    res.type('text/plain');
    res.send("Rory Hackney is a web developer, programmer, and artist from Seattle, Washington. They enjoy kissing cats, drawing comics, and being too anxious to function.");
});

app.get('/detail', (req, res, next) => {
    res.type('text/html');
    let query = req.query;
    if(query.name === undefined){res.send('Dino Not Found')}
    Dinosaur.findOne({"name": query.name}).lean().then(dino => {
        if(dino === null){res.send('Dino Not Found');}
        res.render('detail', {dino: dino});
    }).catch(err => next(err));
});

app.get('/delete', (req, res, next) => {
    res.type('text/plain');
    let query = req.query;
    if(query.name === undefined){res.end('Dino Not Found');}
    Dinosaur.findOne({"name": query.name}).lean().then(dino => {
        if(dino === null){res.end('Dino Not Found');}
        let del = Dinosaur.deleteOne({"name":query.name});
        if(del.deletedCount === 1){res.end(req.name + ' deleted successfully.')}
        else {res.end(req.name + ' was not deleted due to an unknown error.')}
    }).catch(err  => next(err));
});

//////////////
//API ROUTES//
/////////////

//can't figure out how to get it to return an error message instead of big error block
app.get('/api/dinos', (req, res) => {
    Dinosaur.find({})
    .then((d) => {
        if(d.length > 0){res.json(d)}
        else {return res.status(500).send('Database error occurred.')};
    });
});

app.get('/api/dinos/detail/:name', (req, res) => {
    Dinosaur.findOne({"name": req.params.name})
    .then((d) => {
        if(d === null){return res.status(500).send(req.params.name + ' is not in the database.')}
        else {res.json(d)};
    });
});

app.get('/api/dinos/delete/:name', (req, res) => {
    Dinosaur.findOne({"name": req.params.name}).lean()
    .then((myobj) => {
        if(myobj === null){return res.status(500).send(req.params.name + ' is not in the database.')};
        Dinosaur.findOneAndDelete({"name": req.params.name}, (err, delItem) => {
            if(err){return res.status(500).send('An unknown error occurred')};
            res.json("Successfuly deleted: " + delItem);
        });
    });
});

app.get('/api/dinos/add/:name&:length&:weight&:cool', function(req, res) {
    let data = {
        "name": req.params.name,
        "length": req.params.length,
        "weight": req.params.weight,
        "cool": req.params.cool
        };
    data.cool = Number(data.cool);
    if(isNaN(data.cool) || data.cool < 1 || data.cool > 5 || Number.isInteger(data.cool) == false){return res.status(500).send("Error: cool must be an integer between 1 and 5 <br><br> api/dinos/add/name:string/length:string/weight:string/cool:1-5 <br> Example: api/dinos/add/chicken&1.5 feet &5 pounds&1")};
    // console.log(data);
    if(isNaN(Number(data.name)) === false){return res.status(500).send("Error: name should not be a number <br><br> api/dinos/add/name:string/length:string/weight:string/cool:1-5 <br> Example: api/dinos/add/chicken&1.5 feet &5 pounds&1")};
    Dinosaur.findOne({"name":data.name})
    .then(function(d) {
        //if it exists, update
        if(d !== null){
            d.length = data.length;
            d.weight = data.weight;
            d.cool = data.cool;
            d.save();
            return res.json('Successfully updated: ' + d);
        } //if it doesn't exist, insert new doc
        else {
            let newDino = new Dinosaur(data);
            newDino.save((err, dino) => {
                if(err){res.status(500).send("Database error occurred.")};
                res.json(dino.name + ' was added to the database: ' + dino);
            });
        }
    });
});



//app.use must be at bottom

app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 Error - File Not Found');
});


//start server
app.listen(app.get('port'), () => {
    console.log('Express server started');
});