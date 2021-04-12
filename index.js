const http = require("http"); //import HTTP
const fs = require("fs"); //import file system
http.createServer((req, res) => { //create a server with request and response
    var path = req.url.toLowerCase(); //get request URL
    switch(path) { //each path / route / url has its own content
        case '/':
            fs.readFile("home.html", (err, data) => {
                if(err) return console.error(err);
                res.writeHead(200, {'Content-Type': 'text/html'}); //response header contains content type & status code 200 which means success
                res.end(data.toString());
            });
            break;
        case '/about':
            fs.readFile("about.html", (err, data) => {
                if(err) return console.error(err);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data.toString());
            });
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not Found');
            break;
    }
}).listen(process.env.PORT || 3000);