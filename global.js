var canvas = document.getElementById("app");
var app = canvas.getContext("2d");

round = function(x, inc)
{
	if (inc)
	{
		return round(x / inc) * inc;
	}
	else
	{
		return x >= 0 && Math.floor(x + .5) || Math.ceil(x - .5);
	}
}