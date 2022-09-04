var gfx = [];

gfx["setColor"] = function(col)
{
	app.fillStyle = col;
	app.lineWidth = 0.1;
	app.strokeStyle = col;
}

gfx["rectangle"] = function(x, y, w, h)
{
	app.beginPath();
	app.rect(x, y, w, h);
	app.fill();
}

gfx["triangle"] = function(x1, y1, x2, y2, x3, y3)
{
	app.filter = 'url(#remove-alpha)';
	app.beginPath();
	app.moveTo(x1, y1);
	app.lineTo(x2, y2);
	app.lineTo(x3, y3);
	app.stroke();
	app.fill();
	app.filter = 'none';
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

gfx["translateSoda"] = function(x, y)
{
	gfx.translate(Math.floor(x) + 0.98000000000022, Math.floor(y) + 0.96000000000038);
}

gfx["clear"] = function()
{
	canvas.width = canvas.width;
}