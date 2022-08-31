var frame = [];

function load()
{
	ctrl.init();
	win.init();
}

function update(progress)
{
	
}

function draw()
{
	win.draw();
	gfx.setColor("white");
	app.fillText(mouse.x + " " + mouse.y, 10, 10);
}

function loop(timestamp)
{	
	var progress = timestamp - lastRender;

	update(progress);
	draw();
	
	lastRender = timestamp;
	window.requestAnimationFrame(loop);
}

var lastRender = 0;
window.requestAnimationFrame(loop);

load();

/*
$(function () {

	/// CLIENT CODE \\\

	// Client variables
	var player_connected = false;
	var socket = io();
	
	// Local player variables
	var player_can_move = false;
	
	// When the form submission button is pressed
	$('form').submit(function(e)
	{
	
	e.preventDefault(); // prevents page reloading
	
		// Sanitize input
		var raw_input = $('#m').val();
		var test_empty_msg = raw_input.replace(/\s/g, "");
	
		if (test_empty_msg !== "")
		{
			socket.emit('chat message', raw_input);
			
			// Clear form submission
			$('#m').val('');
		}
		
	return false;
	});
	
	// When the client recieves a message
	socket.on('chat message', function(msg)
	{
		// Add message to page
		$('#messages').append($('<li>').text(msg));
		
		// Move scrollbar to the bottom of the messages
		var chatHistory = document.getElementById("messages");
		chatHistory.scrollTop = chatHistory.scrollHeight;
	});

	socket.on('connect_error', (error) => {
		socket.disconnect();
		console.log('Player Connection Error');
		$("#messages").empty();
		$('#messages').append($('<li>').text("DISCONNECTED"));
	});	
	
	/// GAME CODE \\\

	var player = document.getElementById("app");
	var ctx_player = player.getContext("2d");
 
	function resizeCanvas()
	{
		player.width = window.innerWidth;
		player.height = window.innerHeight;
	}
	resizeCanvas();

	window.addEventListener('resize', resizeCanvas, false);
	
	player.addEventListener('keydown', doKeyDown, true);
	player.addEventListener("keyup", doKeyUp, false);
	
	// Hold local copies of all active players
	var players = new Object();
	players[0] = new Object();
	players[0] = addPlayer("",0,0,1,1);
	
	function clearCanvas()
	{
		player.width = player.width;
	}
	
	$("#player").focusin(function()
	{
		player_can_move = true;
	});
	
	$("#player").focusout(function()
	{
		player_can_move = false;
		
		// Emulate releasing all keys
		var stop_k = [];
		stop_k.keyCode = 87;
		doKeyUp(stop_k);
	});
	
	function doKeyDown(e)
	{
		if (player_can_move)
		{
			if (e.keyCode == 87){
			socket.emit("key down", my_player_id, "up");
			}
		}
	}
	
	function doKeyUp(e)
	{
		if (e.keyCode == 87){
			socket.emit("key up", my_player_id, "up");
		}
	}

	function update(progress)
	{
		
	}

	function draw()
	{
		clearCanvas();
	}
	
	function loop(timestamp)
	{	
		var progress = timestamp - lastRender;

		update(progress);
		draw();
		
		lastRender = timestamp;
		window.requestAnimationFrame(loop);
	}
	
	var lastRender = 0;
	window.requestAnimationFrame(loop);
});
*/