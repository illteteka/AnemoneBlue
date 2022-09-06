var level_test_two = [];

level_test_two["level"] = function()
{
	win.color = "red";
	obj_guy.new(0, 0);
	obj_guy.new(48, 48);
}

level_test_two["init"] = function()
{
	LEVEL_SWITCH = LEVEL_TEST_2;
	instances.clear();
	level_test_two.level();
}

level_test_two["update"] = function(dt)
{
	obj_guy.update(dt);
	
	if (r_key == _PRESS)
	{
		level_test_one.init();
	}
}

level_test_two["draw"] = function()
{
	//polygon.draw(test_level);
	obj_guy.draw();
}