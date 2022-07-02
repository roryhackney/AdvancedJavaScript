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

app.get('/testing', (req, res, next) => {
    res.type('text/html');
    Dinosaur.find({}).lean().then((dinos) => {
        res.render('homestatic', {dinos});
    }).catch(err => next(err));
});

app.get('/about', (req, res) => {
    res.type('text/plain');
    res.send("Rory Hackney is a web developer, programmer, and artist from Seattle, Washington. They're passionate about making the web more accessible by creating intuitive, mobile friendly, quality websites that combine functionality with creativity. They have a Certificate in Web Development, an art degree, and are currently studying programming while looking for their first professional tech job. In their free time, they enjoy making art, petting cats, and learning more about tech every day.");
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

app.get('/api/dinos/delete/:_id', (req, res) => {
    Dinosaur.findOne({"_id": req.params._id}).lean()
    .then((myobj) => {
        if(myobj === null){return res.status(500).send(req.params._id + ' is not in the database.')};
        Dinosaur.deleteOne({"_id": req.params._id}, (err, result) => {
            if(err){return res.status(500).send('An unknown error occurred')};
            res.json({_id: req.params._id, deleted: result});
        });
    });
});

//bad, please use app.post(/api/dinos/addtesting)
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


//improved add route
app.post('/api/dinos/addtesting/', (req, res, next) => {
    //console.log("api");
    //console.log(req.body);
    if(!req.body._id) { //insert new doc
        //console.log("new dino");
        let newDino = new Dinosaur(req.body);
        newDino.save((err, newDino) => {
            if(err) return next(err);
            res.json({updated: 0, _id: newDino._id});
        });
    } else { //update old doc
        //console.log("update");
        Dinosaur.updateOne({_id: req.body._id}, {name: req.body.name, length: req.body.length, weight: req.body.weight, cool: req.body.cool}, (err, result) => {
        if(err) return next(err);
        res.json({updated: result.nModified, _id: req.body._id});
        });
    }
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