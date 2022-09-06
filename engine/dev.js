/*
	Developer Tools
	(Debug menus)
*/
var dev = [];

dev["init"] = function()
{
	dev["debug_window"] = false;
}

dev["updateDebugMenu"] = function()
{
	// Enter and exit debug mode
	if (grave_key == _PRESS)
		dev.debug_window = !dev.debug_window;
}

dev["drawDebugMenu"] = function()
{
	// Draw debug window
	if (dev.debug_window)
	{
		gfx.setColor("rgba(0 0 255 / 50%)")
		gfx.rectangle(0,0,225,48);
		gfx.setColor("white");
		gfx.print("fps: " + Math.floor(fps), 16, 34);
	}
}