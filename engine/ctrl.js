/*
	Global game state controller
*/

var ctrl = [];

// Init containers
var camera = [];
var mouse = [];
var sleep = 0;

ctrl["init"] = function ()
{
	// Init camera
	camera.x = 0;
	camera.y = 0;
	camera.zoom = 1;

	// Init mouse
	mouse.x = 0;
	mouse.y = 0;
	// Mouse relative to zoom and camera
	mouse.rx = 0;
	mouse.ry = 0;

	mouse.wheel = 0;

	sleep = 0;
}

ctrl["update"] = function ()
{
	// Get mouse pos, relative to screen scale
	
	var mx = mouse.x / window.scale;
	var my = mouse.y / window.scale;
	mx = (mx - camera.x)/camera.zoom;
	my = (my - camera.y)/camera.zoom;

	mouse.rx = mx;
	mouse.ry = my;
}

canvas.addEventListener('mousemove', event => {
	const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
	ctrl.update();
}, false);
