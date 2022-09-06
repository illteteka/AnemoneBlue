// Global variables
let tick = new Date();
let fps = 0;

// Levels
const LEVEL_TEST_1 = 0;
const LEVEL_TEST_2 = 1;
const LEVEL_EDITOR = 2;

let LEVEL_SWITCH = LEVEL_EDITOR;

// Debug variables
let a = 0;
let rainbow = "white";

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

	/*
	keyboard.newBox("testbox", 300, 300, 20 * fontSize, fontSize + 5, 32, "default", "Username", "testbo2");
	keyboard.newBox("testbo2", 300, 350, 20 * fontSize, fontSize + 5, 32, "password", "Password", "testbox");

	keyboard.newBox("no", 300, 400, 20 * fontSize, fontSize + 5);
	keyboard.newBox("yes", 300, 450, 20 * fontSize, fontSize + 5, 0, "default", "Password", "testbox", "league of leg");
	*/
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

	// DEBUG
	a += 1 * dt;
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
	
	/*
	gfx.setColor("white");

	let spacing = fontSize + 2;
	gfx.print(mouse.x + " " + mouse.y, 10, spacing);

	gfx.print(Math.floor(fps), 10, spacing*2);
	gfx.print(Math.floor(a/60), 10, spacing*3);
	gfx.print(mouse_switch + " " + middle_switch + " " + rmb_switch, 10, spacing*4);
	//gfx.print(keyboard.str, 10, spacing*5);

	rainbow = hsl(a % 255, 255, 128, 100);

	keyboard.draw();
	obj_guy.draw();
	//gfx.setColor(rainbow);
	*/
	
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

/*
main again
*/