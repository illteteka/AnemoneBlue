var editor = [];

// Import editor icons
var edit_move = gfx.newImage("svg/editor/edit_move.svg", 24, 24);
var edit_grid = gfx.newImage("svg/editor/edit_grid.svg", 24, 24);
var edit_reset = gfx.newImage("svg/editor/edit_reset.svg", 24, 24);
var edit_trash = gfx.newImage("svg/editor/edit_trash.svg", 24, 24);
var edit_print = gfx.newImage("svg/editor/edit_print.svg", 24, 24);
var edit_zoom = gfx.newImage("svg/editor/edit_zoom.svg", 24, 24);
var edit_undo = gfx.newImage("svg/editor/edit_undo.svg", 24, 24);
var edit_redo = gfx.newImage("svg/editor/edit_redo.svg", 24, 24);
var edit_random = gfx.newImage("svg/editor/edit_random.svg", 24, 24);
var edit_lock = gfx.newImage("svg/editor/edit_lock.svg", 24, 24);
var edit_default = gfx.newImage("svg/editor/edit_default.svg", 48, 48);

// Update with defaults for obj vars
editor["insertObject"] = function(src, x, y)
{
	let tbl = [];

	let this_create = editor.getExport(src.name);
	this_create = this_create.slice(this_create.indexOf("(") + 1)

	while (this_create.indexOf(")") !== -1)
	{
		let next = this_create.indexOf(",");
		let endSearch = false;
		if (next == -1)
		{
			next = this_create.indexOf(")");
			endSearch = true;
		}

		let this_var = this_create.slice(0, next);
		this_create = this_create.slice(next + 1);
		this_var = this_var.replace(/\s/g, "");

		if (this_var === "x")
			tbl[this_var] = x;
		else if (this_var === "y")
			tbl[this_var] = y;
		else if (this_var === "w")
			tbl[this_var] = 0;
		else if (this_var === "h")
			tbl[this_var] = 0;
		else if (this_var === "color")
			tbl[this_var] = "white";
	}

	src.push(tbl);
}

// Update with all levels to be used in editor
editor["importLevels"] = function()
{
	let win_color = win.color;

	editor.copyLevel(level_test_one);
	editor.copyLevel(level_test_two);

	editor.storeEdits();

	// Reset window color back
	win.color = win_color;
}

/*
	Editor do once
*/
editor["load"] = function()
{
	win.color = "rgba(6 13 69 / 100%)";

	editor["toolbar"] = [];
	editor.addTool("MOVE", edit_move);
	editor.addTool("GRID", edit_grid);
	editor.addTool("RESETCAM", edit_reset);
	editor.addTool("TRASH", edit_trash);
	editor.addTool("ZOOM", edit_zoom);
	editor.addTool("PRINT", edit_print);
	editor.addTool("RANDOM", edit_random);
	editor.addTool("LOCK", edit_lock);
	editor.addTool("UNDO", edit_undo);
	editor.addTool("REDO", edit_redo);

	editor.toolbar["x"] = 16;
	editor.toolbar["y"] = 200;
	editor.toolbar["btn_size"] = 24;
	editor.toolbar["w"] = editor.toolbar.btn_size * 2;
	editor.toolbar["h"] = Math.ceil(editor.toolbar.length / 2) * editor.toolbar.btn_size;

	editor["modes"] = [];

	editor.importObject("NONE", "");

	editor["current_mode"] = 0;
	editor["current_object"] = 0;
	editor["current_level"] = 0;

	editor["is_moving"] = false;
	editor["move_group"]   = 0; // Type of object being moved
	editor["move_obj"]     = 0; // Individual instance ^^
	editor["move_model"]   = edit_default; // Move object's model

	editor["edits"] = []; // Undo stack
	editor["edit_cursor"] = 0;

	editor.levels = [];

	editor["midx"] = 0;
	editor["midy"] = 0;

	editor["lastmousex"] = 0;
	editor["lastmousey"] = 0;

	editor["color"] = "white";
}

editor["init"] = function()
{
	editor.load();

	editor["level_w"] = 5;
	editor["level_h"] = 5;

	editor.initCamera();

	editor["mouse"] = [];
	let emouse = editor.mouse;
	emouse["x"] = 0;
	emouse["y"] = 0;
	emouse["start_x"] = 0;
	emouse["start_y"] = 0;
	emouse["is_selecting"] = 0;

	instances.load();

	editor.importLevels();
}

editor["storeEdits"] = function()
{
	let levels_copy = [];
	for (level in editor.levels)
	{
		let this_lvl = editor.levels[level];
		let a_level = [];
		
		for (inst in this_lvl)
		{
			let inst_copy = [];
			
			let this_inst = this_lvl[inst]

			for (obj in this_inst)
			{
				let obj_copy = [];
				let this_obj = this_inst[obj]
				
				if (this_inst[obj].x !== undefined)
				{
					for (key in this_obj)
					{
						obj_copy[key] = this_obj[key];
					}
					inst_copy.push(obj_copy);
				}
				
			}
			a_level.push(inst_copy);
		}
		levels_copy.push(a_level);
	}

	if (editor.edits.length == editor.edit_cursor)
	{
		editor.edits.push(levels_copy);
		editor.edit_cursor++;
	}
	else if (editor.edit_cursor !== 0)
	{
		editor.edits = editor.edits.slice(0, editor.edit_cursor);
		editor.edits.push(levels_copy);
		editor.edit_cursor = editor.edits.length
	}
	
}

editor["loadEdits"] = function(edit)
{
	let levels_copy = [];
	for (level in edit)
	{
		let this_lvl = edit[level];
		let a_level = [];
		
		for (inst in this_lvl)
		{
			let inst_copy = [];
			
			let this_inst = this_lvl[inst]

			let this_name = editor.levels[level][inst].name;
			editor.levels[level][inst] = [];
			for (obj in this_inst)
			{
				let obj_copy = [];
				let this_obj = this_inst[obj]
				
				if (this_inst[obj].x !== undefined)
				{
					for (key in this_obj)
					{
						obj_copy[key] = this_obj[key];
					}
					editor.levels[level][inst].push(obj_copy);
				}
				
			}
			editor.levels[level][inst]["name"] = this_name;

		}
	}
	
}

editor["undo"] = function()
{
	editor.edit_cursor = Math.max(editor.edit_cursor - 1, 1);
	editor.loadEdits(editor.edits[editor.edit_cursor - 1]);
}

editor["redo"] = function()
{
	editor.edit_cursor = Math.min(editor.edit_cursor + 1, editor.edits.length);
	editor.loadEdits(editor.edits[editor.edit_cursor - 1]);
}

editor["updateMouse"] = function(dt)
{
	let emouse = editor.mouse;
	emouse.x = Math.floor(mouse.rx/48);
	emouse.y = Math.floor(mouse.ry/48);

	let etool = editor.toolbar;
	let toolbar_is_active = CheckCollision(mouse.x, mouse.y, 1, 1, etool.x, etool.y, etool.w, etool.h);

	let allTools = editor.getActiveTools();
	let emove = allTools.emove;
	let egrid = allTools.egrid;
	let etrash = allTools.etrash;

	if (mouse_switch == _PRESS)
	{

		if (!toolbar_is_active)
		{
			emouse.start_x = emouse.x;
			emouse.start_y = emouse.y;
			emouse.is_selecting = true;

			if (emove)
				editor.checkInstanceMoveable();
		}

	}

	if (mouse_switch == _ON)
	{

		if (editor.is_moving)
		{
			let this_lvl = editor.levels[editor.current_level];
			let this_obj = this_lvl[editor.move_group][editor.move_obj];
			let ww = editor.move_model.w / 2;
			let hh = editor.move_model.h / 2;

			if (egrid)
			{
				this_obj.x = Math.floor(mouse.rx/48) * 48;
				this_obj.y = Math.floor(mouse.ry/48) * 48;
			}
			else
			{
				this_obj.x = Math.floor(mouse.rx - ww);
				this_obj.y = Math.floor(mouse.ry - hh);
			}

		}

	}

	if (mouse_switch == _RELEASE)
	{

		let storeThis = false;

		if (!toolbar_is_active)
		{

			if (emove)
			{
				// Do nothing
			}
			else if (etrash)
			{
				editor.deleteInstance();
				storeThis = true;
			}
			else
			{
				storeThis = editor.placeInstance(egrid);
			}

		}

		if (editor.is_moving)
		{
			editor.move_group = 0;
			editor.move_obj = 0;
			editor.move_model = edit_default;
			editor.is_moving = false;
			storeThis = true;
		}

		emouse.is_selecting = false;

		if (storeThis)
			editor.storeEdits();

	}

	// Pan with middle mouse button
	if (middle_switch == _PRESS)
	{
		editor.midx = mouse.rx;
		editor.midy = mouse.ry;

		editor.lastmousex = mouse.x;
		editor.lastmousey = mouse.y;
	}

	if (middle_switch == _ON)
	{
		if (editor.lastmousex !== mouse.x || editor.lastmousey !== mouse.y)
		{
			camera.x += mouse.rx - editor.midx;
			camera.y += mouse.ry - editor.midy;
		}
		
		editor.lastmousex = mouse.x;
		editor.lastmousey = mouse.y;
	}

	let ctrl = ((keyboardRaw["ctrl"] == 1) || (keyboardRaw["gui"] == 1))
	if (mouse_switch == _OFF)
	{
		if (ctrl && z_key == _PRESS)
		{
			editor.undo();
		}

		if (ctrl && y_key == _PRESS)
		{
			editor.redo();
		}
	}
}

editor["export"] = function()
{
	let export_buffer = "";
	export_buffer += "//------------------START--------------------\n";

	let this_lvl = editor.levels[editor.current_level];
	let i = 0;
	while (i < this_lvl.length)
	{

		let j = 0;
		while (j < this_lvl[i].length)
		{
			let this_create = editor.getExport(this_lvl[i].name);
			let this_obj = this_lvl[i][j];

			let fname = this_create.slice(0, this_create.indexOf("("))
			this_create = this_create.slice(this_create.indexOf("(") + 1)

			let exp_str = "" + fname + "(";

			while (this_create.indexOf(")") !== -1)
			{
				let next = this_create.indexOf(",");
				let endSearch = false;
				if (next == -1)
				{
					next = this_create.indexOf(")");
					endSearch = true;
				}

				let this_var = this_create.slice(0, next);
				this_create = this_create.slice(next + 1);
				this_var = this_var.replace(/\s/g, "");

				let vv = this_obj[this_var];
				if (typeof vv === 'string')
					vv = '\"' + vv + '\"';

				if (endSearch)
					exp_str = exp_str + vv + ");";
				else
					exp_str = exp_str + vv + ", ";
			}

			export_buffer += exp_str + "\n";

			j++;
		}
		i++;

	}

	export_buffer += "//-------------------END---------------------\n";

	console.log(export_buffer);
}

editor["checkInstanceMoveable"] = function()
{
	let this_lvl = editor.levels[editor.current_level];

	let allTools = editor.getActiveTools();
	let elock = allTools.elock;

	let move_group = -1;
	let move_obj = -1;
	let move_model = edit_default;

	let i = 0;
	while (i < this_lvl.length)
	{
		let this_model = editor.getModel(this_lvl[i].name);

		if (this_lvl[i] !== undefined && this_lvl[i] !== undefined)
		{
			let j = 0;
			while (j < this_lvl[i].length)
			{

				let this_obj = this_lvl[i];
				let xx = this_obj[j].x;
				let yy = this_obj[j].y;
				let ww = editor.move_model.w;
				let hh = editor.move_model.h;

				if (this_obj[j].w !== undefined)
				{
					ww = this_obj[j].w * 48;
					hh = this_obj[j].h * 48;
				}

				let check_clicked = CheckCollision(xx, yy, ww, hh, mouse.rx, mouse.ry, 1, 1);

				if (elock && (this_obj.name !== editor.modes[editor.current_mode].objects[editor.current_object]))
					check_clicked = false;

				if (check_clicked)
				{
					move_group = i;
					move_obj = j;
					move_model = this_model;
					j = this_lvl[i].length + 1;
				}

				j++;
			}
		}
		else
		{
			i = this_lvl.length + 1;
		}

		i++;
	}

	if (move_group !== -1)
	{
		editor.is_moving = true;
		editor.move_group   = move_group;
		editor.move_obj     = move_obj;
		editor.move_model   = move_model;
	}

}

editor["deleteInstance"] = function()
{
	let this_lvl = editor.levels[editor.current_level];

	let allTools = editor.getActiveTools();
	let elock = allTools.elock;

	let delete_group = -1;
	let delete_obj = -1;

	let i = 0;
	while (i < this_lvl.length)
	{
		let this_model = editor.getModel(this_lvl[i].name);

		if (this_lvl[i] !== undefined && this_lvl[i] !== undefined)
		{
			let j = 0;
			while (j < this_lvl[i].length)
			{
				let this_obj = this_lvl[i];
				let xx = this_obj[j].x;
				let yy = this_obj[j].y;
				let ww = editor.move_model.w;
				let hh = editor.move_model.h;
				let check_clicked = CheckCollision(xx, yy, ww, hh, mouse.rx, mouse.ry, 1, 1);

				if (elock && (this_obj.name !== editor.modes[editor.current_mode].objects[editor.current_object]))
					check_clicked = false;

				if (check_clicked)
				{
					delete_group = i;
					delete_obj = j;
					j = this_lvl[i].length + 1;
				}

				j++
			}
		}
		else
		{
			i = this_lvl.length + 1;
		}

		i++;
	}

	if (delete_group !== -1)
	{
		let name = this_lvl[delete_group].name;
		let a = this_lvl[delete_group].slice(0,delete_obj);
		a = a.concat(this_lvl[delete_group].slice(delete_obj + 1));
		this_lvl[delete_group] = a;
		this_lvl[delete_group]["name"] = name;
	}
}

editor["placeInstance"] = function(grid_on)
{
	let this_lvl = editor.levels[editor.current_level];

	let selected_obj = editor.modes[editor.current_mode].objects[editor.current_object];
	let selected_mdl = editor.modes[editor.current_mode].model[editor.current_object];

	let placed = false;

	let emouse = editor.mouse;

	let i = 0;
	while (i < this_lvl.length)
	{

		if (this_lvl[i].name === selected_obj)
		{
			let obj_tbl = this_lvl[i];
			let mx = mouse.rx;
			let my = mouse.ry;
			let pw = editor.move_model.w / 2;
			let ph = editor.move_model.h / 2;

			if (grid_on)
			{
				mx = Math.floor(mouse.rx/48) * 48;
				my = Math.floor(mouse.ry/48) * 48;
				pw = 0;
				ph = 0;
			}
			
			editor.insertObject(obj_tbl, Math.floor(mx - pw), Math.floor(my - ph));

			placed = true;
		}
		i++;
	}

	return placed;
}

editor["drawLevel"] = function()
{
	// Draw current level

	let i = 0;
	let this_lvl = editor.levels[editor.current_level];
	
	while (i < this_lvl.length)
	{
		let nn = this_lvl[i].name;

		// Retrieve the model the object uses for the editor
		let this_model = editor.getModel(nn);

		// Draw all objects
		let j = 0;
		while (j < this_lvl[i].length)
		{
			let this_obj = this_lvl[i][j];
			let xx = this_obj.x;
			let yy = this_obj.y;

			gfx.push();
			gfx.translate(xx, yy);
			gfx.drawImage(this_model, 0, 0);
			gfx.pop();

			j++;
		}

		i++;
	}
}

editor["draw"] = function()
{

	editor.drawLevel();

	let emouse = editor.mouse;
	let etool = editor.toolbar;

	let toolbar_is_active = CheckCollision(mouse.x, mouse.y, 1, 1, etool.x, etool.y, etool.w, etool.h);

	if (!toolbar_is_active)
	{

		// Draw mouse cursor box
		if (emouse.is_selecting)
		{
			gfx.setColor("rgba(0 255 0 / 100%)");
			rect_thick(emouse.start_x*48, emouse.start_y*48, (emouse.x * 48) - (emouse.start_x*48), (emouse.y * 48) - (emouse.start_y*48), 2/camera.zoom);
		}
		else
		{
			gfx.setColor("rgba(255 0 0 / 100%)");
			rect_thick(emouse.x*48, emouse.y*48, 48, 48, 2/camera.zoom);
		}

	}

	// Draw level boundary
	gfx.setColor("white");
	rect_thick(48, 48, editor.level_w*48, editor.level_h*48, 2/camera.zoom);

	// Draw don't place boundary
	gfx.setColor("rgba(255 0 0 / 50%)");
	rect_thick_topleft(48, 48, (Math.abs(camera.x) + win.w)/camera.zoom, (Math.abs(camera.y) + win.h)/camera.zoom, 2/camera.zoom);
}

editor["drawUI"] = function()
{
	gfx.push();
	gfx.translate(16, 16);
	gfx.setColor("white");

	let data_camera = Math.floor(camera.x) + ", " + Math.floor(camera.y);
	let data_mouse = Math.floor(mouse.rx) + ", " + Math.floor(mouse.ry);
	let data_grid = Math.floor(mouse.rx/48) + ", " + Math.floor(mouse.ry/48);
	let data_zoom = Math.floor(Math.floor(camera.zoom * 10000) / 100) + "%";
	let data_ed = editor.modes[editor.current_mode].name + " " + editor.modes[editor.current_mode].objects[editor.current_object];
	let data_lvl = editor.current_level;

	gfx.print("camera: "             + data_camera, 0, 11*2.2);
	gfx.print("mouse: "              + data_mouse,  0, 22*2.2);
	gfx.print("grid: "               + data_grid,   0, 33*2.2);
	gfx.print("zoom: "               + data_zoom,   0, 44*2.2);
	gfx.print("[SHIFT] editor: "     + data_ed,     0, 55*2.2);
	gfx.print("[ALT] level: "        + data_lvl,    0, 66*2.2);

	editor.drawToolbar();

	let emouse = editor.mouse;

	if (emouse.is_selecting)
	{
		let select_x = emouse.x - emouse.start_x;
		let select_y = emouse.y - emouse.start_y;

		gfx.setColor("rgba(0 255 0 / 100%)")
		gfx.printf("size: " + select_x + ", " + select_y, 400, 24, 9999, "center");
	}

	gfx.pop();
}

editor["drawToolbar"] = function()
{
	let etool = editor.toolbar;

	let i = 0;
	let xx = 0;
	let yy = 0;
	let px = etool.x - 16;
	let py = etool.y - 16;

	let button_size = etool.btn_size;
	let hover_color = "rgba(234 41 181 / 100%)";
	let press_color = "rgba(242 169 224 / 100%)";
	let active_color = "rgba(234 41 181 / 40%)";

	gfx.push();
	gfx.translate(px, py);

	while (i < etool.length)
	{
		gfx.push();
		gfx.translate(xx, yy);

		let button_color = "white";
		let is_hovered = 0;
		let is_active = etool[i].active;

		if (CheckCollision(mouse.x, mouse.y, 1, 1, px + xx + 16, py + yy + 16, button_size, button_size))
		{
			button_color = hover_color;
			is_hovered = 1;

			if (mouse_switch == _ON)
				button_color = press_color;
		}

		if (is_active)
		{
			gfx.setColor(active_color);
			gfx.rectangle(0,0,button_size - 1,button_size - 1);
		}

		gfx.setColor(button_color)
		rect_thick(0,0,button_size - 1,button_size - 1,1 + is_hovered * 2);
		gfx.scale(1, 1);
		gfx.drawImage(etool[i].model, 0, 0);

		xx += button_size;
		if (xx > button_size)
		{
			xx = 0;
			yy += button_size;
		}

		gfx.pop();
		i++;
			
	}

	gfx.pop();
}

editor["updateToolbar"] = function(dt)
{
	let etool = editor.toolbar;

	let i = 0;
	let xx = 0;
	let yy = 0;
	let px = etool.x - 16;
	let py = etool.y - 16;

	let defer_undo = false;
	let defer_redo = false;

	let button_size = etool.btn_size;

	while (i < etool.length)
	{
		let button_color = "white";
		let is_hovered = 0;

		if (CheckCollision(mouse.x, mouse.y, 1, 1, px + xx + 16, py + yy + 16, button_size, button_size))
		{
			let is_hovered = 1;

			if (mouse_switch == _PRESS)
			{

				let tool_clicked = etool[i].name;

				if (tool_clicked === "RESETCAM")
					editor.initCamera();
				else if (tool_clicked === "TRASH")
					etool[i].active = !etool[i].active;
				else if (tool_clicked === "GRID")
					etool[i].active = !etool[i].active;
				else if (tool_clicked === "MOVE")
					etool[i].active = !etool[i].active;
				else if (tool_clicked === "ZOOM")
					etool[i].active = !etool[i].active;
				else if (tool_clicked === "RANDOM")
					etool[i].active = !etool[i].active;
				else if (tool_clicked === "LOCK")
					etool[i].active = !etool[i].active;
				else if (tool_clicked === "PRINT")
					editor.export();
				else if (tool_clicked === "UNDO")
					defer_undo = true;
				else if (tool_clicked === "REDO")
					defer_redo = true;

			}
		}

		xx += button_size;
		if (xx > button_size)
		{
			xx = 0;
			yy += button_size;
		}
		
		i++;
	}

	if (defer_undo)
		editor.undo();
	else if (defer_redo)
		editor.redo();
}

editor["update"] = function(dt)
{
	editor.updateMouse(dt);
	editor.updateToolbar(dt);
	editor.updateCamera(dt);
	editor.updateScroll(dt);

	// Load color picker
	if (document.getElementById('extra').innerHTML !== undefined)
	{
		if (document.getElementById('extra').innerHTML.indexOf("color") == -1)
			document.getElementById('extra').innerHTML = '<input style="position: absolute;z-index: 0;top: ' + (editor.toolbar.y + editor.toolbar.h) + 'px;left: 15px;" type="color" id="color" value="#ff0000">';

		editor.color = getColor(document.getElementById('color').value);
	}
}

editor["updateScroll"] = function(dt)
{
	if (mouse.wheel !== 0)
	{

		let allTools = editor.getActiveTools();
		let ezoom = allTools.ezoom;

		if (ezoom)
		{
			editor.updateZoom(dt);
			mouse.wheel = 0;
		}

		let mode_switch = editor.current_object;
		let mode_list = editor.modes[editor.current_mode].objects;

		if (shift_key == _ON)
		{
			mode_switch = editor.current_mode;
			mode_list = editor.modes;
		}
		else if (alt_key == _ON)
		{
			mode_switch = editor.current_level;
			mode_list = editor.levels;
		}

		if (mouse.wheel < 0)
			mode_switch--;

		if (mouse.wheel > 0)
			mode_switch++;
		
		if (mode_switch < 0)
			mode_switch = mode_list.length - 1;

		if (mode_switch > mode_list.length - 1)
			mode_switch = 0;

		if (shift_key == _ON) // Change object group
		{
			editor.current_mode = mode_switch;
			editor.current_object = 0;
		}
		else if (alt_key == _ON) // Change level
		{
			editor.current_level = mode_switch;
			instances.list = editor.levels[editor.current_level];
		}
		else // Change object
			editor.current_object = mode_switch;

	}

	mouse.wheel = 0;
}

editor["updateZoom"] = function(dt)
{
	let old_cam_x = camera.x;
	let old_cam_y = camera.y;
	let old_zoom = camera.zoom;

	let mx = (mouse.x / win.scale) - camera.x;
	let my = (mouse.y / win.scale) - camera.y;

	let dscale = 1.1;

	let k = Math.pow(dscale, mouse.wheel);
	camera.zoom = camera.zoom * k;

	camera.x = Math.floor(camera.x + mx*(1-k)+0.5);
	camera.y = Math.floor(camera.y + my*(1-k)+0.5);

	if (camera.zoom < 0.1 || camera.zoom > 1000)
	{
		camera.x = old_cam_x;
		camera.y = old_cam_y;
		camera.zoom = old_zoom;
	}
}

editor["updateCamera"] = function(dt)
{
	let c_spd = 4;

	if (w_key == _ON)
		camera.y = camera.y + c_spd * dt;

	if (s_key == _ON)
		camera.y = camera.y - c_spd * dt;

	if (a_key == _ON)
		camera.x = camera.x + c_spd * dt;

	if (d_key == _ON)
		camera.x = camera.x - c_spd * dt;
}

// Editor helper methods

editor["addTool"] = function(name, icon)
{
	let tbl = [];
	tbl["name"] = name;
	tbl["model"] = icon;
	tbl["active"] = false;
	editor.toolbar[editor.toolbar.length] = tbl;
}

editor["importObject"] = function(category, name, create, model)
{

	// Only load editor objects if we're in the editor
	let only_load_in_editor = LEVEL_SWITCH === LEVEL_EDITOR;

	if (only_load_in_editor)
	{

		if (!model)
			model = edit_default;

		// Look through existing categories
		// Add the new object to the category if it exists

		let i = 0;
		let add_mode = true;
		while (i < editor.modes.length)
		{
			if (editor.modes[i].name === category)
			{
				let j = 0;
				let object_exists = false;

				while (j <= editor.modes[i].objects.length)
				{
					if (editor.modes[i].objects[j] === name)
						object_exists = true;

					j++;
				}

				if (!object_exists)
				{
					editor.modes[i].objects.push(name);
					editor.modes[i].create.push(create);
					editor.modes[i].model.push(model);
				}

				add_mode = false;
			}

			i++;
		}

		// If the category doesn't exist, make a new one
		if (add_mode)
		{
			let tbl = [];
			tbl["name"] = category;

			tbl["create"] = [];
			tbl.create.push(create);

			tbl["objects"] = [];
			tbl.objects.push(name);

			tbl["model"] = [];
			tbl.model.push(model);

			editor.modes.push(tbl);
		}

	}

}

editor["copyLevel"] = function(lvl)
{
	lvl.level();

	let tbl = [];

	for (inst in instances.list)
	{
		let tbl2 = [];

		let this_inst = instances.list[inst];
		tbl2["name"] = this_inst.name;

		for (obj in this_inst.data)
		{
			let this_obj = this_inst.data[obj];
			tbl3 = [];
			for (key in this_obj)
			{
				tbl3[key] = this_obj[key];
			}
			tbl2.push(tbl3);
		}
		tbl.push(tbl2);
	}

	instances.clear();

	editor.levels.push(tbl);

	editor.current_level = editor.levels.length - 1;
}

editor["initCamera"] = function()
{
	camera.x = win.half_w - 48;
	camera.y = win.half_h - 48;
	camera.zoom = 1;
}

editor["getActiveTools"] = function()
{
	let tbl = [];
	tbl["emove"] = false;
	tbl["egrid"] = false;
	tbl["etrash"] = false;
	tbl["ezoom"] = false;
	tbl["erandom"] = false;
	tbl["elock"] = false;

	let i = 0;
	while (i < editor.toolbar.length)
	{
		if (editor.toolbar[i].name === "MOVE" && editor.toolbar[i].active)
			tbl.emove = true;

		if (editor.toolbar[i].name === "GRID" && editor.toolbar[i].active)
			tbl.egrid = true;

		if (editor.toolbar[i].name === "TRASH" && editor.toolbar[i].active)
			tbl.etrash = true;

		if (editor.toolbar[i].name === "ZOOM" && editor.toolbar[i].active)
			tbl.ezoom = true;

		if (editor.toolbar[i].name === "RANDOM" && editor.toolbar[i].active)
			tbl.erandom = true;

		if (editor.toolbar[i].name === "LOCK" && editor.toolbar[i].active)
			tbl.elock = true;

		i++;
	}

	return tbl;
}

editor["getModel"] = function(object_name)
{

	// Retrieve the model the object uses for the editor
	let this_model = edit_default;
	let k = 0;
	while (k < editor.modes.length)
	{
		let m = 0;
		while (m < editor.modes[k].objects.length)
		{
			if (editor.modes[k].objects[m] === object_name)
				this_model = editor.modes[k].model[m];
			
			m++;
		}

		k++;
	}

	return this_model;

}

editor["getExport"] = function(object_name)
{
	// Retrieve the code the object uses for the editor
	let this_create = "";
	let k = 0;
	while (k < editor.modes.length)
	{
		let m = 0;
		while (m < editor.modes[k].objects.length)
		{
			if (editor.modes[k].objects[m] === object_name)
				this_create = editor.modes[k].create[m];

			m++;
		}

		k++;
	}

	return this_create;
}

rect_thick = function(x,y,w,h,t)
{
	gfx.rectangle(x,y,w-t,t);
	gfx.rectangle(x+t,y+h-t,w-t,t);
	gfx.rectangle(x,y+t,t,h-t);
	gfx.rectangle(x+w-t,y,t,h-t);
}

rect_thick_topleft = function(x,y,w,h,t)
{
	gfx.rectangle(x,y,w-t,t);
	gfx.rectangle(x,y+t,t,h-t);
}

function getColor(hex)
{
	let allTools = editor.getActiveTools();
	let erandom = allTools.erandom;

	let color = HexToHSL(hex)

	if (erandom)
		color.l = ((128-Math.random()*64)/255)*100;
	
	return 'hsl(' + color.h + ', ' + color.s + '%, ' + color.l + '%)'
}

function HexToHSL(hex)
{
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	var r = parseInt(result[1], 16);
	var g = parseInt(result[2], 16);
	var b = parseInt(result[3], 16);

	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if(max == min){
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch(max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		
		h /= 6;
	}

	s = s*100;
	s = Math.round(s);
	l = l*100;
	l = Math.round(l);
	h = Math.round(360*h);

	return {h, s, l};
}