
// Empty global vars to be initialised later
var canvas = null;
var ctx = null;

// The list of gates
var gates = [];
var gatesInit = [];
var gateOptions = -1;

// Which gate is current selected
var selected = -1;
var hover = -1;
var nextID = 0;
var showDelete = false;

// General settings
var gateSize = 50;
var gridY = 60;
var gridX = 60;
var spacing = 0.8;
var toolboxWidth = -1;
var toolboxHeight = -1;

// For checking for double click
var doubleClickMilli = 300;
var lastClickTime = -1;

// For dragging the canvas around
var offsetX = 0;
var offsetY = 0;

// User-modifiable settings
var drawGrid = true;

// Called on body ready
function init(){

	// Initialise the canvas
	canvas = document.getElementById("view");
	ctx = canvas.getContext("2d");

	// Add listeners for mouse events
	canvas.addEventListener('mousemove', mouseMove);
	canvas.addEventListener('mousedown', mouseDown);
	canvas.addEventListener('mouseup', mouseUp);

	// Add the gate summoning buttons 
	gateOptions = 10;
	toolboxHeight = gateSize+20;
	toolboxWidth = gridX*(gateOptions+1);
	toolboxOffsetX = window.innerWidth / 2 - toolboxWidth / 2;
	toolboxRel = (toolboxOffsetX / gateSize) - 0.33;
	gates.push({"letter": "H",    "y": 0.33, "x": 0.5+0+toolboxRel, "draggable": false})
	gates.push({"letter": "X",    "y": 0.33, "x": 0.5+1+toolboxRel, "draggable": false})
	gates.push({"letter": "Y",    "y": 0.33, "x": 0.5+2+toolboxRel, "draggable": false})
	gates.push({"letter": "Z",    "y": 0.33, "x": 0.5+3+toolboxRel, "draggable": false})
	gates.push({"letter": "T",    "y": 0.33, "x": 0.5+4+toolboxRel, "draggable": false})
	gates.push({"letter": "S",    "y": 0.33, "x": 0.5+5+toolboxRel, "draggable": false})
	gates.push({"letter": "sub",  "y": 0.33, "x": 0.5+6+toolboxRel, "draggable": false})
	gates.push({"letter": "io",   "y": 0.33, "x": 0.5+7+toolboxRel, "draggable": false})
	gates.push({"letter": "open", "y": 0.27, "x": 0.5+8.1+toolboxRel, "draggable": false})
	gates.push({"letter": "save", "y": 0.43, "x": 0.5+9.1+toolboxRel, "draggable": false})
	gatesInit = gates.slice();

	// First drawing
	redraw();

}

// Given a letter and a position, draw a gate
function drawGate(letter, x, y, isSelected){

	// If it's a filled control
	if (letter == "controlFilled"){

		// Draw the circle
		if (!isSelected){
			ctx.fillStyle = "#555555";
			ctx.strokeStyle = "#555555";
		} else {
			ctx.fillStyle = "#888888";
			ctx.strokeStyle = "#888888";
		}
		ctx.beginPath();
		ctx.arc(x, y, gateSize/4, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.stroke();

	// If it's an unfilled control
	} else if (letter == "controlUnfilled"){

		// Draw the circle
		if (!isSelected){
			ctx.strokeStyle = "#555555";
		} else {
			ctx.strokeStyle = "#888888";
		}
		ctx.fillStyle = "#ffffff";
		ctx.beginPath();
		ctx.arc(x, y, gateSize/4, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.stroke();

	// If it's an i/o control 
	} else if (letter == "io"){

		// Draw the box
		if (!isSelected){
			ctx.fillStyle = "#e89b00";
		} else {
			ctx.fillStyle = "#b87c04";
		}
		ctx.fillRect(x-gateSize/2, y-gateSize/2, gateSize, gateSize);

		// Draw the letter
		ctx.font = "30px Arial";
		ctx.fillStyle = "#ffffff";
		ctx.fillText("io", 15+x-gateSize/2, 35+y-gateSize/2);

	// If it's an subroutine
	} else if (letter == "sub"){

		// Draw the box
		if (!isSelected){
			ctx.fillStyle = "#16a300";
		} else {
			ctx.fillStyle = "#107800";
		}
		ctx.fillRect(x-gateSize/2, y-gateSize/2, gateSize, gateSize);
		
		// Draw the letter
		ctx.font = "30px Arial";
		ctx.fillStyle = "#ffffff";
		ctx.fillText("?", 15+x-gateSize/2, 35+y-gateSize/2);

	} else if (letter == "open"){

		// Colours
		backCol = "#fcb603";
		paperCol = "#ffffff";
		frontCol = "#d49f00";

		// To save adding this everywhere
		x = x-gateSize/2;
		y = y-gateSize/2+10;

		// Draw the back bit of the folder
		ctx.fillStyle = backCol;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x, y+40);
		ctx.lineTo(x+40, y+40);
		ctx.lineTo(x+40, y);
		ctx.fill();

		// Draw the paper inside the folder
		if (!isSelected){
			ctx.fillStyle = paperCol;
			ctx.beginPath();
			ctx.moveTo(x+10, y+2);
			ctx.lineTo(x+10, y+40);
			ctx.lineTo(x+35, y+40);
			ctx.lineTo(x+35, y+2);
			ctx.fill();
		} else {
			ctx.fillStyle = paperCol;
			ctx.beginPath();
			ctx.moveTo(x+10, y-5);
			ctx.lineTo(x+10, y+40);
			ctx.lineTo(x+35, y+40);
			ctx.lineTo(x+35, y-5);
			ctx.fill();
		}

		// Draw the front bit of the folder
		if (!isSelected){
			ctx.fillStyle = frontCol;
			ctx.beginPath();
			ctx.moveTo(x+05, y+15);
			ctx.lineTo(x, y+40);
			ctx.lineTo(x+40, y+40);
			ctx.lineTo(x+50, y+15);
			ctx.fill();
		} else {
			ctx.fillStyle = frontCol;
			ctx.beginPath();
			ctx.moveTo(x+05, y+15);
			ctx.lineTo(x, y+40);
			ctx.lineTo(x+40, y+40);
			ctx.lineTo(x+50, y+15);
			ctx.fill();
		}

	} else if (letter == "save"){

		// To save adding this everywhere
		x = x-gateSize/2;
		y = y-gateSize/2;

		// Main plastic bit
		ctx.fillStyle = "#00bbd4";
		ctx.beginPath();
		ctx.moveTo(x+5, y);
		ctx.lineTo(x+5, y+40);
		ctx.lineTo(x+40, y+40);
		ctx.lineTo(x+40, y+5);
		ctx.lineTo(x+35, y);
		ctx.fill();

		// Top white bit
		ctx.fillStyle = "#ffffff";
		ctx.beginPath();
		ctx.moveTo(x+10, y);
		ctx.lineTo(x+10, y+10);
		ctx.lineTo(x+30, y+10);
		ctx.lineTo(x+30, y);
		ctx.fill();

		// Black bit inside top white bit
		if (!isSelected){
			ctx.fillStyle = "#000000";
			ctx.beginPath();
			ctx.moveTo(x+22, y);
			ctx.lineTo(x+22, y+10);
			ctx.lineTo(x+30, y+10);
			ctx.lineTo(x+30, y);
			ctx.fill();
		} else {
			ctx.fillStyle = "#000000";
			ctx.beginPath();
			ctx.moveTo(x+10, y);
			ctx.lineTo(x+10, y+10);
			ctx.lineTo(x+18, y+10);
			ctx.lineTo(x+18, y);
			ctx.fill();
		}
		
		// Bottom white bit
		ctx.fillStyle = "#ffffff";
		ctx.beginPath();
		ctx.moveTo(x+10, y+20);
		ctx.lineTo(x+10, y+40);
		ctx.lineTo(x+35, y+40);
		ctx.lineTo(x+35, y+20);
		ctx.fill();

	// If drawing the delete icon 
	} else if (letter == "delete"){

		// To save adding this everywhere
		x = x-gateSize/2;

		// Colours
		ctx.fillStyle = "#55555588";
		ctx.strokeStyle = "#55555588";

		// Bottom
		ctx.beginPath();
		ctx.moveTo(x, y+10);
		ctx.lineTo(x+5, y+40);
		ctx.lineTo(x+25, y+40);
		ctx.lineTo(x+30, y+10);
		ctx.fill();

		// Lid
		ctx.beginPath();
		ctx.moveTo(x, y+7);
		ctx.lineTo(x+5, y);
		ctx.lineTo(x+25, y);
		ctx.lineTo(x+30, y+7);
		ctx.fill();

		// Lid handle 
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(x+15, y, 5, Math.PI, 0, false);
		ctx.stroke();

		// Stripes
		//ctx.beginPath();
		//ctx.moveTo(x+10, y+15);
		//ctx.lineTo(x+10, y+35);
		//ctx.lineTo(x+7, y+35);
		//ctx.lineTo(x+7, y+15);
		//ctx.fill();
		//ctx.beginPath();
		//ctx.moveTo(x+13, y+15);
		//ctx.lineTo(x+16, y+15);
		//ctx.lineTo(x+16, y+35);
		//ctx.lineTo(x+13, y+35);
		//ctx.fill();
		//ctx.beginPath();
		//ctx.moveTo(x+19, y+15);
		//ctx.lineTo(x+22, y+15);
		//ctx.lineTo(x+22, y+35);
		//ctx.lineTo(x+19, y+35);
		//ctx.fill();

	// If it's a standard gate
	} else {

		// Draw the box
		if (!isSelected){
			ctx.fillStyle = "#37abc8";
		} else {
			ctx.fillStyle = "#298399";
		}
		ctx.fillRect(x-gateSize/2, y-gateSize/2, gateSize, gateSize);

		// Draw the letter
		ctx.font = "30px Arial";
		ctx.fillStyle = "#ffffff";
		ctx.fillText(letter, 15+x-gateSize/2, 35+y-gateSize/2);

	}

}

// Called whenever something is changed
function redraw(){

	// Ensure it's scaled to the window
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	// Draw grid lines
	if (drawGrid){
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#aaaaaa";
		for (var x=offsetX%gridX; x<ctx.canvas.width; x+=gridX){
			ctx.beginPath();
			ctx.moveTo(x-(gridX/2)+(gateSize/2), 0);
			ctx.lineTo(x-(gridX/2)+(gateSize/2), ctx.canvas.height);
			ctx.stroke();
		}
		for (var y=offsetY%gridY; y<ctx.canvas.width; y+=gridY){
			ctx.beginPath();
			ctx.moveTo(0, y-(gridY/2)+(gateSize/2));
			ctx.lineTo(ctx.canvas.width, y-(gridY/2)+(gateSize/2));
			ctx.stroke();
		}
	}

	// Find qubit line rectangles needed ([minX,maxX,minY,maxY])
	var lineStartEnds = [];
	lineStartEnds.push([999999,-9999999, 9999999, -999999])
	for (var i=gateOptions; i<gates.length; i++){
		if (gates[i]["letter"] != "io"){
			if (gates[i]["x"]-1 < lineStartEnds[0][0]){
				lineStartEnds[0][0] = gates[i]["x"]-1;
			} 
			if (gates[i]["x"]+1 > lineStartEnds[0][1]){
				lineStartEnds[0][1] = gates[i]["x"]+1;
			}
			if (gates[i]["y"] < lineStartEnds[0][2]){
				lineStartEnds[0][2] = gates[i]["y"];
			}
			if (gates[i]["y"] > lineStartEnds[0][3]){
				lineStartEnds[0][3] = gates[i]["y"];
			}
		} else {
			if (gates[i]["x"] < lineStartEnds[0][0]){
				lineStartEnds[0][0] = gates[i]["x"];
			} 
			if (gates[i]["x"] > lineStartEnds[0][1]){
				lineStartEnds[0][1] = gates[i]["x"];
			}
			if (gates[i]["y"] < lineStartEnds[0][2]){
				lineStartEnds[0][2] = gates[i]["y"];
			}
			if (gates[i]["y"] > lineStartEnds[0][3]){
				lineStartEnds[0][3] = gates[i]["y"];
			}
		}
	}

	// Draw each qubit grid
	for (var i=0; i<lineStartEnds.length; i++){
		for (var y=lineStartEnds[i][2]; y<=lineStartEnds[i][3]; y++){
			ctx.lineWidth = 5;
			ctx.strokeStyle = "#aaaaaa";
			ctx.beginPath();
			ctx.moveTo((lineStartEnds[i][0])*gridX+gateSize/2+offsetX, offsetY+y*gridY+gateSize/2);
			ctx.lineTo((lineStartEnds[i][1])*gridX+gateSize/2+offsetX, offsetY+y*gridY+gateSize/2);
			ctx.stroke();
		}
	}

	// Draw the control lines
	for (var i=gateOptions; i<gates.length; i++){
		for (var j=0; j<gates[i]["attached"].length; j++){
			ctx.lineWidth = 5;
			ctx.strokeStyle = "#555555";
			ctx.beginPath();
			ctx.moveTo(gates[i]["x"]*gridX+gateSize/2+offsetX, offsetY+gates[i]["y"]*gridY+gateSize/2);
			ctx.lineTo(gates[i]["x"]*gridX+gateSize/2+offsetX, offsetY+gates[fromID(gates[i]["attached"][j])]["y"]*gridY+gateSize/2);
			ctx.stroke();
		}
	}
	
	// Draw the gates
	for (var i=gateOptions; i<gates.length; i++){
		drawGate(gates[i]["letter"], gates[i]["x"]*gridX+gateSize/2+offsetX, offsetY+gates[i]["y"]*gridY+gateSize/2, i==hover);
	}

	// Toolbox outline 
	ctx.fillStyle = "#dddddd";
	roundRect(ctx, toolboxOffsetX, 10, toolboxWidth, toolboxHeight, 20, true, false);
	
	// Draw the toolbox gates
	for (var i=0; i<gateOptions; i++){
		drawGate(gates[i]["letter"], gates[i]["x"]*gridX+gateSize/2, gates[i]["y"]*gridY+gateSize/2, i==hover);
	}

	// If dragging a gate, change the toolbar
	if (showDelete){

		// Fade everything
		ctx.fillStyle = "#aaaaaa55";
		roundRect(ctx, toolboxOffsetX, 10, toolboxWidth, toolboxHeight, 20, true, false);

		// Draw a delete icon 
		drawGate("delete", toolboxOffsetX+toolboxWidth/2, 30);

	}
	
	// Draw the selected gate on top
	if (selected >= 0){
		drawGate(gates[selected]["letter"], gates[selected]["x"]*gridX+gateSize/2+offsetX, offsetY+gates[selected]["y"]*gridY+gateSize/2, true);
	}

}

/**
 * FROM: https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}

// Find a gate index from its ID
function fromID(id){
	for (k=0; k<gates.length; k++){
		if (gates[k]["id"] == id){
			return k;
		}
	}
	return -1;
}

// Find a gate index from its ID (from custom array)
function fromIDArray(id, arr){
	for (k=0; k<arr.length; k++){
		if (arr[k]["id"] == id){
			return k;
		}
	}
	return -1;
}

// When mouse is moved above the canvas
function mouseMove(e){

	// By default, hide the delete bar
	showDelete = false;

	// Move whatever is selected to the mouse
	if (selected >= 0){

		// If it's a control, lock it to the x
		if (gates[selected]["letter"] == "controlFilled" || gates[selected]["letter"] == "controlUnfilled"){
			gates[selected]["y"] = Math.round((e.clientY - offsetY - gateSize / 2) / gridY);
			
		// If it's a normal gate
		} else {
			
			// Show the delete bar
			showDelete = true;

			// Move this gate to the mouse, x and y
			gates[selected]["x"] = Math.round((e.clientX - offsetX - gateSize / 2) / gridX);
			newY = Math.round((e.clientY - offsetY - gateSize / 2) / gridY);

			// Move any attached controls along with it
			for (var i=0; i<gates[selected]["attached"].length; i++){
				control = gates[fromID(gates[selected]["attached"][i])]
				control["x"] = Math.round((e.clientX - offsetX - gateSize / 2) / gridX);
				control["y"] -= gates[selected]["y"] - newY
			}

			// Update the new y now the delta has been processed
			gates[selected]["y"] = newY

		}

	// If dragging the background
	} else if (selected == -5){

		// Move the offsets
		offsetX += e.movementX;
		offsetY += e.movementY;

	// Otherwise check for hover
	} else {

		// Check over every gate (draggable or not)
		canvas.style.cursor = "initial";
		hover = -1;
		for (var i=0; i<gates.length; i++){

			// If it's a fixed gate, don't add the offset
			if (gates[i]["draggable"]){
				gx = gates[i]["x"]*gridX+offsetX;
				gy = gates[i]["y"]*gridY+offsetY;
			} else {
				gx = gates[i]["x"]*gridX;
				gy = gates[i]["y"]*gridY;
			}

			// Check for mouse within gate area
			if (e.clientX > gx && e.clientX < gx+gateSize && e.clientY > gy && e.clientY < gy+gateSize){
				canvas.style.cursor = "pointer";
				hover = i;
			}

		}

	}

	// Update the canvas
	redraw();

}

// When mouse button lifted up
function mouseUp(e){

	// Hide the delete bar
	showDelete = false;

	// If something is selected 
	if (selected >= 0){

		// If it's a control
		if (gates[selected]["letter"] == "controlFilled" || gates[selected]["letter"] == "controlUnfilled"){

			// If dropped onto the parent 
			og = fromID(gates[selected]["og"]);
			if (gates[selected]["x"] == gates[og]["x"] && gates[selected]["y"] == gates[og]["y"]){

				// Remove from the attached list of its parent
				gates[og]["attached"].splice(gates[og]["attached"].indexOf(fromID(selected)), 1);

				// Remove this gate
				gates.splice(selected, 1);

			}

		// If not a control
		} else {

			// If dropped into the toolbox 
			if (e.clientX > toolboxOffsetX && e.clientX < toolboxOffsetX+toolboxWidth && e.clientY > 0 && e.clientY < toolboxHeight){

				// Remove all its controls
				for (var i=0; i<gates[selected]["attached"].length; i++){
					gates.splice(fromID(gates[selected]["attached"][i]), 1);
				}
				
				// Remove this gate
				gates.splice(selected, 1);

			}

		}

	}
	
	// Deselect current gate
	selected = -1;

	// Update the canvas
	redraw();

}

// When mouse button pressed down
function mouseDown(e){

	// If hovering over a gate
	if (hover >= 0){

		// Get the current time in milliseconds
		var currentTime = new Date().getTime();

		// Double click 
		if ((currentTime - lastClickTime) < doubleClickMilli){

			// If it can be dragged (i.e. not in the toolbox)
			if (gates[hover]["draggable"]){

				// If it's a filled control
				if (gates[hover]["letter"] == "controlFilled"){

					// Change it to be unfilled
					gates[hover]["letter"] = "controlUnfilled";

				// If it's a filled control
				} else if (gates[hover]["letter"] == "controlUnfilled"){

					// Change it to be unfilled
					gates[hover]["letter"] = "controlFilled";

				// If it's an io element TODO
				} else if (gates[hover]["letter"] == "io"){

				// If it's a normal gate
				} else {

					// Create a control at the cursor
					gates.push({"id": nextID, "letter": "controlFilled", "x": Math.round(gates[hover]["x"]), "y": Math.round(gates[hover]["y"]), "draggable": true, "og": gates[hover]["id"], "attached":[]})
					nextID += 1

					// Add this control to the attached list of the og gate
					gates[hover]["attached"].push(nextID-1);

					// Select this new control
					selected = gates.length-1;
					hover = gates.length-1;

				}
				
			}

		// Single click
		} else {

			// If it can be dragged, select it
			if (gates[hover]["draggable"]){
				selected = hover;

			// If it's the save icon 
			} else if (gates[hover]["letter"] == "save"){

				// Convert circuit to qasm 
				asQASM = toQASM();

				// Download the qasm
				download("circuit.qasm", asQASM);

			// If it's the open icon 
			} else if (gates[hover]["letter"] == "open"){
				
				// Open the file input box
				document.getElementById("fileIn").click(); 

			// If it can't, create a new gate and select that
			} else {
				gates.push({"id": nextID, "letter": gates[hover]["letter"], "x": Math.round(gates[hover]["x"]), "y": Math.round(gates[hover]["y"]), "draggable": true, "attached":[]})
				nextID += 1
				selected = gates.length-1;
				hover = gates.length-1;
			}


		}

		// Save this time for future double click checks
		lastClickTime = currentTime;

	// If not hovering over anything
	} else {

		// The user is now dragging the canvas
		selected = -5

	}

	// Update the canvas
	redraw();

}

// Convert the circuit and all info into a qasm string 
function toQASM(){

	// Required at the start of the QASM file
	qasmString = "OPENQASM 3.0;\n";

	// Determine how many qubits are needed for the main circuit
	minQubit = 9999;
	maxQubit = -9999;
	minPos = 9999;
	maxPos = -9999;
	for (var i=gateOptions; i<gates.length; i++){

		if (gates[i]["y"] < minQubit){
			minQubit = gates[i]["y"];
		}
		if (gates[i]["y"] > maxQubit){
			maxQubit = gates[i]["y"];
		}
		if (gates[i]["x"] > maxPos){
			maxPos = gates[i]["x"];
		}
		if (gates[i]["x"] < minPos){
			minPos = gates[i]["x"];
		}

	}

	// Add a register
	qasmString += "qubit q[" + (1+maxQubit-minQubit) + "];\n";

	// Keep track of what the latest position for each qubit is
	latestX = [];
	for (var i=0; i<1+maxQubit-minQubit; i++){
		latestX.push(0);
	}

	// Create a copy of the array
	copy = gates.slice(gateOptions);

	// Sort the list, leftmost gates first
	copy.sort(function(a, b){return a["x"] - b["x"];});

	// Loop over this sorted list
	for (var i=0; i<copy.length; i++){

		// Get info about this gate
		xPos = copy[i]["x"]-minPos+1;
		qubit = copy[i]["y"]-minQubit;
		letter = copy[i]["letter"].toLowerCase();
		controls = copy[i]["attached"];
		numControls = controls.length;

		// Don't add controls directly
		if (letter != "controlfilled" && letter != "controlunfilled"){

			// Without controls
			if (numControls == 0){

				// Determine whether there's any free space behind it
				numIdenNeeded = xPos-latestX[qubit]-1;

				// Add identities if there's free space 
				for (var j=0; j<numIdenNeeded; j++){
					qasmString += "i q[" + qubit + "];\n";
				}

				// Add the gate
				qasmString += letter + " q[" + qubit + "];\n";

				// Update offsets
				latestX[qubit] = xPos;

			// With controls
			} else {

				// Pre-calculate control indices (since this could get costly for bigger circuits)
				controlIndices = [];
				for (var j=0; j<numControls; j++){
					controlIndex = fromIDArray(controls[j], copy);
					controlIndices.push(controlIndex);
				}

				// Get the min/max qubit for this gate
				minGateQubit = qubit;
				maxGateQubit = qubit;
				for (var j=0; j<numControls; j++){
					controlIndex = controlIndices[j];
					controlQubit = copy[controlIndex]["y"]-minQubit;
					if (controlQubit > maxGateQubit){
						maxGateQubit = controlQubit;
					}
					if (controlQubit < minGateQubit){
						minGateQubit = controlQubit;
					}
				}

				// Determine whether there's any free space behind it
				numIdenNeeded = xPos-latestX[qubit]-1;
				closestIndex = qubit;
				for (var j=minGateQubit; j<maxGateQubit+1; j++){
					if (xPos-latestX[j]-1 < numIdenNeeded){
						numIdenNeeded = xPos-latestX[j]-1;
						closestIndex = qubit+j;
					}
				}

				// Add identities if there's free space 
				for (var j=0; j<numIdenNeeded; j++){
					qasmString += "i q[" + closestIndex + "];\n";
				}

				// Add the ccc...ch
				for (var j=0; j<numControls; j++){
					controlIndex = controlIndices[j];
					type = copy[controlIndex]["letter"];
					if (type == "controlFilled"){
						qasmString += "c";
					} else {
						qasmString += "o";
					}
				}

				// Add the controls q[1], q[2] etc.
				qasmString += letter + " ";
				for (var j=0; j<numControls; j++){
					controlIndex = controlIndices[j];
					controlQubit = copy[controlIndex]["y"]-minQubit;
					qasmString += "q[" + controlQubit + "], ";
					latestX[controlIndex] = xPos;
				}

				// Add the target
				qasmString += "q[" + qubit + "];\n";
				latestX[qubit] = xPos;

			}

		}

	}

	// Return to be turned into a file
	return qasmString;

}

function onFileChange(e){

	// Create a file reader
	var input = event.target;
	var reader = new FileReader();

	// Setup the onload function
	reader.onload = function(){

		// Get the text
		var text = reader.result;

		// Load the QASM 
		fromQASM(text);

	};

	// Trigger this event
	reader.readAsText(input.files[0]);

}

// Load the gates from a QASM string
function fromQASM(qasmString){

	// Split into the different lines
	lines = qasmString.split("\n");

	// Things to figure out
	numQubitsRequired = 0;
	regToQubit = {};
	latestX = [];

	// Reset gates
	gates = gatesInit.slice();
	nextID = 0;

	// Iterate over the lines
	for (var i=1; i<lines.length; i++){

		// Ignore any blank lines
		if (lines[i].length > 0){

			// Ignore comments
			if (lines[i][0] != "/"){

				// Split into components
				words = lines[i].replace(/;/g,"").replace(/,/g," ").replace(/\s+/g," ").split(" ");

				// If it's specifying qubit registers 
				if (words[0] == "qubit"){

					// Determine how many qubits are in this register
					startInd = words[1].indexOf("[");
					endInd = words[1].indexOf("]");
					num = parseInt(words[1].substring(startInd+1, endInd));
					name = words[1].substring(0, startInd);

					// Add to mapping
					for (var k=0; k<num; k++){
						regToQubit[name+"["+k+"]"] = numQubitsRequired + k;
						latestX.push(0);
					}
					numQubitsRequired += num;

				// If defining a new gate (function) TODO
				} else if (words[0] == "gate"){

				// If an identity
				} else if (words[0] == "i"){

					// Just increase the spacing there
					target = regToQubit[words[words.length-1]];
					latestX[target] += 1;

				// If specifying a standard gate operation 
				} else {

					// Determine gate info
					numControls = words[0].split("o").length + words[0].split("c").length - 2;
					target = regToQubit[words[words.length-1]];
					letter = words[0].substring(numControls, words[0].length);

					// Standard gate names should be uppercase for display
					if (["x", "y", "z", "s", "t", "h"].indexOf(letter) >= 0){
						letter = letter.toUpperCase();
					}

					// Determine control info
					controls = []
					controlTypes = [];
					controlIDs = [];
					latestPos = latestX[target];
					for (var j=1; j<1+numControls; j++){
						con = regToQubit[words[j]];
						controls.push(con);
						controlIDs.push(nextID);
						nextID += 1;
						if (latestX[con] > latestPos){
							latestPos = latestX[con];
						}
						if (words[0][j-1] == "c"){
							controlTypes.push("controlFilled");
						} else {
							controlTypes.push("controlUnfilled");
						}
					}

					// Add the gate 
					targetID = nextID;
					gates.push({"id": targetID, "letter": letter, "x": latestPos, "y": target, "draggable": true, "og": 0, "attached": controlIDs})
					nextID += 1
					latestX[target] = latestPos+1;
					
					// Add the controls 
					for (var j=0; j<numControls; j++){
						con = controls[j];
						gates.push({"id": controlIDs[j], "letter": controlTypes[j], "x": latestPos, "y": con, "draggable": true, "og": targetID, "attached": []})
						latestX[con] = latestPos+1;
					}

				}
				
			}
		}

	}

	// Recenter the camera 
	offsetX = gateSize*5;
	offsetY = gateSize*5;

}

// Download text to a filename, from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server 
function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

