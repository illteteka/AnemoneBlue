let a = 0;
let tick = new Date();
let fps = 0;

let rainbow = "white";

let test_soda = "";
let test_soda2 = "";

function load()
{
	ctrl.init();
	win.init();
	polygon.init();

	keyboard.newBox("testbox", 300, 300, 20 * fontSize, fontSize + 5, 32, "default", "Username", "testbo2");
	keyboard.newBox("testbo2", 300, 350, 20 * fontSize, fontSize + 5, 32, "password", "Password", "testbox");

	keyboard.newBox("no", 300, 400, 20 * fontSize, fontSize + 5);
	keyboard.newBox("yes", 300, 450, 20 * fontSize, fontSize + 5, 0, "default", "Password", "testbox", "league of leg");

	guy.init();
	guy.new(150, 150);

	test_soda = polygon.new("../soda/one.soda");
	test_soda2 = polygon.new("../soda/test-level.soda");
}

function update(dt)
{
	soda.update();
	keyboard.update(dt);

	guy.update(dt);

	a += 1 * dt;
}

function draw()
{
	win.draw();
	gfx.setColor("white");

	let spacing = fontSize + 2;
	gfx.print(mouse.x + " " + mouse.y, 10, spacing);

	gfx.print(Math.floor(fps), 10, spacing*2);
	gfx.print(Math.floor(a/60), 10, spacing*3);
	gfx.print(mouse_switch + " " + middle_switch + " " + rmb_switch, 10, spacing*4);
	//gfx.print(keyboard.str, 10, spacing*5);

	rainbow = hsl(a % 255, 255, 128, 100);

	keyboard.draw();
	guy.draw();
	//gfx.setColor(rainbow);
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
engine/editor
engine/dev (partial)

levels/test_one
levels/test_two

soda/x

instances

main
*/