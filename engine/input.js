var input = [];

const _OFF = 0;
const _ON = 1;
const _PRESS = 2;
const _RELEASE = 3;

var mouse_switch = _OFF;
var rmb_switch = _OFF;
var middle_switch = _OFF;

var mouseRaw = 0;
var keyboardRaw = [];

var alt_key = _OFF;
var enter_key = _OFF;
var space_key = _OFF;
var shift_key = _OFF;

var r_key = _OFF;
var z_key = _OFF;
var y_key = _OFF;

var up_key = _OFF;
var down_key = _OFF;
var left_key = _OFF;
var right_key = _OFF;

var w_key = _OFF;
var s_key = _OFF;
var a_key = _OFF;
var d_key = _OFF;

var minus_key = _OFF;
var plus_key = _OFF;
var grave_key = _OFF;

var t_key = _OFF;

var refreshInput = false;

input.caps = false;

// Enable right click
canvas.addEventListener('contextmenu', event => event.preventDefault());

input["pullSwitch"] = function(a, b)
{
	let output = b;

	if (a)
	{
		if (b == _OFF || b == _RELEASE)
			output = _PRESS;
		else if (b == _PRESS)
			output = _ON;
	}
	else
	{
		if (b == _ON || b == _PRESS)
			output = _RELEASE;
		else if (b == _RELEASE)
			output = _OFF;
	}

	return output;
}

input["combo"] = function(a, b)
{
	return ((a == _ON && b == _PRESS) || (a == _PRESS && b == _ON) || (a == _PRESS && b == _PRESS));
}

input["update"] = function()
{
	// Lose input when focus is lost
	if (!document.hasFocus() || refreshInput)
	{
		for (key in keyboardRaw)
		{
			keyboardRaw[key] = 0;
		}
		//mouseRaw = 0;
		refreshInput = false;
	}
	
	mouse_switch    = input.pullSwitch(mouseRaw == 1, mouse_switch);
	rmb_switch      = input.pullSwitch(mouseRaw == 3, rmb_switch);
	middle_switch   = input.pullSwitch(mouseRaw == 2, middle_switch);

	r_key      = input.pullSwitch(keyboardRaw["R"] == 1, r_key);
	z_key      = input.pullSwitch(keyboardRaw["Z"] == 1, z_key);
	y_key      = input.pullSwitch(keyboardRaw["Y"] == 1, y_key);
	shift_key  = input.pullSwitch(keyboardRaw["shift"] == 1, shift_key);
	alt_key    = input.pullSwitch(keyboardRaw["alt"] == 1, alt_key);
	enter_key  = input.pullSwitch(keyboardRaw["return"] == 1, enter_key);
	space_key  = input.pullSwitch(keyboardRaw["space"] == 1, space_key);
	
	up_key     = input.pullSwitch(keyboardRaw["up"] == 1, up_key);
	down_key   = input.pullSwitch(keyboardRaw["down"] == 1, down_key);
	left_key   = input.pullSwitch(keyboardRaw["left"] == 1, left_key);
	right_key  = input.pullSwitch(keyboardRaw["right"] == 1, right_key);
	
	w_key      = input.pullSwitch(keyboardRaw["W"] == 1, w_key);
	s_key      = input.pullSwitch(keyboardRaw["S"] == 1, s_key);
	a_key      = input.pullSwitch(keyboardRaw["A"] == 1, a_key);
	d_key      = input.pullSwitch(keyboardRaw["D"] == 1, d_key);
	
	t_key      = input.pullSwitch(keyboardRaw["T"] == 1, t_key);

	// Debug and editor keys
	minus_key  = input.pullSwitch(keyboardRaw["minus"] == 1, minus_key);
	plus_key   = input.pullSwitch(keyboardRaw["plus"] == 1, plus_key);
	grave_key  = input.pullSwitch(keyboardRaw["tilde"] == 1, grave_key);
}

function keyDown(e)
{
	input.caps = e.getModifierState && e.getModifierState( 'CapsLock' );

	var key = input.getKey(e.keyCode);

	if (key.search("^[A-Z]$") == 0)
		e.preventDefault();

	if (key === "tab")
		e.preventDefault();

	keyboardRaw[key] = 1;
	keyboard.typeKey(key);
}
window.addEventListener("keydown", keyDown, false);

function keyUp(e)
{
	keyboardRaw[input.getKey(e.keyCode)] = 0;
}
window.addEventListener("keyup", keyUp, false);

input["getKey"] = function(key)
{
	switch (key)
	{
		case 32:
			key = "space";
			break;
		case 13:
			key = "return";
			break;
		case 9:
			key = "tab";
			break;
		case 192:
			key = "tilde";
			break;
		case 189:
		case 109:
			key = "minus";
			break;
		case 187:
			key = "plus";
			break;
		case 107:
			key = "numplus";
			break;
		case 8:
			key = "backspace";
			break;
		case 46:
			key = "delete";
			break;
		case 36:
			key = "home";
			break;
		case 35:
			key = "end";
			break;
		case 33:
			key = "pageup";
			break;
		case 34:
			key = "pagedown";
			break;
		case 20:
			key = "capslock";
			break;
		case 16:
			key = "shift";
			break;
		case 17:
			key = "ctrl";
			break;
		case 18:
			key = "alt";
			break;
		case 91:
		case 93:
			key = "gui";
			break;
		case 38:
			key = "up";
			break;
		case 40:
			key = "down";
			break;
		case 37:
			key = "left";
			break;
		case 39:
			key = "right";
			break;
		case 219:
			key = "squarefrown";
			break;
		case 221:
			key = "squarehappy";
			break;
		case 186:
			key = "colon";
			break;
		case 222:
			key = "quote";
			break;
		case 188:
			key = "comma";
			break;
		case 190:
		case 110:
			key = "period";
			break;
		case 191:
		case 111:
			key = "question";
			break;
		case 220:
			key = "bar";
			break;
		case 106:
			key = "star";
			break;
		case 27:
			key = "escape";
			break;
		case 144:
			key = "numlock";
			break;
		case 112:
			key = "f1";
			break;
		case 113:
			key = "f2";
			break;
		case 114:
			key = "f3";
			break;
		case 115:
			key = "f4";
			break;
		case 116:
			key = "f5";
			break;
		case 117:
			key = "f6";
			break;
		case 118:
			key = "f7";
			break;
		case 119:
			key = "f8";
			break;
		case 120:
			key = "f9";
			break;
		case 121:
			key = "f10";
			break;
		case 122:
			key = "f11";
			break;
		case 123:
			key = "f12";
			break;
		default:
			key = input.convert(key);
	}

	return key;
}

input["convert"] = function(key)
{
	return String.fromCharCode((96 <= key && key <= 105)? key-48 : key);
}

canvas.addEventListener('mousedown', event => {
	event.preventDefault()
	mouseRaw = event.which;
}, false);

canvas.addEventListener('mouseup', event => {
	event.preventDefault()
	mouseRaw = 0;
}, false);