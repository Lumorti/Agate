
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
var selectStartX = 0;
var selectEndX = 0;
var selectStartY = 0;
var selectEndY = 0;
var selectionArray = [];

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

// Generate random numbers
var numRands = 100;
var randNums = [];
for (var i=0; i<numRands; i++){
	randNums.push(Math.random());
}

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
	gateOptions = 9;
	toolboxHeight = gateSize+20;
	toolboxWidth = gridX*(gateOptions+1);
	toolboxOffsetX = window.innerWidth / 2 - toolboxWidth / 2;
	toolboxRel = (toolboxOffsetX / gateSize) - 0.33;
	gates.push({"letter": "H",    "y": 0.33, "x": 0.5+0+toolboxRel, "size": 1, "draggable": false})
	gates.push({"letter": "X",    "y": 0.33, "x": 0.5+1+toolboxRel, "size": 1, "draggable": false})
	gates.push({"letter": "Y",    "y": 0.33, "x": 0.5+2+toolboxRel, "size": 1, "draggable": false})
	gates.push({"letter": "Z",    "y": 0.33, "x": 0.5+3+toolboxRel, "size": 1, "draggable": false})
	gates.push({"letter": "T",    "y": 0.33, "x": 0.5+4+toolboxRel, "size": 1, "draggable": false})
	gates.push({"letter": "S",    "y": 0.33, "x": 0.5+5+toolboxRel, "size": 1, "draggable": false})
	gates.push({"letter": "sub",  "y": 0.33, "x": 0.5+6+toolboxRel, "size": 1, "draggable": false})
	gates.push({"letter": "open", "y": 0.27, "x": 0.5+7.1+toolboxRel, "size": 1, "draggable": false})
	gates.push({"letter": "save", "y": 0.43, "x": 0.5+8.1+toolboxRel, "size": 1, "draggable": false})
	gatesInit = gates.slice();

	// First drawing
	redraw();

}

// Given a letter and a position, draw a gate
function drawGate(letter, x, y, isSelected, size){

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
	var qubitsWithGates = [];
	for (var i=gateOptions; i<gates.length; i++){

		// Gate info caches
		gateX = gates[i]["x"];
		gateY = gates[i]["y"];

		// Keep track of number of gates on each qubit
		if (qubitsWithGates.indexOf(gateY) < 0){
			qubitsWithGates.push(gateY);
		}

		// Check if this gate is in an existing rectangle
		inRect = [];
		for (var j=0; j<lineStartEnds.length; j++){

			// If the gate itself is in the rect
			if (gateY <= lineStartEnds[j][3]+1 && gateY >= lineStartEnds[j][2]-1){
				inRect.push(j);
			}
			
			// If it's a control, check its main gate
			if (gates[i]["letter"] == "controlFilled" || gates[i]["letter"] == "controlUnfilled"){
				ogInd = fromID(gates[i]["og"]);
				if (gates[ogInd]["y"] <= lineStartEnds[j][3]+1 && gates[ogInd]["y"] >= lineStartEnds[j][2]-1){
					inRect.push(j);
				}
			}

			// If any of its controls are 
			for (var k=0; k<gates[i]["attached"].length; k++){
				controlInd = fromID(gates[i]["attached"][k]);
				if (gates[controlInd]["y"] <= lineStartEnds[j][3]+1 && gates[controlInd]["y"] >= lineStartEnds[j][2]-1){
					inRect.push(j);
				}
			}

		}

		// If connecting multiple rectangles 
		if (inRect.length >= 1){

			// Combine rects
			mergedRect = [gateX-1, gateX+1, gateY, gateY];
			for (var k=0; k<inRect.length; k++){
				
				// Update the mins/maxs
				if (lineStartEnds[inRect[k]][0] < mergedRect[0]){
					mergedRect[0] = lineStartEnds[inRect[k]][0];
				} 
				if (lineStartEnds[inRect[k]][1] > mergedRect[1]){
					mergedRect[1] = lineStartEnds[inRect[k]][1];
				}
				if (lineStartEnds[inRect[k]][2] < mergedRect[2]){
					mergedRect[2] = lineStartEnds[inRect[k]][2];
				}
				if (lineStartEnds[inRect[k]][3] > mergedRect[3]){
					mergedRect[3] = lineStartEnds[inRect[k]][3];
				}

			}

			// Add the new rect
			lineStartEnds.push(mergedRect);

			// Remove the old ones
			newList = []
			for (var k=0; k<lineStartEnds.length; k++){
				if (inRect.indexOf(k) < 0){
					newList.push(lineStartEnds[k]);
				}
			}
			lineStartEnds = newList;

		// Otherwise add a new rectangle
		} else {
			lineStartEnds.push([gateX-1, gateX+1, gateY, gateY]);
		}
	}

	// Draw each qubit grid
	for (var i=0; i<lineStartEnds.length; i++){
		for (var y=lineStartEnds[i][2]; y<=lineStartEnds[i][3]; y++){
			if (qubitsWithGates.indexOf(y) >= 0){
				ctx.lineWidth = 5;
				ctx.strokeStyle = "#aaaaaa";
				ctx.beginPath();
				ctx.moveTo((lineStartEnds[i][0])*gridX+gateSize/2+offsetX, offsetY+y*gridY+gateSize/2);
				ctx.lineTo((lineStartEnds[i][1])*gridX+gateSize/2+offsetX, offsetY+y*gridY+gateSize/2);
				ctx.stroke();
			}
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
		isSel = (i == hover) || (selectionArray.indexOf(i) >= 0);
		drawGate(gates[i]["letter"], gates[i]["x"]*gridX+gateSize/2+offsetX, offsetY+gates[i]["y"]*gridY+gateSize/2, isSel, gates[i]["size"]);
	}

	// For each independent section of circuit
	for (var i=0; i<lineStartEnds.length; i++){

		// Get the inputs
		inputs = [[1, ""]]
		for (var j=0; j<1+lineStartEnds[i][3]-lineStartEnds[i][2]; j++){
			inputs[0][1] += "0";
		}

		// Render the inputs
		renderState(ctx, inputs, lineStartEnds[i][0]-1, lineStartEnds[i][2], qubitsWithGates, true);
		
		// Simulate circuit
		results = simulateCircuit(inputs, gates, lineStartEnds[i]);

		// Render the outputs
		renderState(ctx, results, lineStartEnds[i][1]+1, lineStartEnds[i][2], qubitsWithGates, false);

	}

	// Toolbox outline 
	ctx.fillStyle = "#dddddd";
	roundRect(ctx, toolboxOffsetX, 10, toolboxWidth, toolboxHeight, 20, true, false);
	
	// Draw the toolbox gates
	for (var i=0; i<gateOptions; i++){
		drawGate(gates[i]["letter"], gates[i]["x"]*gridX+gateSize/2, gates[i]["y"]*gridY+gateSize/2, i==hover, gates[i]["size"]);
	}

	// If dragging a gate, change the toolbar
	if (showDelete){

		// Fade everything
		ctx.fillStyle = "#aaaaaa55";
		roundRect(ctx, toolboxOffsetX, 10, toolboxWidth, toolboxHeight, 20, true, false);

		// Draw a delete icon 
		drawGate("delete", toolboxOffsetX+toolboxWidth/2, 30, false, 1);

	}
	
	// Draw the selected gate on top
	if (selected >= 0){
		drawGate(gates[selected]["letter"], gates[selected]["x"]*gridX+gateSize/2+offsetX, offsetY+gates[selected]["y"]*gridY+gateSize/2, true, gates[i]["size"]);
	}

	// If box selecting
	if (selected == -6){

		// Draw the box
		ctx.fillStyle = "#aaaaaa55";
		ctx.fillRect(selectStartX, selectStartY, selectEndX-selectStartX, selectEndY-selectStartY);

	}

}

// Render the given states at the specified position 
function renderState(ctx, states, x, y, qubitsWithGates, goLeft){

	// Style params
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#555555";
	ctx.fillStyle = ctx.strokeStyle;
	ctx.font = "35px Arial";

	// For each state
	for (var i=0; i<states.length; i++){
		
		// For each qubit of the state
		for (var j=0; j<states[i][1].length; j++){

			// If there's anything on that qubit
			if (qubitsWithGates.indexOf(y+j) >= 0){

				// Draw that qubit's state (with rotation)
				//textX = (x+i)*gridX+offsetX+16;
				//textY = (y+j)*gridY+offsetY+gridY/2+6;
				//ctx.translate(textX, textY);
				//ctx.rotate(Math.PI/2);
				//ctx.fillText(states[i][1][j], -gateSize/2+5, +5);
				//ctx.rotate(-Math.PI/2);
				//ctx.translate(-textX, -textY);

				// Draw that qubit's state
				textX = (x+i)*gridX+offsetX+16;
				textY = (y+j)*gridY+offsetY+gridY/2+6;
				ctx.fillText(states[i][1][j], textX, textY);

			}

		}

		// To simplify the code
		leftX = (x+i)*gridX+offsetX+gateSize/2-gridX/2+5;
		rightX = (x+i)*gridX+offsetX+gateSize/2+gridX/2-5;
		topY = y*gridY+offsetY-(gridY-gateSize)/2;
		bottomY = (y+states[i][1].length)*gridY+offsetY-(gridY-gateSize)/2;

		// Draw the top part of the ket
		ctx.beginPath();
		ctx.moveTo(leftX, topY);
		ctx.lineTo(rightX, topY);
		ctx.stroke();

		// Draw the bottom part of the ket
		ctx.beginPath();
		ctx.moveTo(leftX, bottomY);
		ctx.lineTo((leftX+rightX)/2, bottomY+20);
		ctx.lineTo(rightX, bottomY);
		ctx.stroke();

	}

}

// Given inputs, gates and a box, simulate the circuit and return the states/counts 
function simulateCircuit(inputs, gates, boundingBox){

	// Init the results array
	var results = [];

	// List of the gates to apply in order
	var toApply = [];

	// Get valid gates
	validGates = []
	for (var i=gateOptions; i<gates.length; i++){
		if (gates[i]["x"] >= boundingBox[0] && gates[i]["x"] <= boundingBox[1] && gates[i]["y"] >= boundingBox[2] && gates[i]["y"] <= boundingBox[3]){
			validGates.push(gates[i]);
		}
	}

	// Sort in order
	sortedGates = validGates.slice();
	sortedGates.sort(function(a, b){return a["x"] - b["x"];});

	// Reset random index
	randInd = 0

	// Repeats a number of times
	numRepeats = 10;
	for (var i=0; i<numRepeats; i++){
	
		// Start with input state
		state = inputs[0][1];

		// For each gate in order
		for (var j=0; j<sortedGates.length; j++){

			// Gate info
			letter = sortedGates[j]["letter"];
			target = sortedGates[j]["y"]-boundingBox[2];
			controlIDs = sortedGates[j]["attached"];

			// Check if controls all valid TODO
			controlsValid = true;
			for (var k=0; k<controlIDs.length; k++){

				// Get control info
				controlInd = fromIDArray(controlIDs[k], sortedGates);
				controlQubit = sortedGates[controlInd]["y"]-boundingBox[2];
				controlFilled = sortedGates[controlInd]["letter"] == "controlFilled";

				// Check the state of this qubit
				if (controlFilled && state[controlQubit] == "0"){
					controlsValid = false;
				} else if (!controlFilled && state[controlQubit] == "1"){
					controlsValid = false;
				}

			}

			// If controls all valid
			if (controlsValid){

				// If it's a Hadamard
				if (letter == "H"){

					// 50-50 chance
					if (randNums[randInd] < 0.5){
						console.log("yes");
						state = state.substr(0, target) + (state[target] == "1" ? "0" : "1") + state.substr(target+1, state.length-1);
					}

					// Next random number
					randInd += 1;
					if (randInd > numRands){randInd = 0};

				// If it's an X
				} else if (letter == "X"){
					state = state.substr(0, target) + (state[target] == "1" ? "0" : "1") + state.substr(target+1, state.length-1);
				}

				// TODO the other gates

			}

		}

		// Discard anything not measured TODO

		// Check if this state has already been added
		exists = -1;
		for (var k=0; k<results.length; k++){
			if (results[k][1] == state){
				exists = k;
			}
		}

		// If it doesn't exist, add it
		if (exists < 0){
			results.push([1, state]);

		// Otherwise, increment the count
		} else {
			results[exists][0] += 1;
		}

	}

	return results;

}

// FROM: https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
// Draws a rounded rectangle using the current state of the canvas.
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
	if (selected >= 0 && selectionArray.length == 0){

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
				control["y"] -= gates[selected]["y"] - newY;
			}

			// Update the new y now the delta has been processed
			gates[selected]["y"] = newY;

		}

	// If dragging multiple gates 
	} else if (selected >= 0 && selectionArray.length > 0){

		// Determine the deltas from the selected gate
		deltaX = Math.round((e.clientX - offsetX - gateSize / 2) / gridX) - gates[selected]["x"];
		deltaY = Math.round((e.clientY - offsetY - gateSize / 2) / gridY) - gates[selected]["y"];

		// Show the delete bar
		showDelete = true;

		// For each gate to move 
		for (var k=0; k<selectionArray.length; k++){

			// For readability
			sel = selectionArray[k];

			// If it's not a control
			if (gates[sel]["letter"] != "controlFilled" && gates[sel]["letter"] != "controlUnfilled"){
				
				// Move this gate to the mouse, x and y
				gates[sel]["x"] += deltaX;
				gates[sel]["y"] += deltaY;

				// Move any attached controls along with it
				for (var i=0; i<gates[sel]["attached"].length; i++){
					control = gates[fromID(gates[sel]["attached"][i])]
					control["x"] += deltaX;
					control["y"] += deltaY;
				}

			}

		}

	// If dragging the background
	} else if (selected == -5){

		// Move the offsets
		offsetX += e.movementX;
		offsetY += e.movementY;

	// If dragging the background
	} else if (selected == -6){

		// Set the end X/Y 
		selectEndX = e.clientX;
		selectEndY = e.clientY;

		// Invert if needed
		if (selectStartX < selectEndX){
			selMinX = selectStartX;
			selMaxX = selectEndX;
		} else {
			selMinX = selectEndX;
			selMaxX = selectStartX;
		}
		if (selectStartY < selectEndY){
			selMinY = selectStartY;
			selMaxY = selectEndY;
		} else {
			selMinY = selectEndY;
			selMaxY = selectStartY;
		}

		// Check over every gate
		selectionArray = [];
		for (var i=gateOptions; i<gates.length; i++){

			// Add the offset
			gx = gates[i]["x"]*gridX+offsetX;
			gy = gates[i]["y"]*gridY+offsetY;

			// Check for mouse within gate area
			if (selMinX < gx && selMaxX > gx+gateSize && selMinY < gy && selMaxY > gy+gateSize){
				selectionArray.push(i);
			}

		}

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
	if (selected >= 0 && selectionArray.length == 0){

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

	// If many selected 
	} else if (selectionArray.length > 0){

		// If dropped into the toolbox 
		if (e.clientX > toolboxOffsetX && e.clientX < toolboxOffsetX+toolboxWidth && e.clientY > 0 && e.clientY < toolboxHeight){

			// Get the list of IDs to remove
			idsToRemove = [];
			for (var k=0; k<selectionArray.length; k++){
				idsToRemove.push(gates[selectionArray[k]]["id"]);
				for (var i=0; i<gates[selectionArray[k]]["attached"].length; i++){
					idsToRemove.push(gates[sel]["attached"][i]);
				}
			}

			// Remove all of these
			for (var k=0; k<idsToRemove.length; k++){
				ind = fromID(idsToRemove[k]);
				console.log(ind);
				if (ind >= gateOptions){
					gates.splice(ind, 1);
				}
			}

			// Stop selecting everything since they no longer exist
			selectionArray = [];

		}

	}
	
	// Deselect current gate
	selected = -1;

	// Update the canvas
	redraw();

}

// When mouse button pressed down
function mouseDown(e){

	// Get the current time in milliseconds
	var currentTime = new Date().getTime();

	// If hovering over a gate
	if (hover >= 0){

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

				// If it's a normal gate (and not selecting many)
				} else if (selectionArray.length == 0) {

					// Create a control at the cursor
					gates.push({"id": nextID, "letter": "controlFilled", "x": Math.round(gates[hover]["x"]), "y": Math.round(gates[hover]["y"]), "size": 1, "draggable": true, "og": gates[hover]["id"], "attached":[]})
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
				gates.push({"id": nextID, "letter": gates[hover]["letter"], "x": Math.round(gates[hover]["x"]), "y": Math.round(gates[hover]["y"]), "size": 1, "draggable": true, "attached":[]})
				nextID += 1
				selected = gates.length-1;
				hover = gates.length-1;
			}


		}

	// If not hovering over anything
	} else {

		// Stop selecting things
		selectionArray = [];
		
		// Double click
		if ((currentTime - lastClickTime) < doubleClickMilli){

			// The user is now selecting
			selected = -6;
			selectStartX = e.clientX;
			selectStartY = e.clientY;
			selectEndX = e.clientX;
			selectEndY = e.clientY;

		// Single click
		} else {

			// The user is now dragging the canvas
			selected = -5

		}
		
	}

	// Save this time for future double click checks
	lastClickTime = currentTime;

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
						closestIndex = j;
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

// Called when the html file input selection is changed
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
			if (lines[i][0] != "/" && lines[i] != "include"){

				// Split into components
				words = lines[i].replace(/;/g,"").replace(/,/g," ").replace(/\s+/g," ").split(" ");

				// If it's specifying qubit registers 
				if (words[0] == "qubit" || words[0] == "qreg"){

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
						if (words[0][j-1] == "c"){
							controlTypes.push("controlFilled");
						} else {
							controlTypes.push("controlUnfilled");
						}
					}

					// Determine the min and max qubits this gate affects
					minQubit = target;
					maxQubit = target;
					for (var j=0; j<numControls; j++){
						if (controls[j] < minQubit){
							minQubit = controls[j];
						}
						if (controls[j] > maxQubit){
							maxQubit = controls[j];
						}
					}

					// Determine the latest offset required
					for (j=minQubit; j<maxQubit+1; j++){
						if (latestX[j] > latestPos){
							latestPos = latestX[j];
						}
					}

					// Add the gate 
					targetID = nextID;
					gates.push({"id": targetID, "size": 1, "letter": letter, "x": latestPos, "y": target, "draggable": true, "og": -1, "attached": controlIDs})
					nextID += 1
					
					// Add the controls 
					for (var j=0; j<numControls; j++){
						con = controls[j];
						gates.push({"id": controlIDs[j], "letter": controlTypes[j], "x": latestPos, "y": con, "size": 1, "draggable": true, "og": targetID, "attached": []})
					}

					// Update the latestX for all those qubits
					for (j=minQubit; j<maxQubit+1; j++){
						latestX[j] = latestPos+1;
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

