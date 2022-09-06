var win = [];

// Global constants
const WINDOW_BG = "black";

win.init = function ()
{
	// Init window
	win.w = document.documentElement.clientWidth;
	win.h = document.documentElement.clientHeight;
	win.x = 0;
	win.y = 0;
	
	win.scale = 1;
	
	win.half_w = Math.floor(win.w/2);
	win.half_h = Math.floor(win.h/2);

	win.color = "black";
}

win["resize"] = function ()
{
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
	
	win.w = canvas.width;
	win.h = canvas.height;
	
	win.half_w = Math.floor(win.w/2);
	win.half_h = Math.floor(win.h/2);
}
window.addEventListener('resize', win.resize, true);
window.addEventListener('load', win.resize, true);

win["draw"] = function ()
{
	gfx.clear();

	// Screen scaling
	gfx.push();
	
		gfx.scale(win.scale, win.scale);
		
		// Draw window background
		gfx.setColor(win.color);
		gfx.rectangle(0, 0, win.w, win.h);
		
		// Center window
		gfx.push()
		
			var rnd = (win.w/(win.scale*win.w));
			if (rnd == 1) {rnd = 0.5};
			
			gfx.translate(round(camera.x, rnd), round(camera.y, rnd));
			gfx.scale(camera.zoom, camera.zoom);
			
			drawGame();
		
		gfx.pop();
		// End center window
	
	gfx.pop();
	// End screen scaling
}