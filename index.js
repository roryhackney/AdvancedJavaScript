import {getAll, getItem} from "./data.js";

import http from "http"; //import HTTP
import fs from "fs"; //import file system
http.createServer((req, res) => { //create a server with request and response
    let path = req.url.toLowerCase(); //get request URL
    switch(path) { //each path / route / url has its own content
        case '/':
            res.writeHead(200, {'Content-Type': 'text/plain'}); //response header contains content type & status code 200 which means success
            res.end(getAll());
            break;
        case '/detail?name=velociraptor':
            res.writeHead(200, {'Content-Type':'text/plain'});
            res.end(getItem(path));
            break;
        case '/about':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end("Rory Hackney is a web developer, programmer, and artist from Seattle, Washington. They enjoy kissing cats, drawing comics, and being too anxious to function.");
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not Found');
            break;
    }
}).listen(process.env.PORT || 3000);