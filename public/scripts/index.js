(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var editors = document.querySelectorAll('.codeMirror');
var codeMirror1 = document.querySelector('#codeMirror1');
var codeMirror2 = document.querySelector('#codeMirror2');
var log1 = document.querySelector('#log1');
var log2 = document.querySelector('#log2');
var gameWon = false;

var myCodeMirror1 = CodeMirror(editors[0], {
	value: "/*Write your code in this IIFE and use the return as your answer*/\n(function(){\n\nreturn 100;\n\n})()\n",
	mode: "javascript",
	lineNumbers: true
});
myCodeMirror1.on('change', function () {
	checkChanges(1);
});

var myCodeMirror2 = CodeMirror(editors[1], {
	value: "/*Write your code in this IIFE and use the return as your answer*/\n(function(){\n\nreturn 100;\n\n})()\n",
	mode: "javascript",
	lineNumbers: true
});
myCodeMirror2.on('change', function () {
	checkChanges(2);
});

function checkChanges(player) {
	var playerNum = player;
	console.log(player);
}

log1.addEventListener('click', handleOutput);
log2.addEventListener('click', handleOutput);

function handleOutput() {
	var target = event.target;
	var editor = void 0;
	target === log1 ? editor = myCodeMirror1 : editor = myCodeMirror2;
	console.log(editor);
	var editorValue = editor.getValue();
	console.log(editorValue);

	if (target === log1) {
		document.getElementById("output1").innerHTML = eval(editorValue);
		gameWon = 1;
		socket.emit('gameWon', gameWon);
	} else {
		document.getElementById("output2").innerHTML = eval(editorValue);
		gameWon = 2;
		socket.emit('gameWon', gameWon);
	}
}

var socket = io();
socket.on('message', function (data) {
	console.log(data);
});

},{}],2:[function(require,module,exports){
'use strict';

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./app":1}]},{},[2]);
