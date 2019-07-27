var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');

// 서버 생성
var server = http.createServer(function(request, response) {
	fs.readFile('index.html', function(error, data){
		response.writeHead(200, { 'Content-Type': 'text/html' });
		response.end(data);
	});
}).listen(52273, function(){
	console.log("Server Running at http://127.0.0.1:52273");
});

// 소켓에 서버 연결
var io = socketio.listen(server);
var roomList = [];
// 새로운 client 가 연결됨을 감지합니다. connection
io.sockets.on('connection', function(socket){
	// 방이름을 받을 변수
	var roomName = null;
	
	// 방 생성 혹은 특정 이름의 방에참가
	socket.on('join', function(data){
		console.log("============success!!\n\n");
		roomName = data;
		roomList.push(data);
		console.log(roomList);
		socket.join(data);
	});
	// 같은 방의 유저들에게 메시지 전달
	socket.on('message', function(data){
		io.sockets.in(roomName).emit('message', data);
    });
	// 방 목록 받아보기
	socket.on('getRoomList', function(data){
		socket.emit('roomList', roomList);
    });
	
});