var gfx = [];

gfx["setColor"] = function(col)
{
	app.fillStyle = col;
}

gfx["rectangle"] = function(x, y, w, h)
{
	app.beginPath();
	app.rect(x, y, w, h);
	app.fill();
}

gfx["triangle"] = function(x1, y1, x2, y2, x3, y3)
{
	app.beginPath();
	app.moveTo(x1, y1);
	app.lineTo(x2, y2);
	app.lineTo(x3, y3);
	app.fill();
}

gfx["getTextWidth"] = function(t)
{
	const metrics = app.measureText(t);
	return metrics.width;
}

gfx["print"] = function(t, x, y)
{
	app.font = fontSize + 'px dsp';
	app.fillText(t, x, y);
}

gfx["printCenter"] = function(t, x, y)
{
	app.font = fontSize + 'px dsp';
	x = ((win.w/2) - (gfx.getTextWidth(t)/2)) - 16;
	gfx.print(t, x, y);
}

gfx["push"] = function()
{
	app.save();
}

gfx["pop"] = function()
{
	app.restore();
}

gfx["scale"] = function(x, y)
{
	app.scale(x, y);
}

gfx["translate"] = function(x, y)
{
	app.translate(x, y);
}

gfx["clear"] = function()
{
	canvas.width = canvas.width;
}

gfx["newImage"] = function(x, w, h)
{
	var this_img = new Image();
	this_img.src = x;
	this_img.w = w;
	this_img.h = h;

	return this_img;
}

gfx["drawImage"] = function(img)
{
	app.drawImage(img, 0, 0, img.w, img.w);
}