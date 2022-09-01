fetch('../soda/one.soda')
	.then(response => response.text())
	.then((data) => {
		console.log(data)
})
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

soda["open"] = function(fname)
{
	let tbl = [];
	tbl.width = 0;
	tbl.height = 0;
	tbl.model_name = import.stripModelName(fname);
	
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

		// Reset import vars
		line_count = 0;
		file_state = "SETUP";
		file_pos = 0;
		
		import.read(tbl, fname);
	}

	polygon.data[tbl.model_name] = tbl;

	return tbl.model_name;

}

/*
function import.stripModelName(str)
	local s = string.reverse(str)
	local c = ""

	local i = 1
	while i <= string.len(s) do

		local this_l = string.sub(s, i, i)

		if this_l ~= "/" then
			c = this_l .. c
		else
			i = string.len(s) + 1
		end

		i = i + 1
	end

	return string.sub(c, 1, -6)

end

function import.read(tbl, file)

	local poly_count = 1
	
	local i
	for line in love.filesystem.lines(file) do
		local load_line = line:find("\n")
	
		i = line:sub(file_pos,load_line)
		i = i:gsub("\n", "")
		
		-- Start load
		if (line_count ~= 0) then
			local cursor = 0
			
			if file_state == "SETUP" then
				-- Width
				local sub_cursor = string.find(i, ",")
				tbl.width = tonumber(i:sub(cursor, sub_cursor - 1))
				
				-- Height
				cursor = sub_cursor + 1
				sub_cursor = string.find(i, ";", cursor)
				tbl.height = tonumber(i:sub(cursor, sub_cursor - 1))
				
				file_state = "DATA"
				
			elseif file_state == "DATA" then
			
				table.insert(tbl, {})
			
				local vv, nn
			
				-- Visible
				local sub_cursor = string.find(i, ",")
				if i:sub(cursor, sub_cursor - 1) == "1" then
					vv = true
				else
					vv = false
				end
				
				-- Layer name
				cursor = sub_cursor + 1
				sub_cursor = string.find(i, ",", cursor)
				nn = i:sub(cursor, sub_cursor - 1)
				
				tbl[poly_count].visible = vv
				
				-- Shape kind
				cursor = sub_cursor + 1
				sub_cursor = string.find(i, ",", cursor)
				tbl[poly_count].kind = i:sub(cursor, sub_cursor - 1)
				
				local rr,gg,bb,aa
				
				-- R
				cursor = sub_cursor + 1
				sub_cursor = string.find(i, ",", cursor)
				rr = tonumber(i:sub(cursor, sub_cursor - 1)) / 255
				
				-- G
				cursor = sub_cursor + 1
				sub_cursor = string.find(i, ",", cursor)
				gg = tonumber(i:sub(cursor, sub_cursor - 1)) / 255
				
				-- B
				cursor = sub_cursor + 1
				sub_cursor = string.find(i, ",", cursor)
				bb = tonumber(i:sub(cursor, sub_cursor - 1)) / 255
				
				-- A
				cursor = sub_cursor + 1
				sub_cursor = string.find(i, ":", cursor)
				aa = tonumber(i:sub(cursor, sub_cursor - 1)) / 255
				
				tbl[poly_count].color = {rr,gg,bb,aa}
				
				-- Load data
				i = i:sub(sub_cursor + 1)
				cursor = 0
				
				local new_vertex = false
				local data_count = 1
				local vertex_count = 1
				
				tbl[poly_count].raw = {}
				
				while i:len() > 0 do
				
					if new_vertex then
						data_count = 1
						vertex_count = vertex_count + 1
						new_vertex = false
					end
					
					local sub_cursor = string.find(i, ",")
					local sub_cc = string.find(i, ":")
					
					if (sub_cc == nil) then
						sub_cc = string.find(i, ";")
					end
					
					if sub_cursor == nil then
						sub_cursor = i:len()
					else
						if sub_cc < sub_cursor then
							sub_cursor = sub_cc
							new_vertex = true
						end
					end
					
					local string_test = i:sub(cursor, sub_cursor - 1)
					string_test = string_test:gsub(";", "")
					
					local data_value_string = string_test
					local data_value = tonumber(string_test)
					
					if (data_count == 1) then
						tbl[poly_count].raw[vertex_count] = {}
						tbl[poly_count].raw[vertex_count].x = data_value
					elseif (data_count == 2) then
						tbl[poly_count].raw[vertex_count].y = data_value
					elseif (data_count == 3) then
						if tbl[poly_count].kind == "polygon" then
						
							if data_value_string ~= "-" then
								tbl[poly_count].raw[vertex_count].va = data_value
							end
							
						else
							tbl[poly_count].segments = data_value
						end
					elseif (data_count == 4) then
						if tbl[poly_count].kind == "polygon" then
						
							if data_value_string ~= "-" then
								tbl[poly_count].raw[vertex_count].vb = data_value
							end
							
						else
							tbl[poly_count]._angle = data_value
						end
					end
					
					-- Repeat
					i = i:sub(sub_cursor + 1)
					cursor = 0
					
					data_count = data_count + 1
				
				end
				
				poly_count = poly_count + 1
			
			end
			
		end
		
		line_count = line_count + 1
		-- End load
		file_pos = 0
		load_line = line:find("\n")
		
		if load_line == nil then
			load_line = line:len()
		end
	end

end

return import

*/