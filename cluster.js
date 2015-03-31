var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var url = require('url');

function fib(n) {
    if(!n || n === 1) {
        return 1;
    }

    return fib(n-1) + fib(n-2);
}

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    console.log('New worker: ' + process.pid);
    // Workers can share any TCP connection
    // In this case its a HTTP server
    http.createServer(function(req, res) {
        var url_parts = url.parse(req.url, true);
        var n = url_parts.query.n;
        console.log('Worker ' + process.pid + ' got a request');

        res.end('' + fib(parseInt(n)));
    }).listen(8001);
}