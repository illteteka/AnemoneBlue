// Global variables
let tick = new Date();
let fps = 0;

// Levels
const LEVEL_TEST_1 = 0;
const LEVEL_TEST_2 = 1;
const LEVEL_EDITOR = 2;

let LEVEL_SWITCH = LEVEL_EDITOR;

function load()
{
	dev.init()
	ctrl.init();
	win.init();

	if (LEVEL_SWITCH == LEVEL_EDITOR)
	{
		editor.init();
	}
	else
	{
		instances.load(); // Needs to happen before loading a level

		if (LEVEL_SWITCH == LEVEL_TEST_1)
			level_test_one.init();
		else if (LEVEL_SWITCH == LEVEL_TEST_2)
			level_test_two.init();
	}
}

function update(dt)
{
	dev.updateDebugMenu(dt);
	keyboard.update(dt);

	if (sleep == 0)
	{
		updateGame(dt);
	}
	else
	{
		sleep = Math.max(sleep - dt, 0);
	}
}

function updateGame(dt)
{
	if (LEVEL_SWITCH == LEVEL_TEST_1)
		level_test_one.update(dt);
	else if (LEVEL_SWITCH == LEVEL_TEST_2)
		level_test_two.update(dt);
	else if (LEVEL_SWITCH == LEVEL_EDITOR)
	{
		editor.update(dt);
	}
}

function drawGame(dt)
{
	if (LEVEL_SWITCH == LEVEL_TEST_1)
		level_test_one.draw();
	else if (LEVEL_SWITCH == LEVEL_TEST_2)
		level_test_two.draw();
	else if (LEVEL_SWITCH == LEVEL_EDITOR)
	{
		editor.draw();
	}
}

function draw()
{
	win.draw();

	if (LEVEL_SWITCH == LEVEL_EDITOR)
	{
		editor.drawUI();
	}

	// Always run this last
	dev.drawDebugMenu();
}

function loop()
{	
	const curTick = new Date();
    fps = 1000 / (curTick - tick);
    tick = curTick;

	let dt = 60/fps;
	if (dt > 10)
	{
		dt = 1;
	}
	
	input.update();
	update(dt);
	draw();
	
	window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);

load();