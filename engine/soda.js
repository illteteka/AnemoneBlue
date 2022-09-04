/*
	Soda artwork importer
	Only works when hosted on a server
*/

var soda = [];

const FILE_EXTENSION = "soda";

// Import vars
let line_count = 0;
let file_state = "SETUP";
let file_pos = 0;

var file = "";
let tbl = [];

soda["open"] = function(fname)
{
	tbl = [];
	tbl.width = 0;
	tbl.height = 0;
	tbl.model_name = soda.stripModelName(fname);
	
	let file_dot = fname.length - reverseString(fname).indexOf('.');
	let file_ext = fname.substring(file_dot);

	if (file_ext == FILE_EXTENSION)
	{
		// This only works on a server
		fetch(fname)
			.then(response => response.text())
			.then((data) => {
				file = data;
		})
	}

	return tbl.model_name;

}

soda["update"] = function()
{
	// Wait for file promise
	if (file !== "")
	{
		// Reset import vars
		line_count = 0;
		file_state = "SETUP";
		file_pos = 0;
		
		soda.read(tbl);

		polygon.data[tbl.model_name] = tbl;

		file = "";
	}
}

soda["stripModelName"] = function(str)
{
	let rev = reverseString(str).indexOf("/");
	return str.slice(str.length - rev, -5);
}

soda["read"] = function(tbl)
{
	let poly_count = 0;
	var lines = file.split('\n');
	
	for (line in lines)
	{
		let this_line = lines[line];
		// Start load
		if (line_count !== 0)
		{
			let cursor = 0;

			if (file_state === "SETUP")
			{
				// Width
				let sub_cursor = this_line.indexOf(",");
				tbl.width = this_line.slice(cursor, sub_cursor);

				// Height
				cursor = sub_cursor + 1;
				sub_cursor = this_line.indexOf(";", cursor);
				tbl.height = this_line.slice(cursor, sub_cursor);

				file_state = "DATA";
			}
			else if (file_state === "DATA")
			{
				tbl[poly_count] = [];

				let vv = 0;
				let nn = 0;

				// Visible
				let sub_cursor = this_line.indexOf(",");
				vv = this_line.slice(cursor, sub_cursor) == 1;
				
				// Layer name
				cursor = sub_cursor + 1;
				sub_cursor = this_line.indexOf(",", cursor);
				nn = this_line.slice(cursor, sub_cursor);

				tbl[poly_count]["visible"] = vv;

				// Shape kind
				cursor = sub_cursor + 1;
				sub_cursor = this_line.indexOf(",", cursor);
				tbl[poly_count]["kind"] = this_line.slice(cursor, sub_cursor);

				let rr = 0;
				let gg = 0;
				let bb = 0;
				let aa = 0;

				// R
				cursor = sub_cursor + 1;
				sub_cursor = this_line.indexOf(",", cursor);
				rr = this_line.slice(cursor, sub_cursor);

				// G
				cursor = sub_cursor + 1;
				sub_cursor = this_line.indexOf(",", cursor);
				gg = this_line.slice(cursor, sub_cursor);

				// B
				cursor = sub_cursor + 1;
				sub_cursor = this_line.indexOf(",", cursor);
				bb = this_line.slice(cursor, sub_cursor);

				// A
				cursor = sub_cursor + 1;
				sub_cursor = this_line.indexOf(":", cursor);
				aa = (Number(this_line.slice(cursor, sub_cursor)) / 255) * 100;

				tbl[poly_count]["color"] = "rgba(" + rr + " " + gg + " " + bb + " / " + aa + "%)"

				// Load data
				this_line = this_line.slice(sub_cursor + 1);
				cursor = 0;

				let new_vertex = false;
				let data_count = 1;
				let vertex_count = 0;

				tbl[poly_count]["raw"] = [];

				while (this_line.length > 0)
				{
					if (new_vertex)
					{
						data_count = 1;
						vertex_count++;
						new_vertex = false;
					}

					sub_cursor = this_line.indexOf(",");
					sub_cc = this_line.indexOf(":");

					if (sub_cc == -1)
						sub_cc = this_line.indexOf(";");

					if (sub_cursor == -1)
						sub_cursor = this_line.length;
					else
					{
						if (sub_cc < sub_cursor)
						{
							sub_cursor = sub_cc;
							new_vertex = true;
						}
					}

					let string_test = this_line.slice(cursor, sub_cursor);
					string_test = string_test.replaceAll(';', '');

					let data_value_string = string_test;
					let data_value = Number(string_test);

					if (data_count == 1)
					{
						tbl[poly_count].raw[vertex_count] = [];
						tbl[poly_count].raw[vertex_count]["x"] = data_value;
					}
					else if (data_count == 2)
					{
						tbl[poly_count].raw[vertex_count]["y"] = data_value;
					}
					else if (data_count == 3)
					{
						if (tbl[poly_count].kind === "polygon")
						{
							if (data_value_string !== "-")
								tbl[poly_count].raw[vertex_count]["va"] = data_value - 1;
						}
						else
						{
							tbl[poly_count]["segments"] = data_value;
						}
					}
					else if (data_count == 4)
					{
						if (tbl[poly_count].kind === "polygon")
						{
							if (data_value_string !== "-")
								tbl[poly_count].raw[vertex_count]["vb"] = data_value - 1;
						}
						else
						{
							tbl[poly_count]["_angle"] = data_value;
						}
					}

					// Repeat
					this_line = this_line.slice(sub_cursor + 1);
					cursor = 0;
					
					data_count = data_count + 1;
				}

				poly_count++;
			}

		}

		line_count++;
		// End load
		file_pos = 0;

	}
}