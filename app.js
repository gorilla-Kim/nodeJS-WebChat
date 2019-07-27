var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');

var server = http.createServer(function(request, response) {
	fs.readFile('index.html', function(error, data){
		response.writeHead(200, { 'Content-Type': 'text/html' });
		response.end(data);
	});
}).listen(52273, function(){
	console.log("Server Running at http://127.0.0.1:52273");
});

var io = socketio.listen(server);
var roomList = [];
io.sockets.on('connection', function(socket){
	var roomName = null;
	
	socket.on('join', function(data){
		console.log("============success!!\n\n");
		roomName = data;
		roomList.push(data);
		console.log(roomList);
		socket.join(data);
	});
	
	socket.on('message', function(data){
		io.sockets.in(roomName).emit('message', data);
    });
	
	socket.on('getRoomList', function(data){
		socket.emit('roomList', roomList);
    });
	
});