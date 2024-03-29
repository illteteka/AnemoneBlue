/*
	Global game state controller
*/

var ctrl = [];

// Init containers
var camera = [];
var mouse = [];
var sleep = 0;

const isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;

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
	mouse.wheelRaw = 0;

	sleep = 0;
}

ctrl["update"] = function ()
{
	// Get mouse pos, relative to screen scale
	
	var mx = mouse.x / win.scale;
	var my = mouse.y / win.scale;
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

canvas.addEventListener("wheel", event => {
	if (isMac)
	{
		let changed = false;
		if (Math.abs(event.deltaY) > mouse.wheelRaw && Math.abs(event.deltaY) !== 0)
			changed = true;

		mouse.wheelRaw = Math.abs(event.deltaY);

		if (changed)
	    	mouse.wheel = Math.sign(event.deltaY) * -1;
	    else
	    	mouse.wheel = 0;
	}
	else
	{
		mouse.wheel = Math.sign(event.deltaY) * -1;
	}
	
});