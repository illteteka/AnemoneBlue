var instances = [];

/*
	Load all instances into the game
	Should only happen once
*/
instances["load"] = function()
{
	obj_guy.init();

	/*
		Add every instance that needs to be cleared to this list
		Switching levels will destroy all non persistent objects
	*/
	instances["list"] = [obj_guy];
}

/*
	Remove all active objects from the scene
*/
instances["clear"] = function()
{
	for (inst in instances.list)
	{
		let this_inst = instances.list[inst];
		this_inst.init();
	}
}