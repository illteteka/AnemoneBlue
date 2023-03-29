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

gfx["line"] = function(x1, y1, x2, y2)
{
	app.beginPath();
	app.moveTo(x1, y1);
	app.lineTo(x2, y2);
	app.stroke();
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

gfx["printf"] = function(t, x, y, limit, align)
{
	app.font = fontSize + 'px dsp';
	let tbl = [];
	let tempLen = 0;
	let tempStr = "";

	// Break string into lines that fit in limit
	while (t !== "")
	{
		while (tempLen < limit)
		{
			tempStr = tempStr + t.slice(0,1);
			t = t.slice(1);

			tempLen = gfx.getTextWidth(tempStr);

			// String ended
			if (t === "")
			{
				tempLen = limit + 1;
			}
		}

		tbl.push(tempStr)
		tempStr = "";
		tempLen = 0;
	}

	if (align === "right")
	{
		for (str in tbl)
		{
			let tt = tbl[str];
			app.fillText(tbl[str], x + limit - gfx.getTextWidth(tt), y + ((fontSize+0)*str));
		}
	}
	else if (align === "center")
	{
		for (str in tbl)
		{
			let tt = tbl[str];
			let xc = ((win.w/2) - (gfx.getTextWidth(tt)/2));
			app.fillText(tt, xc, y + ((fontSize+0)*str));
		}
	}
	else
	{
		for (str in tbl)
		{
			app.fillText(tbl[str], x, y + ((fontSize+0)*str));
		}
	}
	
}

gfx["push"] = function()
{
	if (LEVEL_SWITCH === LEVEL_EDITOR)
		app.save();
}

gfx["pop"] = function()
{
	if (LEVEL_SWITCH === LEVEL_EDITOR)
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

gfx["drawImage"] = function(img, x, y)
{
	app.drawImage(img, x, y, img.w, img.h);
}