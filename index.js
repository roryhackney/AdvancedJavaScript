'use strict'
import {getAll, getItem} from "./data.js";
import {Dinosaur} from './models/Dinosaur.js';

import exphbs from 'express-handlebars'; //handlebars
import express from 'express'; //express framework

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static('public')); // set location for static files
app.use(express.urlencoded({extended: true})); //Parse URL-encoded bodies

app.engine("handlebars", exphbs({defaultLayout: false}));
app.set("view engine", "handlebars");


//routes
app.get('/', (req, res, next) => {
    res.type('text/html');
    Dinosaur.find({}).lean().then((dinos) => {
        res.render('home', {dinos});
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
    }).catch(err  => next(err))
})

app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 Error - File Not Found');
});

app.listen(app.get('port'), () => {
    console.log('Express server started');
});