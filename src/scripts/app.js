//Game

(function () {
	var socket = io();
	socket.on('message', function (data) {
		console.log(data);
	});

	// Types of players
	var P1 = 'player1', P2 = 'player2';
	var socket = io.connect('http://localhost:8000'),
		player,
		game;
	var globalRoomID = 0;

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
		globalRoomID = data.room
		document.querySelector('.room-info').innerHTML = message
	});

	/**
	 * If player creates the game, he'll be P1(X) and has the first turn.
	 * This event is received when opponent connects to the room.
	 */
	socket.on('player1', function (data) {
		var message = 'Hello, ' + player.getPlayerName();
		document.querySelector('#userHello').innerHTML = message;
		alert('Someone joined!')
		document.querySelector('main').style = "display:block;";
		document.querySelector('#log2').style = "display:none;";
		myCodeMirror2.setOption('readOnly', true)

	});

	/**
	 * Joined the game, so player is P2(O). 
	 * This event is received when P2 successfully joins the game room. 
	 */
	socket.on('player2', function (data) {
		var message = 'Hello, ' + data.name;
		document.querySelector('#userHello').innerHTML = message;
		alert('You joined succesfully!');
		document.querySelector('main').style = "display:block;";
		document.querySelector('#log1').style = "display:none;";
		myCodeMirror1.setOption('readOnly', true)
	});

	// socket.on('player1Changes', function (data) {
	// 	myCodeMirror1.setOption('value', data.changes)
	// });
	// socket.on('player2Changes', function (data) {
	// 	myCodeMirror2.setOption('value', data.changes)
	// });
	socket.on('otherPlayer', function (data) {
		if (data.player === 1) {
			myCodeMirror2.setOption('value', String(data.changes))
		} else {
			myCodeMirror1.setOption('value', String(data.changes))
		}
		if(data.lost){
			alert('you freaking lost!')
		}
		// myCodeMirror2.setOption('value', data.changes)
	});



	/**
	 * If the other player wins or game is tied, this event is received. 
	 * Notify the user about either scenario and end the game. 
	 */
	socket.on('gameEnd', function (data) {
		// game.endGame(data.message);
		socket.leave(data.room);
	})

	/**
	 * End the game on any err event. 
	 */
	socket.on('err', function (data) {
		// game.endGame(data.message);
		socket.leave(data.room);
	});

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
	});
	myCodeMirror1.on('change', (event) => {
		checkChanges(event, 1)
	})

	var myCodeMirror2 = CodeMirror(editors[1], {
		value: "/*Write your code in this IIFE and use the return as your answer*/\n(function(){\n\nreturn 100;\n\n})()\n",
		mode: "javascript",
	});
	myCodeMirror2.on('change', (event) => {
		checkChanges(event, 2)
	})

	function checkChanges(event, player) {
		let playerNum = player;
		const editorArray = [myCodeMirror1, myCodeMirror2]
		const editorChanges = editorArray[playerNum -= 1].getValue();
		if (player === 1) {
			socket.emit('changes', { room: globalRoomID, player: 1, changes: editorChanges })
		} else {
			socket.emit('changes', { room: globalRoomID, player: 2, changes: editorChanges })
		}
	}

	log1.addEventListener('click', handleOutput)
	log2.addEventListener('click', handleOutput)

	function handleOutput() {
		const target = event.target;
		let editor;
		target === log1 ? editor = myCodeMirror1 : editor = myCodeMirror2;
		const editorValue = editor.getValue()

		if (target === log1) {
			document.getElementById("output1").innerHTML = eval(editorValue)
			if (Number(document.getElementById("output1").textContent) === 1136) {
				gameWon = 1;
				socket.emit('gameWon', { room: globalRoomID, gameWon: gameWon });
				alert('You won!')
			} else {
				alert('thats the wrong answer!')
			}
		}
		else {
			if (Number(document.getElementById("output2").textContent) === 1136) {
				gameWon = 2;
				socket.emit('gameWon', { room: globalRoomID, gameWon: gameWon });
				alert('You won!')
			} else {
				alert('thats the wrong answer!')
			}
		}
	}
})();

