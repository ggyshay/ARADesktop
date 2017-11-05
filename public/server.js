var express = require('express');
var http = require('http');
var app = express();
var server = app.listen(8080);
var socket = require('socket.io');

app.use(express.static('public'));

var io = socket(server);

io.sockets.on('connection', function(socket){
  console.log("new connection: " + socket.id);

  socket.on('cueS', function(data){
    console.log("new cue sent: " + data.index);
    socket.broadcast.emit('cueR', data);
  });

  socket.on('cueR', function(data){
    console.log("new cue received: " + data.index);
  })

  socket.on('sync', function(b){
    console.log("sync request");
    io.emit('sync', true);
  })
});
