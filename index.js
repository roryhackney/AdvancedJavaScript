'use strict'
import {getAll, getItem} from "./data.js";

import exphbs from 'express-handlebars'; //handlebars
import express from 'express'; //express framework

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static('public')); // set location for static files
app.use(express.urlencoded({extended: true})); //Parse URL-encoded bodies

app.engine("handlebars", exphbs({defaultLayout: false}));
app.set("view engine", "handlebars");


//routes
app.get('/', (req, res) => {
    res.type('text/html');
    let dinos= getAll();
    res.render('home', {dinos: dinos, name: dinos.name})
});

app.get('/about', (req, res) => {
    res.type('text/plain');
    res.send("Rory Hackney is a web developer, programmer, and artist from Seattle, Washington. They enjoy kissing cats, drawing comics, and being too anxious to function.");
});

app.get('/detail', (req, res) => {
    res.type('text/html');
    let query = req.query;
    if(query.name === undefined){res.send('Dino Not Found')}
    else {
        let dino = getItem(query.name);
        // console.log(dino);
        if (dino===undefined){res.send("Dino Not Found");}
        else {res.render('detail', {dino: dino});};
    }
});

app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 Error - File Not Found');
});

app.listen(app.get('port'), () => {
    console.log('Express server started');
});