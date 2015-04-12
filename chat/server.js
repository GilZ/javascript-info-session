var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    users = {};

app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', function(socket){
    socket.emit('admin', 'Hello new user. please send your name');
    socket.on('chat', function(msg){
        if(!users[socket.id]) {
            users[socket.id] = msg;
            io.emit('admin', msg + ' has joined the chat');
        } else {
            io.emit('chat', users[socket.id] + ': ' + msg);
        }
    });

    socket.on('disconnect', function() {
        io.emit('admin message', (users[socket.id] || 'Unknown user') + ' has left the chat');
        delete users[socket.id];
    });
});

http.listen(8002, function(){
    console.log('listening on port 8002');
});