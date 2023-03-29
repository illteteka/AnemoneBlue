var canvas = document.getElementById("app");
var app = canvas.getContext("2d");
const fontSize = 22;

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

/*
	Returns true if the two rects are colliding
*/
CheckCollision = function(x1,y1,w1,h1, x2,y2,w2,h2)
{
	return (x1 < x2+w2 && x2 < x1+w1 && y1 < y2+h2 && y2 < y1+h1);
}

getSquare = function(n)
{
	let p = 1;
	while (p < n)
	{
		p *= 2;
	}
	return p;
}

reverseString = function(str)
{
	return str.split("").reverse().join("");
}

lengthdir_x = function (length, dir)
{
	return length * Math.cos(dir);
}

lengthdir_y = function (length, dir)
{
	return -length * Math.sin(dir);
}

point_direction = function (x1, y1, x2, y2)
{
	return Math.atan2(y2 - y1, x2 - x1);
}

sign = function(x)
{
	if (x == 0)
		return 0;
	else
		return (x < 0)?-1:1;
}

clamp = function(x, min, max)
{
	if (x < min)
		return min;
	else if (x > max)
		return max;
	else
		return x;
}

lerp = function(a, b, amount)
{
	return a + (b - a) * clamp(amount, 0, 1);
}