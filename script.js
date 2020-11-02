
// Empty global vars to be initialised later
var canvas = null;
var ctx = null;

// The list of gates
var gates = [];
var gateOptions = -1;

// Which gate is current selected
var selected = -1;
var hover = -1;
var nextID = 0;

// General settings
var gateSize = 50;
var gridY = 80;
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
	gates.push({"letter": "H", "x": 0.5, "y": 0.5+spacing*0, "draggable": false})
	gates.push({"letter": "X", "x": 0.5, "y": 0.5+spacing*1, "draggable": false})
	gates.push({"letter": "Y", "x": 0.5, "y": 0.5+spacing*2, "draggable": false})
	gates.push({"letter": "Z", "x": 0.5, "y": 0.5+spacing*3, "draggable": false})
	gates.push({"letter": "T", "x": 0.5, "y": 0.5+spacing*4, "draggable": false})
	gates.push({"letter": "S", "x": 0.5, "y": 0.5+spacing*5, "draggable": false})
	gateOptions = gates.length;
	toolboxWidth = gateSize+gridX;
	toolboxHeight = gridY*(1.0+spacing*(gateOptions-1)) + gateSize;

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

	// Find qubit line rectangles needed ([minX,maxX,minY,maxY])
	var lineStartEnds = [];
	lineStartEnds.push([999999,-9999999, 9999999, -999999])
	for (var i=gateOptions; i<gates.length; i++){
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

	// Draw each qubit grid
	for (var i=0; i<lineStartEnds.length; i++){
		for (var y=lineStartEnds[i][2]; y<=lineStartEnds[i][3]; y++){
			ctx.lineWidth = 5;
			ctx.strokeStyle = "#aaaaaa";
			ctx.beginPath();
			ctx.moveTo((lineStartEnds[i][0]-1)*gridX+gateSize/2+offsetX, offsetY+y*gridY+gateSize/2);
			ctx.lineTo((lineStartEnds[i][1]+1)*gridX+gateSize/2+offsetX, offsetY+y*gridY+gateSize/2);
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

	// Draw the selected gate on top
	if (selected >= 0){
		drawGate(gates[selected]["letter"], gates[selected]["x"]*gridX+gateSize/2+offsetX, offsetY+gates[selected]["y"]*gridY+gateSize/2, true);
	}

	// Toolbox outline
	ctx.fillStyle = "#555555";
	ctx.fillRect(0, 0, toolboxWidth+5, toolboxHeight+5);
	ctx.fillStyle = "#eeeeee";
	ctx.fillRect(0, 0, toolboxWidth, toolboxHeight);
	
	// Draw the toolbox gates
	for (var i=0; i<gateOptions; i++){
		drawGate(gates[i]["letter"], gates[i]["x"]*gridX+gateSize/2, gates[i]["y"]*gridY+gateSize/2, i==hover);
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

// When mouse is moved above the canvas
function mouseMove(e){

	// Move whatever is selected to the mouse
	if (selected >= 0){

		// If it's a control, lock it to the x
		if (gates[selected]["letter"] == "controlFilled" || gates[selected]["letter"] == "controlUnfilled"){
			gates[selected]["y"] = Math.round((e.clientY - offsetY - gateSize / 2) / gridY);
			
		// If it's a normal gate
		} else {
			
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
			if (e.clientX > 0 && e.clientX < toolboxWidth && e.clientY > 0 && e.clientY < toolboxHeight){

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

		// Double click TODO
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
