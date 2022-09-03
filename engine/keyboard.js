var keyboard = [];
keyboard.last = "";
keyboard.lastRaw = "";
keyboard.str = "";
keyboard.box = [];

keyboard["newBox"] = function (id, text, style, x, y, w, h, max)
{

}

keyboard["typeKey"] = function (x)
{
	var is_shift = (keyboardRaw["shift"] == 1);

	if (input.caps)
		is_shift = !is_shift;

	if (x.search("^[A-Z]$") == 0)
		keyboard.last = is_shift?x:x.toLowerCase();
	else if (x == 0)
		keyboard.last = is_shift?")":"0";
	else if (x == 1)
		keyboard.last = is_shift?"!":"1";
	else if (x == 2)
		keyboard.last = is_shift?"@":"2";
	else if (x == 3)
		keyboard.last = is_shift?"#":"3";
	else if (x == 4)
		keyboard.last = is_shift?"$":"4";
	else if (x == 5)
		keyboard.last = is_shift?"%":"5";
	else if (x == 6)
		keyboard.last = is_shift?"^":"6";
	else if (x == 7)
		keyboard.last = is_shift?"&":"7";
	else if (x == 8)
		keyboard.last = is_shift?"*":"8";
	else if (x == 9)
		keyboard.last = is_shift?"(":"9";
	else if (x === "space")
		keyboard.last = " ";
	else if (x === "shift")
		keyboard.last = "";
	else if (x === "tilde")
		keyboard.last = is_shift?"~":"`";
	else if (x === "minus")
		keyboard.last = is_shift?"_":"-";
	else if (x === "plus")
		keyboard.last = is_shift?"+":"=";
	else if (x === "squarefrown")
		keyboard.last = is_shift?"{":"[";
	else if (x === "squarehappy")
		keyboard.last = is_shift?"}":"]";
	else if (x === "quote")
		keyboard.last = is_shift?'"':"'";
	else if (x === "comma")
		keyboard.last = is_shift?"<":",";
	else if (x === "period")
		keyboard.last = is_shift?">":".";
	else if (x === "colon")
		keyboard.last = is_shift?":":";";
	else if (x === "question")
		keyboard.last = is_shift?"?":"/";
	else if (x === "bar")
		keyboard.last = is_shift?"|":"/";
	else if (x === "star")
		keyboard.last = "*";
	else if (x === "numplus")
		keyboard.last = "+";
	else if (x === "backspace")
		keyboard.last = "backspace";
	else
		keyboard.last = "";

	if (keyboard.last === "backspace")
	{
		keyboard.str = keyboard.str.slice(0, -1);
		keyboard.last = "";
	}
	else
		keyboard.str += keyboard.last;

	keyboard.lastRaw = x;
}

keyboard["update"] = function (dt)
{

}

/*

ctrl moves from front to back
arrow keys move
delete clears the prompt
ctrl a is all
shift selects
ctrl x is cut
ctrl c is copy
ctrl v is paste
ctrl wasd as keyboard
cmd delete is delete on mac

*/