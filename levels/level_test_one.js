var level_test_one = [];

level_test_one["level"] = function()
{
	win.color = "red";
	obj_guy.new(83, 99);
	obj_guy.new(369, 93);
	obj_guy.new(95, 219);
	obj_guy.new(105, 243);
	obj_guy.new(114, 257);
	obj_guy.new(121, 265);
	obj_guy.new(133, 279);
	obj_guy.new(155, 292);
	obj_guy.new(174, 307);
	obj_guy.new(191, 310);
	obj_guy.new(200, 312);
	obj_guy.new(211, 316);
	obj_guy.new(230, 316);
	obj_guy.new(251, 313);
	obj_guy.new(272, 308);
	obj_guy.new(289, 301);
	obj_guy.new(302, 294);
	obj_guy.new(314, 287);
	obj_guy.new(326, 273);
	obj_guy.new(335, 257);
	obj_guy.new(346, 239);
	obj_guy.new(352, 227);
	obj_guy.new(357, 215);
	obj_guy.new(362, 204);
	obj_guy.new(362, 204);
}

level_test_one["init"] = function()
{
	LEVEL_SWITCH = LEVEL_TEST_1;
	instances.clear();
	level_test_one.level();
}

level_test_one["update"] = function(dt)
{
	obj_guy.update(dt);

	if (r_key == _PRESS)
	{
		level_test_two.init();
	}
}

level_test_one["draw"] = function()
{
	gfx.drawImage(mdl_test_level);
	obj_guy.draw();
}