// Players and such

(function () {

	// Types of players
	var P1 = '1', P2 = '2';
	var socket = io.connect('http://localhost:8000'),
		player,
		game;

	/**
	 * Create a new game. Emit newGame event.
	 */
	document.querySelector('#new').addEventListener('click', function () {
		var name = document.querySelector('#nameNew').value;
		if (!name) {
			alert('Please enter your name.');
			return;
		}
		socket.emit('createGame', { name: name });
		player = new Player(name, P1);
	});

	/** 
	 *  Join an existing game on the entered roomId. Emit the joinGame event.
	 */
	document.querySelector('#join').addEventListener('click', function () {
		var name = document.querySelector('#nameJoin').value;
		var roomID = document.querySelector('#room').value;
		if (!name || !roomID) {
			alert('Please enter your name and game ID.');
			return;
		}
		socket.emit('joinGame', { name: name, room: roomID });
		player = new Player(name, P2);
	});


	/** 
	 * New Game created by current client. 
	 * Update the UI and create new Game var.
	 */
	socket.on('newGame', function (data) {
		var message = 'Hello, ' + data.name +
			'. Please ask your friend to enter Game ID: ' +
			data.room + '. Waiting for player 2...';

		// Create game for player 1
		// game = new Game(data.room);
		// game.displayBoard(message);
	});

	/**
	 * If player creates the game, he'll be P1(X) and has the first turn.
	 * This event is received when opponent connects to the room.
	 */
	socket.on('player1', function (data) {
		var message = 'Hello, ' + player.getPlayerName();
		document.querySelector('#userHello').innerHTML(message);
		// player.setCurrentTurn(true);
	});

	/**
	 * Joined the game, so player is P2(O). 
	 * This event is received when P2 successfully joins the game room. 
	 */
	socket.on('player2', function (data) {
		var message = 'Hello, ' + data.name;

		//Create game for player 2
		// game = new Game(data.room);
		// game.displayBoard(message);
		// player.setCurrentTurn(false);
	});

	/**
	 * Opponent played his turn. Update UI.
	 * Allow the current player to play now. 
	 */
	// socket.on('turnPlayed', function (data) {
	// 	var row = data.tile.split('_')[1][0];
	// 	var col = data.tile.split('_')[1][1];
	// 	var opponentType = player.getPlayerType() == P1 ? P2 : P1;
	// 	game.updateBoard(opponentType, row, col, data.tile);
	// 	player.setCurrentTurn(true);
	// });

	/**
	 * If the other player wins or game is tied, this event is received. 
	 * Notify the user about either scenario and end the game. 
	 */
	socket.on('gameEnd', function (data) {
		game.endGame(data.message);
		socket.leave(data.room);
	})

	/**
	 * End the game on any err event. 
	 */
	// socket.on('err', function (data) {
	// 	game.endGame(data.message);
	// });


})();

/**
 * Player class
 */
var Player = function (name, type) {
	this.name = name;
	this.type = type;
}

/**
 * Create a static array that stores all possible win combinations
 */
Player.wins = false;

Player.prototype.getPlayerName = function () {
	return this.name;
}

Player.prototype.getPlayerType = function () {
	return this.type;
}






const editors = document.querySelectorAll('.codeMirror');
const codeMirror1 = document.querySelector('#codeMirror1')
const codeMirror2 = document.querySelector('#codeMirror2')
const log1 = document.querySelector('#log1')
const log2 = document.querySelector('#log2')
let gameWon = false;

var myCodeMirror1 = CodeMirror(editors[0], {
	value: "/*Write your code in this IIFE and use the return as your answer*/\n(function(){\n\nreturn 100;\n\n})()\n",
	mode: "javascript",
	lineNumbers: true,
});
myCodeMirror1.on('change', () => {
	checkChanges(1)
})

var myCodeMirror2 = CodeMirror(editors[1], {
	value: "/*Write your code in this IIFE and use the return as your answer*/\n(function(){\n\nreturn 100;\n\n})()\n",
	mode: "javascript",
	lineNumbers: true,
});
myCodeMirror2.on('change', () => {
	checkChanges(2)
})

function checkChanges(player){
	const playerNum = player
	console.log(player);
}

log1.addEventListener('click', handleOutput)
log2.addEventListener('click', handleOutput)

function handleOutput() {
	const target = event.target;
	let editor;
	target === log1 ? editor = myCodeMirror1 : editor = myCodeMirror2;
	console.log(editor);
	const editorValue = editor.getValue()
	console.log(editorValue);

	if (target === log1) {
		document.getElementById("output1").innerHTML = eval(editorValue)
		gameWon = 1;
		socket.emit('gameWon', gameWon);
	}
	else {
		document.getElementById("output2").innerHTML = eval(editorValue)
		gameWon = 2;
		socket.emit('gameWon', gameWon);
	}
}

var socket = io();
socket.on('message', function (data) {
	console.log(data);
});