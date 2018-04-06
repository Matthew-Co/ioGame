var express = require('express');
var app = express();
var serv = require('http').Server(app);
var Player = require("./server/player.js");
var Bead = require("./server/bead.js")

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(2019);

setInterval(tickServer, 1000/60);

console.log("Server started");

var SOCKET_LIST = {};
var PLAYER_LIST = {};

var io = require('socket.io')(serv,{});

io.sockets.on('connection', function(socket){
    socket.heartbeatTimeout = 3;
    socket.id = Math.random();
    console.log("User connected:" + socket.id);
    SOCKET_LIST[socket.id] = socket;

    player = new Player(socket.id, 350, 350);
    PLAYER_LIST[socket.id] = player;

    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
        console.log("User disconnected:" + socket.id);
    });

    socket.on('keyPress',function(data){
        if(data.inputId == 'left')
            PLAYER_LIST[socket.id].pressingLeft = data.state;
        else if(data.inputId == 'right')
            PLAYER_LIST[socket.id].pressingRight = data.state;
        else if(data.inputId == 'up')
            PLAYER_LIST[socket.id].pressingUp = data.state;
        else if(data.inputId == 'down')
            PLAYER_LIST[socket.id].pressingDown = data.state;
    });


});


var bead = new Bead(Math.floor(Math.random() * 690 + 10), Math.floor(Math.random() * 690 + 10));

function tickServer() {
  var playerInfoPack = [];
  var beadPosition = [];
  for(var i in PLAYER_LIST){
      var player = PLAYER_LIST[i];
      player.tick();
      playerInfoPack.push({
          playerX:player.xPos,
          playerY:player.yPos,
          playerColor:player.color,
          playerScore:player.score
      });
      if(bead.checkPlayerBeadCollision(player.xPos, player.yPos, 20)) {
        player.score++;
        bead.xPos = Math.floor(Math.random() * 690 + 10);
        bead.yPos = Math.floor(Math.random() * 690 + 10);
      }
  }
  beadPosition.push(bead.xPos, bead.yPos);
  for(var i in SOCKET_LIST){
      var socket = SOCKET_LIST[i];
      socket.emit('playerInfo', playerInfoPack);
      socket.emit('beadPosition', beadPosition);
  }
}
