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