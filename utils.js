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

hsl = function(h,s,l,a)
{
	if (s<=0) {return "rgba(1 1 1 / " + a + "%)"}
	h = h/256*6;
	s = s/255;
	l = l/255;
	let c = (1-Math.abs(2*l-1))*s;
	let x = (1-Math.abs(h%2-1))*c;
	let m = (l-.5*c);
	let r = 0;
	let g = 0;
	let b = 0;
	if (h < 1)
	{
		r = c;
		g = x;
		b = 0;
	}
	else if (h < 2)
	{
		r = x;
		g = c;
		b = 0;
	}
	else if (h < 3)
	{
		r = 0;
		g = c;
		b = x;
	}
	else if (h < 4)
	{
		r = 0;
		g = x;
		b = c;
	}
	else if (h < 5)
	{
		r = x;
		g = 0;
		b = c;
	}
	else
	{
		r = c;
		g = 0;
		b = x;
	}
	return "rgba(" + (r+m)*255 + " " + (g+m)*255 + " " + (b+m)*255 + " / " + a + "%)"
}

reverseString = function(str)
{
	return str.split("").reverse().join("");
}