var guy = [];

guy["init"] = function()
{
	guy["data"] = [];
	guy.name = "guy";
	//editor.importObject("MEN", guy.name, "obj_guy.new", ent_player);
}

guy["new"] = function(x, y)
{
	let tbl = [];
	tbl["x"] = x;
	tbl["y"] = y;
	guy.data[guy.data.length] = tbl;
}

guy["draw"] = function()
{
	for (ent in guy.data)
	{
		let this_guy = guy.data[ent];
		gfx.push();
		gfx.translateSoda(this_guy.x, this_guy.y);
		polygon.draw(test_soda);
		gfx.pop();
	}
}

guy["update"] = function(dt)
{
	for (ent in guy.data)
	{
		let this_guy = guy.data[ent];
		if (w_key == _ON)
			this_guy.y -= 1 * dt;

		if (s_key == _ON)
			this_guy.y += 1 * dt;

		if (a_key == _ON)
			this_guy.x -= 1 * dt;

		if (d_key == _ON)
			this_guy.x += 1 * dt;
	}
}