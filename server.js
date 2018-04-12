const express = require('express');
const gzip = require('compression');
const request = require('request');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'views');

// gzip
app.use(gzip({
	threshold: 0,
	filter: () => true, // Compress all assets by default
}));

app.get('/', function (req, res) {
	res.render('index');
});

let rooms = 0;

io.on('connection', function (socket) {
	/**
	 * Create a new game room and notify the creator of game. 
	 */
	socket.on('createGame', function (data) {
		socket.join('room-' + ++rooms);
		socket.emit('newGame', { name: data.name, room: 'room-' + rooms });
	});

	/**
	 * Connect the Player 2 to the room he requested. Show error if room full.
	 */
	socket.on('joinGame', function (data) {
		var room = io.nsps['/'].adapter.rooms[data.room];
		if (room && room.length == 1) {
			socket.join(data.room);
			socket.broadcast.to(data.room).emit('player1', {});
			socket.emit('player2', { name: data.name, room: data.room })
		}
		else {
			socket.emit('err', { message: 'Sorry, The room is full!' });
		}
	});
	/**
	 * Get the editor value on change
	 */ 
	socket.on('changes', function(data){
		socket.broadcast.to(data.room).emit('otherPlayer', { changes: data.changes, player: data.player, lost: false});
	})
	/**
	 * Notify the players about the victor.
	 */
	socket.on('gameEnded', function (data) {
		socket.broadcast.to(data.room).emit('gameEnd', data);
	});

	socket.on('gameWon', function(data){
		console.log(data);
		socket.broadcast.to(data.room).emit('otherPlayer', { lost: true });
	})
});

server.listen(8000, function () {
	console.log('server is running on port 8000');
});
