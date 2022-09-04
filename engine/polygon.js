var polygon = [];

polygon["init"] = function ()
{
	polygon["data"] = [];
	polygon["cache"] = [];
}

polygon["new"] = function (fname)
{
	return soda.open(fname);
}

polygon["toggleLayer"] = function (tbl, layer, visible)
{
	let this_model = polygon.data[tbl];
	this_model[layer].visible = visible;
}

polygon["width"] = function (model)
{
	return polygon.data[model].width;
}

polygon["height"] = function (model)
{
	return polygon.data[model].height;
}

polygon["draw"] = function (mname)
{
	if (polygon.data[mname] !== undefined)
	{
		let tbl = polygon.data[mname];

		let i = 0;

		while (i < tbl.length)
		{
			if (tbl[i].visible)
			{
				let clone = tbl[i];
				gfx.setColor(clone.color);

				// Draw the shape
				if (clone.kind === "polygon")
				{
					let j = 0;
					while (j < clone.raw.length)
					{
						// Draw triangle if the vertex[i] contains references to two other vertices (va and vb)
						if (clone.raw[j].vb !== undefined)
						{
							let a_loc = clone.raw[j].va;
							let b_loc = clone.raw[j].vb;
							let aa = clone.raw[j];
							let bb = clone.raw[a_loc];
							let cc = clone.raw[b_loc];

							gfx.triangle(aa.x, aa.y, bb.x, bb.y, cc.x, cc.y);
							// dev.tri_count = dev.tri_count + 1
						}

						j++;
					}
				}
				else if (clone.kind === "ellipse")
				{
					if (clone.raw.length > 1)
					{
						// Load points from raw
						let aa = clone.raw[0];
						let bb = clone.raw[1];
						let cx = 0;
						let cy = 0;
						let cw = 0;
						let ch = 0;

						// Calculate w/h
						cw = Math.abs(aa.x - bb.x) / 2;
						ch = Math.abs(aa.y - bb.y) / 2;

						// Make x/y the points closest to the north west
						if (bb.x < aa.x)
							cx = bb.x;
						else
							cx = aa.x;

						if (bb.y < aa.y)
							cy = bb.y;
						else
							cy = aa.y;

						cx = cx + cw;
						cy = cy + ch;

						let cseg = clone.segments;
						let cang = clone._angle;

						// Ellipse vars
						let v = 0;
						let k = 0;
						let cinc = (360 / cseg);

						while (k < cseg)
						{
							let cx2 = 0;
							let cy2 = 0;
							let cx3 = 0;
							let cy3 = 0;
							let cxx2 = 0;
							let cyy2 = 0;
							let cxx3 = 0;
							let cyy3 = 0;

							cx2 = polygon.lengthdir_x(cw, Math.rad(v));
							cy2 = polygon.lengthdir_y(ch, Math.rad(v));
							cx3 = polygon.lengthdir_x(cw, Math.rad(v + cinc));
							cy3 = polygon.lengthdir_y(ch, Math.rad(v + cinc));
							
							if (cang % 360 !== 0)
							{
								let cang2 = Math.rad(-cang);
								let cc = Math.cos(cang2);
								let ss = Math.sin(cang2);
								cxx2 = polygon.rotateX(cx2, cy2, 0, 0, cc, ss);
								cyy2 = polygon.rotateY(cx2, cy2, 0, 0, cc, ss);
								cxx3 = polygon.rotateX(cx3, cy3, 0, 0, cc, ss);
								cyy3 = polygon.rotateY(cx3, cy3, 0, 0, cc, ss);
							}
							else // Do less math if not rotating
							{
								cxx2 = cx2;
								cyy2 = cy2;
								cxx3 = cx3;
								cyy3 = cy3;
							}
							
							gfx.triangle(cx, cy, (cx + cxx2), (cy + cyy2), (cx + cxx3), (cy + cyy3));
							//dev.tri_count = dev.tri_count + 1
							
							v = v + cinc;
							k = k++;
						}
					}
				}
			}
			i++;
		}
	}
	
}

polygon["lengthdir_x"] = function (length, dir)
{
	return length * Math.cos(dir);
}

polygon["lengthdir_y"] = function (length, dir)
{
	return -length * Math.sin(dir);
}

polygon["rotateX"] = function (x, y, px, py, c, s)
{
	return (c * (x - px) + s * (y - py) + px);
}

polygon["rotateY"] = function (x, y, px, py, c, s)
{
	return (s * (x - px) - c * (y - py) + py);
}