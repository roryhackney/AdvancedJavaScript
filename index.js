import {getAll, getItem} from "./data.js";
import qs from 'qs';

import http from "http"; //import HTTP
import fs, { readFile } from "fs"; //import file system
import { query } from "express";

http.createServer((req, res) => { //create a server with request and response
    let url = req.url.split("?");
    let query = qs.parse(url[1]);
    let path = url[0].toLowerCase(); //get request URL
    switch(path) { //each path / route / url has its own content
        case '/':
            res.writeHead(200, {'Content-Type': 'text/plain'}); //response header contains content type & status code 200 which means success
            res.end(JSON.stringify(getAll()));
            break;
        case '/about':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end("Rory Hackney is a web developer, programmer, and artist from Seattle, Washington. They enjoy kissing cats, drawing comics, and being too anxious to function.");
            break;
        case '/detail':
            res.writeHead(200, {'Content-Type':'text/plain'});
            let dino = getItem(query.name);
            if(dino === undefined){res.end("Dino Not Found")}
            else {res.end(JSON.stringify(dino));}
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not Found');
            break;
    }
}).listen(process.env.PORT || 3000);