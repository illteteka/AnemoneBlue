var keyboard = [];
keyboard.box = [];
keyboard.box.active = "";
keyboard.last = "";
keyboard.str = "";
keyboard.cursor = 0;
keyboard.cursorTimer = 0;
keyboard.cursorFlip = true;
keyboard.cursor_end = 0;
keyboard.selection = false;

var rainbow = "white";
var rainbow_timer = 0;

keyboard["newBox"] = function (id, x, y, w, h, max = 0, style = "default", hiddenText = "", next = "", text = "")
{
	var tbl = [];
	tbl.id = id;
	tbl.text = text;
	tbl.style = style;
	tbl.x = x;
	tbl.y = y;
	tbl.w = w;
	tbl.h = h;
	tbl.max = max;
	tbl.hiddenText = hiddenText;
	tbl.next = next;
	tbl.visible = true;

	keyboard.box[id] = tbl;
}

keyboard["isActive"] = function(x)
{
	return keyboard.box.active === x;
}

keyboard["setActive"] = function(x)
{
	refreshInput = true;
	keyboard.box.active = x;
}

keyboard["clear"] = function()
{
	keyboard.box = [];
	keyboard.box.active = "";
	keyboard.last = "";
	keyboard.str = "";
	keyboard.cursor = 0;
	keyboard.cursorTimer = 0;
	keyboard.cursorFlip = true;
	keyboard.cursor_end = 0;
	keyboard.selection = false;
}

keyboard["draw"] = function()
{
	for (box in keyboard.box)
	{
		if (box !== "active")
		{
			let tb = keyboard.box[box];
			let x = tb.x;
			let y = tb.y;
			let w = tb.w;
			let h = tb.h;
			let id = tb.id;
			let hiddenText = tb.hiddenText;
			let text = tb.text;
			let style = tb.style;
			let visible = tb.visible;

			if (visible)
			{
				if (style == "default")
				{
					let activeColor = keyboard.isActive(id)?rainbow:"white";
					gfx.setColor(activeColor);
					gfx.rectangle(x, y, w, h);
					gfx.setColor("black");
					gfx.rectangle(x + 1, y + 1, w - 2, h - 2);

					if (!keyboard.isActive(id))
					{
						if ((hiddenText !== "") && (text === ""))
						{
							gfx.setColor("gray");
							gfx.print(hiddenText, x + 5, y + 4 + fontSize)
						}

						gfx.setColor("white");
						gfx.print(text, x + 5, y + 4 + fontSize);
					}
					else
					{
						let left = text;
						let middle = "";
						let end = "";
						
						if (keyboard.selection && (keyboard.cursor_end !== keyboard.cursor))
						{
							let first = Math.min(keyboard.cursor, keyboard.cursor_end);
							let last = (first == keyboard.cursor)?keyboard.cursor_end:keyboard.cursor;

							left = text.slice(0,first);
							middle = text.slice(first,last);
							end = text.slice(last,text.length);
						}

						gfx.setColor("white");
						gfx.print(left, x + 5, y + 4 + fontSize);

						if (middle !== "")
						{
							gfx.setColor("lightblue");
							gfx.rectangle(x + 6 + gfx.getTextWidth(left), y + 3, gfx.getTextWidth(middle), 21)
							gfx.setColor("black");
							gfx.print(middle, x + 5 + gfx.getTextWidth(left), y + 4 + fontSize);
							gfx.setColor("white");
							gfx.print(end, x + 5 + gfx.getTextWidth(left) + gfx.getTextWidth(middle), y + 4 + fontSize);
						}
					}

				}
				else if (style == "password")
				{
					let activeColor = keyboard.isActive(id)?rainbow:"white";
					gfx.setColor(activeColor);
					gfx.rectangle(x, y, w, h);
					gfx.setColor("black");
					gfx.rectangle(x + 1, y + 1, w - 2, h - 2);

					let hide = "";
					let i = 0;
					while (i < text.length)
					{
						hide += "\u2022";
						i++;
					}

					text = hide;

					if (!keyboard.isActive(id))
					{
						if ((hiddenText !== "") && (text === ""))
						{
							gfx.setColor("gray");
							gfx.print(hiddenText, x + 5, y + 4 + fontSize);
						}

						gfx.setColor("white");
						gfx.print(text, x + 5, y + 4 + fontSize);
					}
					else
					{
						let left = text;
						let middle = "";
						let end = "";
						
						if (keyboard.selection && (keyboard.cursor_end !== keyboard.cursor))
						{
							let first = Math.min(keyboard.cursor, keyboard.cursor_end);
							let last = (first == keyboard.cursor)?keyboard.cursor_end:keyboard.cursor;

							left = text.slice(0,first);
							middle = text.slice(first,last);
							end = text.slice(last,text.length);
						}

						gfx.setColor("white");
						gfx.print(left, x + 5, y + 4 + fontSize);

						if (middle !== "")
						{
							gfx.setColor("lightblue");
							gfx.rectangle(x + 6 + gfx.getTextWidth(left), y + 3, gfx.getTextWidth(middle), 21)
							gfx.setColor("black");
							gfx.print(middle, x + 5 + gfx.getTextWidth(left), y + 4 + fontSize);
							gfx.setColor("white");
							gfx.print(end, x + 5 + gfx.getTextWidth(left) + gfx.getTextWidth(middle), y + 4 + fontSize);
						}
					}
				}

				if (keyboard.isActive(id) && keyboard.cursorFlip)
				{
					let left = text.slice(0,keyboard.cursor);
					gfx.setColor("white");
					let ox = x + gfx.getTextWidth(left);
					let oy = y + 3
					gfx.rectangle(ox + 6, oy, 2, 21)
				}
			}
			
		}
	}
}

keyboard["update"] = function (dt)
{
	// Update rainbow
	rainbow_timer += dt;
	if (rainbow_timer > 255)
		rainbow_timer -= 255;
	rainbow = "hsl(" + (rainbow_timer / 255)*360 + " 100% 50%)"

	let mouseClick = false;
	let mx = mouse.x;
	let my = mouse.y;
	if (mouse_switch == _PRESS)
	{
		mouseClick = true;

		if (!keyboard.isActive(""))
		{
			let temp_x = keyboard.box[keyboard.box.active].x;
			let letter = gfx.getTextWidth("1");
			let mx2 = mouse.x + 5 - temp_x;
			let pos = Math.floor(mx2/letter);
			pos = Math.max(pos, 0);
			pos = Math.min(pos, keyboard.str.length);
			keyboard.cursor = pos;
			keyboard.cursor_end = pos;
			keyboard.selection = true;
		}
	}
	let receivedClick = false;

	for (box in keyboard.box)
	{
		if (box !== "active")
		{
			let tb = keyboard.box[box];
			let x = tb.x;
			let y = tb.y;
			let w = tb.w;
			let h = tb.h;
			let id = tb.id;
			let max = tb.max;
			let next = tb.next;
			let visible = tb.visible;

			if (visible)
			{
				if (mouseClick && CheckCollision(mx, my, 1, 1, x, y, w, h))
				{
					if (!keyboard.isActive(id))
					{
						keyboard.str = keyboard.box[id].text;
						keyboard.cursor = keyboard.box[id].text.length;
						keyboard.selection = false;
					}

					keyboard.setActive(id);
					receivedClick = true;
				}

				if (mouse_switch == _ON)
				{
					if (keyboard.isActive(id))
					{
						let letter = gfx.getTextWidth("1");
						let mx3 = mouse.x + 5 - x;
						let pos = Math.floor(mx3/letter);
						pos = Math.max(pos, 0);
						pos = Math.min(pos, keyboard.str.length);
						keyboard.cursor = pos;
						keyboard.cursorFlip = true;
						keyboard.cursorTimer = 0;
					}
				}
				
				if (keyboard.isActive(id))
				{
					keyboard.cursorTimer += dt;
					if (keyboard.cursorTimer > 37)
					{
						keyboard.cursorFlip = !keyboard.cursorFlip;
						keyboard.cursorTimer = 0;
					}

					keyboard.box[id].text = keyboard.str;

					if (keyboard.last === "tab")
					{
						keyboard.setActive(next);
						keyboard.last = "";

						if (next !== "")
						{
							keyboard.str = keyboard.box[next].text;
							keyboard.cursor = keyboard.box[next].text.length;
						}
						else
						{
							keyboard.cursor = 0;
							keyboard.str = "";
						}

						keyboard.selection = false;
					}

					if (keyboard.last === "return")
					{
						keyboard.str = "";
						keyboard.setActive("");
						keyboard.last = "";
						keyboard.cursor = 0;
						keyboard.selection = false;
					}
					
				}
			}
			
		}
	}

	if (keyboard.box.active !== "")
	{
		if (mouseClick && !receivedClick)
		{
			keyboard.str = "";
			keyboard.setActive("");
			keyboard.cursor = 0;
			keyboard.selection = false;
		}
	}
	
}

keyboard["typeKey"] = async function (x)
{
	if (keyboard.box.active !== "")
	{
		var is_shift = (keyboardRaw["shift"] == 1);
		var is_shift_raw = (keyboardRaw["shift"] == 1);

		if (input.caps)
			is_shift = !is_shift;

		var write_x = true;

		if (x.search("^[A-Z]$") == 0)
			x = is_shift?x:x.toLowerCase();
		else if (x == 0)
			x = is_shift?")":"0";
		else if (x == 1)
			x = is_shift?"!":"1";
		else if (x == 2)
			x = is_shift?"@":"2";
		else if (x == 3)
			x = is_shift?"#":"3";
		else if (x == 4)
			x = is_shift?"$":"4";
		else if (x == 5)
			x = is_shift?"%":"5";
		else if (x == 6)
			x = is_shift?"^":"6";
		else if (x == 7)
			x = is_shift?"&":"7";
		else if (x == 8)
			x = is_shift?"*":"8";
		else if (x == 9)
			x = is_shift?"(":"9";
		else if (x === "space")
			x = " ";
		else if (x === "shift")
		{
			x = "";
			write_x = false;
		}
		else if (x === "tilde")
			x = is_shift?"~":"`";
		else if (x === "minus")
			x = is_shift?"_":"-";
		else if (x === "plus")
			x = is_shift?"+":"=";
		else if (x === "squarefrown")
			x = is_shift?"{":"[";
		else if (x === "squarehappy")
			x = is_shift?"}":"]";
		else if (x === "quote")
			x = is_shift?'"':"'";
		else if (x === "comma")
			x = is_shift?"<":",";
		else if (x === "period")
			x = is_shift?">":".";
		else if (x === "colon")
			x = is_shift?":":";";
		else if (x === "question")
			x = is_shift?"?":"/";
		else if (x === "bar")
			x = is_shift?"|":"/";
		else if (x === "star")
			x = "*";
		else if (x === "numplus")
			x = "+";
		else if (x === "backspace")
			x = "backspace";
		else
		{
			write_x = false;
		}

		let move_key = (x == 'up') || (x == 'down') || (x == 'left') || (x == 'right');

		let left = keyboard.str.slice(0,keyboard.cursor);
		let right = keyboard.str.slice(keyboard.cursor);

		let ctrl = ((keyboardRaw["ctrl"] == 1) || (keyboardRaw["gui"] == 1))

		if ((x === "backspace") && (!ctrl))
		{
			if (keyboard.selection)
			{
				let first = Math.min(keyboard.cursor, keyboard.cursor_end);
				let last = (first == keyboard.cursor)?keyboard.cursor_end:keyboard.cursor;

				left = keyboard.str.slice(0,first);
				middle = "";
				end = keyboard.str.slice(last,keyboard.str.length);

				keyboard.str = left + middle + end;

				keyboard.cursor = first;

				keyboard.selection = false;
			}
			else
			{
				let left_erase = left.slice(0, -1);
				keyboard.str = left_erase + right;
			}

			keyboard.cursorTimer = 0;
			keyboard.cursorFlip = true;
			keyboard.cursor--;
		}
		else if (ctrl && (x.toLowerCase() === "v"))
		{   // Paste

			let clip = await navigator.clipboard.readText();

			if (keyboard.selection)
			{
				let first = Math.min(keyboard.cursor, keyboard.cursor_end);
				let last = (first == keyboard.cursor)?keyboard.cursor_end:keyboard.cursor;

				left = keyboard.str.slice(0,first);
				end = keyboard.str.slice(last,keyboard.str.length);

				let this_active = keyboard.box.active;
				let this_max = 0;

				if (this_active !== "")
					this_max = keyboard.box[this_active].max;

				if (this_max == 0)
				{
					keyboard.str = left + clip + right;
					let test_len = left + clip;
					keyboard.cursor = test_len.length;
				}
				else
				{
					let test_len = left + end;
					let remaining = this_max - test_len.length;
					test_len = left + clip.slice(0, remaining);
					keyboard.str = left + clip.slice(0, remaining) + end;
					keyboard.cursor = test_len.length;
				}

				keyboard.selection = false;
			}
			else
			{
				let this_active = keyboard.box.active;
				let this_max = 0;

				if (this_active !== "")
					this_max = keyboard.box[this_active].max;

				if (this_max == 0)
				{
					keyboard.str = left + clip + right;
					let test_len = left + clip;
					keyboard.cursor = test_len.length;
				}
				else
				{
					let test_len = left + right;
					let remaining = this_max - test_len.length;
					test_len = left + clip.slice(0, remaining);
					keyboard.str = left + clip.slice(0, remaining) + right;
					keyboard.cursor = test_len.length;
				}
				
			}
		}
		else if (ctrl && (x.toLowerCase() === "c"))
		{
			let first = Math.min(keyboard.cursor, keyboard.cursor_end);
			let last = (first == keyboard.cursor)?keyboard.cursor_end:keyboard.cursor;
			navigator.clipboard.writeText(keyboard.str.slice(first,last));
		}
		else if (ctrl && (x.toLowerCase() === "x"))
		{
			let first = Math.min(keyboard.cursor, keyboard.cursor_end);
			let last = (first == keyboard.cursor)?keyboard.cursor_end:keyboard.cursor;
			navigator.clipboard.writeText(keyboard.str.slice(first,last));

			left = keyboard.str.slice(0,first);
			middle = "";
			end = keyboard.str.slice(last,keyboard.str.length);

			keyboard.str = left + middle + end;

			keyboard.cursor = first;

			keyboard.selection = false;
		}
		else if (ctrl && (x.toLowerCase() === "a"))
		{
			keyboard.cursor = keyboard.str.length;
			keyboard.cursor_end = 0;
			keyboard.selection = true;
		}
		else if (move_key)
		{
			keyboard.cursorTimer = 0;
			keyboard.cursorFlip = true;

			if (is_shift_raw)
			{ // Shift selection

				if (ctrl)
				{
					if (x == "left")
					{
						if (!keyboard.selection)
							keyboard.cursor_end = keyboard.cursor;
						keyboard.cursor = 0;
						keyboard.selection = true;
						x = "";
					}

					if (x == "right")
					{
						if (!keyboard.selection)
							keyboard.cursor_end = keyboard.cursor;
						keyboard.cursor = keyboard.str.length;
						keyboard.selection = true;
						x = "";
					}
				}
				else
				{
					if (x == "left")
					{
						if (!keyboard.selection)
							keyboard.cursor_end = keyboard.cursor;
						keyboard.cursor = Math.max(keyboard.cursor - 1, 0);
						keyboard.selection = true;
						x = "";
					}

					if (x == "right")
					{
						if (!keyboard.selection)
							keyboard.cursor_end = keyboard.cursor;
						keyboard.cursor = Math.min(keyboard.cursor + 1, keyboard.str.length);
						keyboard.selection = true;
						x = "";
					}
				}
				
				if (keyboard.cursor_end == keyboard.cursor)
				{
					keyboard.selection = false;
				}

			}
			else
			{ // Arrow key cursor
				if (x == "left")
				{
					if (keyboard.selection)
					{
						keyboard.selection = false;
						keyboard.cursor = Math.min(keyboard.cursor_end, keyboard.cursor);
					}
					else
					{
						keyboard.cursor--;
					}

					if (ctrl)
						keyboard.cursor = 0;
				}

				if (x == "right")
				{
					if (keyboard.selection)
					{
						keyboard.selection = false;
						keyboard.cursor = Math.max(keyboard.cursor_end, keyboard.cursor);
					}
					else
					{
						keyboard.cursor++;
					}

					if (ctrl)
						keyboard.cursor = keyboard.str.length;
				}
			}

		}
		else if ((x === "delete") || ((x === "backspace") && (ctrl)))
		{
			keyboard.str = "";
			keyboard.cursor = 0;
			keyboard.cursorTimer = 0;
			keyboard.cursorFlip = true;
		}
		else
		{
			if (write_x)
			{
				let this_active = keyboard.box.active;
				let this_max = 0;

				if (this_active !== "")
					this_max = keyboard.box[this_active].max;

				if (!((this_max !== 0) && (keyboard.str.length + 1 > this_max)))
				{
					if (keyboard.selection)
					{
						let first = Math.min(keyboard.cursor, keyboard.cursor_end);
						let last = (first == keyboard.cursor)?keyboard.cursor_end:keyboard.cursor;

						left = keyboard.str.slice(0,first);
						middle = x;
						end = keyboard.str.slice(last,keyboard.str.length);

						keyboard.str = left + middle + end;

						keyboard.cursor = first;

						keyboard.selection = false;
					}
					else
					{
						keyboard.str = left + x + right;
					}

					keyboard.cursorTimer = 0;
					keyboard.cursorFlip = true;
					keyboard.cursor++;
				}

				if (keyboard.str.length + 1 > this_max)
				{
					if (keyboard.selection)
					{
						let first = Math.min(keyboard.cursor, keyboard.cursor_end);
						let last = (first == keyboard.cursor)?keyboard.cursor_end:keyboard.cursor;

						left = keyboard.str.slice(0,first);
						middle = x;
						end = keyboard.str.slice(last,keyboard.str.length);

						keyboard.str = left + middle + end;

						keyboard.cursor = first;

						keyboard.selection = false;
					}

					keyboard.cursorTimer = 0;
					keyboard.cursorFlip = true;
					keyboard.cursor++;
				}
			}
		}

		if (keyboard.cursor < 0)
			keyboard.cursor = 0;

		if (keyboard.cursor > keyboard.str.length)
			keyboard.cursor = keyboard.str.length;

		keyboard.last = x;
	}
}