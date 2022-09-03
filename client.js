let a = 0;
let tick = new Date();
let fps = 0;

let x = 200;
let y = 200;

function load()
{
	ctrl.init();
	win.init();
}

function update(dt)
{
	a += 1 * dt;
	if (w_key == _ON)
		y -= 1 * dt;

	if (s_key == _ON)
		y += 1 * dt;

	if (a_key == _ON)
		x -= 1 * dt;

	if (d_key == _ON)
		x += 1 * dt;
}

function draw()
{

	win.draw();
	gfx.setColor("white");

	let spacing = 24;
	gfx.print(mouse.x + " " + mouse.y, 10, spacing);

	gfx.print(Math.floor(fps), 10, spacing*2);
	gfx.print(Math.floor(a/60), 10, spacing*3);
	gfx.print(mouse_switch + " " + middle_switch + " " + rmb_switch, 10, spacing*4);
	gfx.print(keyboard.str, 10, spacing*5);

	gfx.setColor(hsl(a % 255, 255, 128, 100));
	gfx.push();
	gfx.translate(x,y);
	gfx.rectangle(0,0,100,100);
	gfx.pop();
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
engine/import
engine/polygon
engine/editor
engine/dev (partial)

levels/test_one
levels/test_two

objects/blueguy
objects/guy

soda/x

instances

main
	
	
*/