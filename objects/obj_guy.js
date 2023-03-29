var obj_guy = [];

var mdl_guy = gfx.newImage("../anemone-blue/svg/one.svg", 48, 48);
var mdl_test_level = gfx.newImage("../anemone-blue/svg/test-level.svg", 512, 512);

obj_guy["init"] = function()
{
	obj_guy["data"] = [];
	obj_guy.name = "guy";
	editor.importObject("MEN", obj_guy.name, "obj_guy.new(x, y)", mdl_guy);
}

obj_guy["new"] = function(x, y)
{
	let tbl = [];
	tbl["x"] = x;
	tbl["y"] = y;
	obj_guy.data[obj_guy.data.length] = tbl;
}

obj_guy["draw"] = function()
{
	for (ent in obj_guy.data)
	{
		let this_guy = obj_guy.data[ent];
		gfx.push();
		gfx.drawImage(mdl_guy, this_guy.x, this_guy.y);
		gfx.pop();
	}
}

obj_guy["update"] = function(dt)
{
	for (ent in obj_guy.data)
	{
		let this_guy = obj_guy.data[ent];
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