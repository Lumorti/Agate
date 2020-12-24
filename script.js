
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
var nextFunctionID = 0;
var dragOffset = 0;
var showDelete = false;
var selectStartX = 0;
var selectEndX = 0;
var selectStartY = 0;
var selectEndY = 0;
var selectionArray = [];
var lineStartEnds = [];
var qubitsWithGates = [];
var funcStartEnds = [];

// General settings
var initialZoom = 0.6;
var gateSizeFixed = 50;
var gridYFixed = 60;
var gridXFixed = 60;
var fontSize = initialZoom*35;
var gateSize = initialZoom*gateSizeFixed;
var gridY = initialZoom*gridYFixed;
var gridX = initialZoom*gridXFixed;
var spacing = 0.8;
var toolbarWidth = -1;
var toolbarHeight = -1;
var maxRecDepth = 5;
var zoomSpeed = 0.08;

// For dragging the canvas around
var offsetX = 0;
var offsetY = 0;

// For the tips window
var helpOpen = true;
var nextPrevHover = 0;
var leftDims = [0, 0, 0, 0];
var rightDims = [0, 0, 0, 0];
var tipInd = 0;
var tips = [
	["open",            "If you're new, load the tutorial",   "using the open icon at the top"],
	["H",               "Create gates by dragging them",      "from the toolbar at the top"],
	["controlFilled",   "Double-click and drag on a",         "gate to create a control"],
	["controlUnfilled", "Double-click on controls",           "to toggle them"],
	["sub",             "Function definition gates",          "snap to existing circuits"],
	["fun0",            "Double-click and drag a function",   "to create a call gate"],
	["X",               "Double-click and drag nothing",      "to select multiple gates"],
];

// List of the loadable presets 
var loadOpen = false;
var inputBox = null;
var openHover = false;
var openDims = [0, 0, 0, 0];
var presets = [
	["Local File",       ""],
	["Preset: Blank",    ""],
	["Preset: Tutorial", "OPENQASM 3.0%3B%0Agate f0 q0%2Cq1 %2F%2F -1 15%0A{%0Ax q0%3B%0Ax q1%3B%0A}%0A%2F%2F -4 -14 Add gates by dragging them from the top%0A%2F%2F -4 -12 Double-click and drag on the background to select multiple gates%0A%2F%2F -5 -14 >%0A%2F%2F -1 -20 Agate Tutorial%0A%2F%2F -2 -21 ----------------------------%0A%2F%2F -2 -19 ----------------------------%0A%2F%2F -5 -12 >%0A%2F%2F -5 -17 >%0A%2F%2F -4 -5 Controls can be added to any gate by double-clicking and dragging%0A%2F%2F -4 -4 Toggle controls by double-clicking on them%0A%2F%2F -5 -5 >%0A%2F%2F -5 -4 >%0A%2F%2F -4 -3 Remove controls by dragging them back to their parent gate%0A%2F%2F -5 -3 >%0A%2F%2F -4 -13 Remove gates by dragging them back to the toolbar%0A%2F%2F -5 -13 >%0A%2F%2F -4 -17 Zoom with the mouse wheel (or pinching on mobile)%0A%2F%2F -4 -16 Move the camera by dragging the background%0A%2F%2F -5 -16 >%0A%2F%2F -4 8 Function definition gates will snap to existing circuits%0A%2F%2F -4 9 They can then be double-clicked and dragged to create a function call gate%0A%2F%2F -5 8 >%0A%2F%2F -5 9 >%0Aqubit q[2]%3B %2F%2F -1 -9%0Ah q[0]%3B%0Ax q[0]%3B%0Ai q[1]%3B%0Ai q[1]%3B%0Ai q[1]%3B%0Ai q[1]%3B%0Ax q[1]%3B%0Aqubit q[2]%3B %2F%2F 0 0%0Ah q[0]%3B%0Acx q[0]%2Cq[1]%3B%0Aqubit q[2]%3B %2F%2F 0 4%0Ah q[0]%3B%0Aox q[0]%2Cq[1]%3B%0Aqubit q[2]%3B %2F%2F 1 12%0Af0 q[0]%2Cq[1]%3B%0A"],
	["Preset: Gates",    "OPENQASM 3.0%3B%0A%2F%2F 5 2 -- Hadamard --%0A%2F%2F 6 3 This allows the creation of superposition%2C%0A%2F%2F 14 6 input%0A%2F%2F 17 6 output (unnormalised)%0A%2F%2F 14 7 |0>%0A%2F%2F 17 7 |0> %2B |1>%0A%2F%2F 14 8 |1>%0A%2F%2F 17 8 |0> - |1>%0A%2F%2F 6 4 where the circuit exists in multiple states at once%0A%2F%2F 5 -5 -- Pauli X --%0A%2F%2F 6 -4 This is basically the equivalent of the classical NOT gate%0A%2F%2F 14 -2 input%0A%2F%2F 17 -2 output%0A%2F%2F 14 -1 |0>%0A%2F%2F 17 -1 |1>%0A%2F%2F 14 0 |1>%0A%2F%2F 17 0 |0>%0A%2F%2F 5 10 -- Pauli Z (and other phase gates) --%0A%2F%2F 6 11 These all add some sort of global phase to the state%2C%0A%2F%2F 6 12 assuming an input of |1>%0A%2F%2F 14 29 input%0A%2F%2F 14 14 input%0A%2F%2F 14 18 input%0A%2F%2F 14 22 input%0A%2F%2F 17 29 output%0A%2F%2F 17 14 output%0A%2F%2F 17 18 output%0A%2F%2F 17 22 output%0A%2F%2F 14 30 |0>%0A%2F%2F 14 31 |1>%0A%2F%2F 14 15 |0>%0A%2F%2F 14 16 |1>%0A%2F%2F 14 19 |0>%0A%2F%2F 14 20 |1>%0A%2F%2F 14 23 |0>%0A%2F%2F 14 24 |1>%0A%2F%2F 17 30 i |1>%0A%2F%2F 17 31 -i |0>%0A%2F%2F 17 15 |0>%0A%2F%2F 17 16 - |1>%0A%2F%2F 17 19 |0>%0A%2F%2F 17 20 i |1>%0A%2F%2F 17 24 |1>%0A%2F%2F 17 23 |0>%0A%2F%2F 5 26 -- Pauli Y --%0A%2F%2F 6 27 Performs a NOT as well as adding a phase%0A%2F%2F 10 -8 Agate Gates List%0A%2F%2F 9 -9 ----------------------------------%0A%2F%2F 9 -7 ----------------------------------%0Aqubit q[1]%3B %2F%2F 8 7%0Ah q[0]%3B%0Aqubit q[1]%3B %2F%2F 8 -1%0Ax q[0]%3B%0Aqubit q[1]%3B %2F%2F 8 30%0Ay q[0]%3B%0Aqubit q[1]%3B %2F%2F 8 15%0Az q[0]%3B%0Aqubit q[1]%3B %2F%2F 8 19%0As q[0]%3B%0Aqubit q[1]%3B %2F%2F 8 23%0At q[0]%3B%0A"],
	["Preset: Grover",   "OPENQASM 3.0%3B%0Agate f2 q0%2Cq1 %2F%2F -2 15%0A{%0Ah q0%3B%0Ah q1%3B%0Az q0%3B%0Az q1%3B%0Acz q0%2Cq1%3B%0Ah q0%3B%0Ah q1%3B%0A}%0Agate f1 q0%2Cq1 %2F%2F -2 10%0A{%0Acz q0%2Cq1%3B%0A}%0Agate f0 q0%2Cq1 %2F%2F -2 5%0A{%0Ah q0%3B%0Ah q1%3B%0A}%0A%2F%2F 3 6 this function prepares the search space%0A%2F%2F 3 11 this function adds a negative phase to a state%0A%2F%2F 3 12 (in this case%3A |11> -> -|11>)%0A%2F%2F 6 16 this function amplifies the coefficient%0A%2F%2F 6 17 of the state with negative phase%0A%2F%2F -1 -7 --------------------------------------------------------%0A%2F%2F -3 -3 This algorithm amplifies the chance of measuring a certain %0A%2F%2F -3 -2 state from a big list of possible states%0A%2F%2F 3 7 (in this case%3A a full superposition)%0A%2F%2F 0 -6 Grover's Algorithm Implementation%0A%2F%2F -1 -5 --------------------------------------------------------%0A%2F%2F -1 20 Sources%3A%0A%2F%2F 0 21 https%3A%2F%2Fqiskit.org%2Ftextbook%2Fch-algorithms%2Fgrover.html%0A%2F%2F 0 22 https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FGrover%2527s_algorithm%0Aqubit q[2]%3B %2F%2F 2 1%0Af0 q[0]%2Cq[1]%3B%0Af1 q[0]%2Cq[1]%3B%0Af2 q[0]%2Cq[1]%3B%0A"],
	["Preset: Shor",     "TODO"],
];

// User-modifiable settings 
var drawGrid = true;
var numRepeats = 1000;
var cutoffThresh = 3;
var doubleClickMilli = 300;
var milliForTooltip = 500;

// For timings
var lastClickTime = -1;
var lastSimTime = -1;
var circuitUpdated = true;
var inputs = [[]];
var results = [[]];

// Generate random numbers
var numRands = numRepeats * 4;
var randNums = [];
for (var i=0; i<numRands; i++){
	randNums.push(Math.random());
}

// TODO mobile optimisations
// TODO more than 9 functions

// Called on body ready
function init(recalc){

	// Initialise the canvas
	canvas = document.getElementById("view");
	ctx = canvas.getContext("2d");

	// Add listeners for mouse events
	canvas.addEventListener('mousemove', mouseMove);
	canvas.addEventListener('mousedown', mouseDown);
	canvas.addEventListener('mouseup', mouseUp);
	canvas.addEventListener('wheel', mouseWheel);

	// And for touch events
	canvas.addEventListener("touchstart", touchHandler, true);
    canvas.addEventListener("touchmove", touchHandler, true);
    canvas.addEventListener("touchend", touchHandler, true);
    canvas.addEventListener("touchcancel", touchHandler, true);

	// Add the gate summoning buttons 
	gateOptions = 10;
	toolbarHeight = gateSizeFixed+20;
	toolbarWidth = gridXFixed*(gateOptions+1)-20;
	toolbarOffsetX = window.innerWidth / 2 - toolbarWidth / 2;
	toolbarRel = (toolbarOffsetX / gridXFixed);
	gates = [];
	gates.push({"letter": "H",    "y": 0.33, "x": 0.5+toolbarRel, "size": 1, "draggable": false})
	gates.push({"letter": "X",    "y": 0.33, "x": 1.5+toolbarRel, "size": 1, "draggable": false})
	gates.push({"letter": "Y",    "y": 0.33, "x": 2.5+toolbarRel, "size": 1, "draggable": false})
	gates.push({"letter": "Z",    "y": 0.33, "x": 3.5+toolbarRel, "size": 1, "draggable": false})
	gates.push({"letter": "S",    "y": 0.33, "x": 4.5+toolbarRel, "size": 1, "draggable": false})
	gates.push({"letter": "T",    "y": 0.33, "x": 5.5+toolbarRel, "size": 1, "draggable": false})
	gates.push({"letter": "sub",  "y": 0.33, "x": 6.5+toolbarRel, "size": 1, "draggable": false})
	gates.push({"letter": "text",  "y": 0.33, "x": 7.5+toolbarRel, "size": 1, "draggable": false})
	gates.push({"letter": "open", "y": 0.27, "x": 8.6+toolbarRel, "size": 1, "draggable": false})
	gates.push({"letter": "save", "y": 0.43, "x": 9.6+toolbarRel, "size": 1, "draggable": false})
	gatesInit = gates.slice();

	// Setup the hidden preset load element 
	inputBox = document.createElement("SELECT");
	inputBox.style.position = "absolute";
	inputBox.style.font = "20px Arial";
	inputBox.style.padding = "10px";
	inputBox.value = "test";
	for (var k=0; k<presets.length; k++){
		var option = document.createElement("option");
		option.text = presets[k][0];
		inputBox.add(option);
	}
	document.getElementsByTagName("BODY")[0].appendChild(inputBox);

	// If URL contains QASM info, use it
	if (document.location.hash.length > 1){

		// Get it and process it
		asQasm = decodeURIComponent(document.location.hash);

		// Load the gates from this
		fromQASM(asQasm);

		// Don't show the help
		helpOpen = false;

	}

	// First drawing (twice to ensure consistent functions)
	circuitUpdated = false;
	redraw();
	if (recalc){
		circuitUpdated = true;
		redraw();
	}

}

// Given a letter and a position, draw a gate
function drawGate(letter, x, y, isSelected, size, fixedSize=false){

	// If it's a filled control
	if (letter == "controlFilled"){

		// Draw the circle
		ctx.lineWidth = fontSize/7;
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
		ctx.lineWidth = fontSize/7;
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

	// If it's an subroutine definition
	} else if (letter.substr(0,3) == "sub"){

		// If not a toolbar gate
		if (!fixedSize){

			// Draw the box
			if (!isSelected){
				ctx.fillStyle = "#16a300";
			} else {
				ctx.fillStyle = "#107800";
			}
			ctx.fillRect(x-gateSize/2, y-gateSize/2, gateSize, gateSize+gridY*(size-1));
			
			// Draw the letter
			ctx.font = (fontSize*0.9)+"px Arial";
			ctx.fillStyle = "#ffffff";
			if (letter.length > 3){
				ctx.fillText(letter.substr(3), gridX*0.28+x-gateSize/2, gridY*0.59+y-gateSize/2);
			} else {
				ctx.fillText("F", gridX*0.28+x-gateSize/2, gridY*0.59+y-gateSize/2);
			}

		// If a toolbar gate (and thus fixed sizes should be used)
		} else {

			// Draw the box
			if (!isSelected){
				ctx.fillStyle = "#16a300";
			} else {
				ctx.fillStyle = "#107800";
			}
			ctx.fillRect(x-gateSizeFixed/2, y-gateSizeFixed/2, gateSizeFixed, gateSizeFixed+gridY*(size-1));
			
			// Draw the letter
			ctx.font = "30px Arial";
			ctx.fillStyle = "#ffffff";
			if (letter.length > 3){
				ctx.fillText(letter.substr(3), gridXFixed*0.28+x-gateSizeFixed/2, gridYFixed*0.59+y-gateSizeFixed/2);
			} else {
				ctx.fillText("F", gridXFixed*0.28+x-gateSizeFixed/2, gridYFixed*0.59+y-gateSizeFixed/2);
			}

		}

	// If it's an subroutine call 
	} else if (letter.substr(0,3) == "fun" || letter == "?"){

		// If not a toolbar gate
		if (!fixedSize){

			// Draw the box
			if (!isSelected){
				ctx.fillStyle = "#16a300";
			} else {
				ctx.fillStyle = "#107800";
			}
			ctx.fillRect(x-gateSize/2, y-gateSize/2, gateSize, gateSize+gridY*(size-1));
			
			// Draw the letter
			ctx.font = (fontSize*0.9)+"px Arial";
			ctx.fillStyle = "#ffffff";
			if (letter == "?"){
				ctx.fillText("?", 0.28*gridX+x-gateSize/2, 0.59*gridY+y-gateSize/2);
			} else {
				ctx.fillText(letter.substr(3), 0.28*gridX+x-gateSize/2, 0.59*gridY+y-gateSize/2);
			}

		// If a toolbar gate (and thus fixed sizes should be used)
		} else {

			// Draw the box
			if (!isSelected){
				ctx.fillStyle = "#16a300";
			} else {
				ctx.fillStyle = "#107800";
			}
			ctx.fillRect(x-gateSizeFixed/2, y-gateSizeFixed/2, gateSizeFixed, gateSizeFixed+gridYFixed*(size-1));
			
			// Draw the letter
			ctx.font = "30px Arial";
			ctx.fillStyle = "#ffffff";
			if (letter == "?"){
				ctx.fillText("?", 0.28*gridXFixed+x-gateSizeFixed/2, 0.59*gridYFixed+y-gateSizeFixed/2);
			} else {
				ctx.fillText(letter.substr(3), 0.28*gridXFixed+x-gateSizeFixed/2, 0.59*gridYFixed+y-gateSizeFixed/2);
			}

		}
		
	// If it's the create text icon 
	} else if (letter == "text"){

		// Draw the text
		ctx.font = "40px Serif";
		if (!isSelected){
			ctx.fillStyle = "#555555";
		} else {
			ctx.fillStyle = "#888888";
		}
		ctx.fillText("T", x-11, y+15);
		
	// If it's a gate-like text object 
	} else if (letter.substr(0,4) == "text"){

		// Font and colours
		ctx.font = fontSize + "px Arial";

		// Fill a box behind
		var textWidth = ctx.measureText(letter.substr(4)).width;
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(x-gridX*0.25, y-gridY/2+1, textWidth+gridX*0.17, gridY-2);

		// Draw the text
		if (!isSelected){
			ctx.fillStyle = "#555555";
		} else {
			ctx.fillStyle = "#888888";
		}
		ctx.fillText(letter.substr(4), x-gridX/2+gridX*0.2, y+gridY/2-fontSize/2);

	// If it's the open settings icon 
	} else if (letter == "settings"){

		// Colours
		if (!isSelected){
			ctx.fillStyle = "#555555";
		} else {
			ctx.fillStyle = "#888888";
		}

		// Draw the hamburger menu icon
		roundRect(ctx, x-15, y-12, 30, 5, 3, true, false);
		roundRect(ctx, x-15, y-2, 30, 5, 3, true, false);
		roundRect(ctx, x-15, y+8, 30, 5, 3, true, false);

	// If it's the load/open icon
	} else if (letter == "open"){

		// Colours
		backCol = "#fcb603";
		paperCol = "#ffffff";
		frontCol = "#d49f00";

		// To save adding this everywhere
		x = x-gateSizeFixed/2;
		y = y-gateSizeFixed/2+10;

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

	// If it's the save/download icon
	} else if (letter == "save"){

		// To save adding this everywhere
		x = x-gateSizeFixed/2;
		y = y-gateSizeFixed/2;

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
		x = x-gateSizeFixed/2;

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

		// If it's a H
		if (letter == "H"){
			if (!isSelected){
				ctx.fillStyle = "#e3970b";
			} else {
				ctx.fillStyle = "#bf7e04";
			}

		// If it's something else
		} else {
			if (!isSelected){
				ctx.fillStyle = "#37abc8";
			} else {
				ctx.fillStyle = "#298399";
			}
		}

		// If allowed to scale with zoom
		if (!fixedSize){

			// Draw the box
			ctx.fillRect(x-gateSize/2, y-gateSize/2, gateSize, gateSize+gridY*(size-1));

			// Draw the letter
			ctx.font = (fontSize*0.9) + "px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText(letter, gridX*0.25+x-gateSize/2, gridY*0.58+y-gateSize/2);

		// If part of the toolbar or something not scalable
		} else {
			
			// Draw the box
			ctx.fillRect(x-gateSizeFixed/2, y-gateSizeFixed/2, gateSizeFixed, gateSizeFixed+gridY*(size-1));

			// Draw the letter
			ctx.font = "30px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText(letter, 15+x-gateSizeFixed/2, 35+y-gateSizeFixed/2);

		}


	}

}

// Called whenever something is changed
function redraw(){

	// Ensure it's scaled to the window
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	// Draw grid lines
	if (drawGrid){
		ctx.lineWidth = fontSize/35;
		ctx.strokeStyle = "#aaaaaa";
		for (var x=offsetX%gridX; x<ctx.canvas.width; x+=gridX){
			ctx.beginPath();
			ctx.moveTo(x-(gridX/2)+(gateSize/2), 0);
			ctx.lineTo(x-(gridX/2)+(gateSize/2), ctx.canvas.height);
			ctx.stroke();
		}
		for (var y=offsetY%gridY; y<ctx.canvas.height; y+=gridY){
			ctx.beginPath();
			ctx.moveTo(0, y-(gridY/2)+(gateSize/2));
			ctx.lineTo(ctx.canvas.width, y-(gridY/2)+(gateSize/2));
			ctx.stroke();
		}
	}

	// Reset arrays
	qubitsWithGates = [];
	lineStartEnds = [];

	// Find qubit line rectangles needed ([minX,maxX,minY,maxY])
	for (var i=gateOptions; i<gates.length; i++){

		// Only look at non-function gates first
		if (gates[i]["letter"] != "sub" && gates[i]["letter"].substring(0,4) != "text"){

			// Gate info caches
			var gateX = gates[i]["x"];
			var gateY = gates[i]["y"];
			var size = gates[i]["size"]-1;

			// If it's a function gate inside any other function 
			if (gates[i]["letter"] == "fun"){

				// Assume it's fine
				gates[i]["rec"] = false;

				// Assume controls are fine too
				for (var k=0; k<gates[i]["attached"].length; k++){
					var conInd = fromID(gates[i]["attached"][k]);
					gates[conInd]["rec"] = false;
				}

				// Check all known function locations
				for (var j=0; j<funcStartEnds.length; j++){

					// If recursive, don't expand
					if (gateY+size >= funcStartEnds[j][2]-2 && gateY <= funcStartEnds[j][3]+2){
						gates[i]["rec"] = true;
					}

					// Also check controls 
					for (var k=0; k<gates[i]["attached"].length; k++){
						var conInd = fromID(gates[i]["attached"][k]);
						if (gates[conInd]["y"] >= funcStartEnds[j][2]-2 && gates[conInd]["y"] <= funcStartEnds[j][3]+2){
							gates[i]["rec"] = true;
							gates[conInd]["rec"] = true;
						}

					}

				}

			}
			
			// Don't deal with it if it's trying to recurse
			if (gates[i]["rec"] === true){
				continue;
			}

			// Keep track of the number of gates on each qubit
			for (var j=0; j<size+1; j++){
				if (qubitsWithGates.indexOf(gateY+j) < 0){
					qubitsWithGates.push(gateY+j);
				}
			}

			// Check if this gate is in an existing rectangle 
			var inRect = [];
			for (var j=0; j<lineStartEnds.length; j++){

				// If the gate itself is in the rect
				if (gateY <= lineStartEnds[j][3]+1 && gateY+size >= lineStartEnds[j][2]-1){
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
					if ((gates[controlInd]["y"] <= lineStartEnds[j][3]+1 && gates[controlInd]["y"] >= lineStartEnds[j][2]-1) || (gates[controlInd]["y"] >= lineStartEnds[j][3]+1 && gateY <= lineStartEnds[j][2]-1) || (gates[controlInd]["y"] <= lineStartEnds[j][2]-1 && gateY >= lineStartEnds[j][3]+1)){
						inRect.push(j);
					}
				}

			}

			// If connecting multiple rectangles 
			if (inRect.length >= 1){

				// Start with a slightly expanded rect
				var mergedRect = [gateX-1, gateX+1, gateY, gateY+size, -1];

				// Combine rects
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
					if (lineStartEnds[inRect[k]][4] != -1){
						mergedRect[4] = lineStartEnds[inRect[k]][4];
					}

				}

				// Remove the old ones 
				var newList = []
				for (var k=0; k<lineStartEnds.length; k++){
					if (inRect.indexOf(k) < 0){
						newList.push(lineStartEnds[k].slice());
					}
				}
				newList.push(mergedRect.slice());
				lineStartEnds = newList.slice();

			// Otherwise add a new rectangle
			} else if (gates[i]["letter"] != "sub"){

				// Add the new rect
				lineStartEnds.push([gateX-1, gateX+1, gateY, gateY+size, -1]);

				// This gate is creating a new rect, thus isn't recursing
				if (gates[i]["letter"] == "fun"){
					gates[i]["rec"] = false;
				}

			}

		}

	}

	// Now check again, but for function gates
	funcStartEnds = [];
	for (var i=gateOptions; i<gates.length; i++){

		// If it's a function gate
		if (gates[i]["letter"] == "sub"){

			// For consistency with prev section
			gateX = gates[i]["x"];
			gateY = gates[i]["y"];

			// Loop over the rects 
			for (var j=0; j<lineStartEnds.length; j++){

				// See if this rect should be a function  
				if (gateY >= lineStartEnds[j][2]-1 && gateY <= lineStartEnds[j][3]+1 && gateX == lineStartEnds[j][0]-1){
					lineStartEnds[j][4] = gates[i]["funID"];
					funcStartEnds.push(lineStartEnds[j].slice());
					break;
				}

			}

		}

	}

	// Draw each qubit grid
	for (var i=0; i<lineStartEnds.length; i++){
		for (var y=lineStartEnds[i][2]; y<=lineStartEnds[i][3]; y++){
			if (qubitsWithGates.indexOf(y) >= 0){
				ctx.lineWidth = fontSize/7;
				ctx.strokeStyle = "#aaaaaa";
				ctx.beginPath();
				ctx.moveTo((lineStartEnds[i][0])*gridX+gateSize/2+offsetX, offsetY+y*gridY+gateSize/2);
				ctx.lineTo((lineStartEnds[i][1])*gridX+gateSize/2+offsetX, offsetY+y*gridY+gateSize/2);
				ctx.stroke();
			}
		}

		// If it's a function 
		if (lineStartEnds[i][4] != -1){
			ctx.lineWidth = fontSize/3.5;
			ctx.strokeStyle = "#16a300";
			ctx.beginPath();
			ctx.moveTo((lineStartEnds[i][0]+1)*gridX+gateSize/2+offsetX, offsetY+(lineStartEnds[i][2]-1)*gridY+gateSize/2);
			ctx.lineTo((lineStartEnds[i][0]-1)*gridX+gateSize/2+offsetX, offsetY+(lineStartEnds[i][2]-1)*gridY+gateSize/2);
			ctx.lineTo((lineStartEnds[i][0]-1)*gridX+gateSize/2+offsetX, offsetY+(lineStartEnds[i][3]+1)*gridY+gateSize/2);
			ctx.lineTo((lineStartEnds[i][1]+1)*gridX+gateSize/2+offsetX, offsetY+(lineStartEnds[i][3]+1)*gridY+gateSize/2);
			ctx.lineTo((lineStartEnds[i][1]+1)*gridX+gateSize/2+offsetX, offsetY+(lineStartEnds[i][2]-1)*gridY+gateSize/2);
			ctx.lineTo((lineStartEnds[i][0]+1)*gridX+gateSize/2+offsetX, offsetY+(lineStartEnds[i][2]-1)*gridY+gateSize/2);
			ctx.stroke();
		}

	}

	// Draw the control lines
	for (var i=gateOptions; i<gates.length; i++){
		for (var j=0; j<gates[i]["attached"].length; j++){
			ctx.lineWidth = fontSize/7;
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

		// If it's a function definition 
		if (gates[i]["letter"] == "sub"){

			// Draw it
			drawGate(gates[i]["letter"]+gates[i]["funID"], gates[i]["x"]*gridX+gateSize/2+offsetX, offsetY+gates[i]["y"]*gridY+gateSize/2, isSel, 1);

		// If it's a function call 
		} else if (gates[i]["letter"] == "fun"){

			// If there's some sort of error, recursion or otherwise 
			rectInd = indFromFunID(gates[i]["funID"]);
			if (gates[i]["rec"] || rectInd < 0){
				drawGate("?", gates[i]["x"]*gridX+gateSize/2+offsetX, offsetY+gates[i]["y"]*gridY+gateSize/2, isSel, gates[i]["size"]);

			// Otherwise draw normally
			} else {
				gates[i]["size"] = lineStartEnds[rectInd][3]-lineStartEnds[rectInd][2]+1;
				drawGate(gates[i]["letter"]+gates[i]["funID"], gates[i]["x"]*gridX+gateSize/2+offsetX, offsetY+gates[i]["y"]*gridY+gateSize/2, isSel, gates[i]["size"]);
			}

		// If it's a normal gate
		} else if (gates[i]["letter"].substring(0,4) != "text") {

			// Draw it
			drawGate(gates[i]["letter"], gates[i]["x"]*gridX+gateSize/2+offsetX, offsetY+gates[i]["y"]*gridY+gateSize/2, isSel, gates[i]["size"]);

		}
	}

	// Only when the circuit has changed
	if (circuitUpdated){

		// Reset random index
		randInd = 0

		// For each independent section of circuit
		for (var i=0; i<lineStartEnds.length; i++){

			// If not a function
			if (lineStartEnds[i][4] == -1){

				// Get the inputs
				inputs[i] = [[100, [1, 0], ""]]
				for (var j=0; j<1+lineStartEnds[i][3]-lineStartEnds[i][2]; j++){
					inputs[i][0][2] += "0";
				}

				// Simulate circuit 
				results[i] = simulateCircuit(inputs[i][0], gates, lineStartEnds[i], numRepeats, 0);

			}

		}

		// If not empty
		if (gates.length > gateOptions){

			// Convert gate list to URL-ready QASM
			newURL = toQASM();

			// Update URL 
			history.replaceState(null, null, document.location.pathname + '#' + encodeURIComponent(newURL));

		} else {

			// Reset URL 
			history.replaceState(null, null, document.location.pathname);

		}

		// Circuit no longer needs re-simulating
		circuitUpdated = false;

	}

	// Only if not dragging
	if (selected < 0){

		// For each independent section of circuit
		for (var i=0; i<Math.min(inputs.length, lineStartEnds.length); i++){

			// If not a function
			if (lineStartEnds[i][4] == -1){

				// Render the inputs
				renderState(ctx, inputs[i], lineStartEnds[i][0]-1, lineStartEnds[i][2], qubitsWithGates, true);
				
				// Render the outputs
				renderState(ctx, results[i], lineStartEnds[i][1]+1, lineStartEnds[i][2], qubitsWithGates, false);

			}

		}

	}

	// Draw the text objects 
	for (var i=gateOptions; i<gates.length; i++){
		if (gates[i]["letter"].substring(0,4) == "text"){
			isSel = (i == hover) || (selectionArray.indexOf(i) >= 0);
			drawGate(gates[i]["letter"], gates[i]["x"]*gridX+gateSize/2+offsetX, offsetY+gates[i]["y"]*gridY+gateSize/2, isSel, gates[i]["size"]);
		}
	}

	// Toolbar outline 
	ctx.fillStyle = "#dddddd";
	roundRect(ctx, toolbarOffsetX, 10, toolbarWidth, toolbarHeight, 20, true, false);
	
	// Draw the toolbar gates
	for (var i=0; i<gateOptions; i++){
		drawGate(gates[i]["letter"], gates[i]["x"]*gridXFixed+gateSizeFixed/2, gates[i]["y"]*gridYFixed+gateSizeFixed/2, i==hover, gates[i]["size"], true);
	}

	// If dragging a gate, change the toolbar
	if (showDelete){

		// Fade everything
		ctx.fillStyle = "#aaaaaa55";
		roundRect(ctx, toolbarOffsetX, 10, toolbarWidth, toolbarHeight, 20, true, false);

		// Draw a delete icon 
		drawGate("delete", toolbarOffsetX+toolbarWidth/2, 30, false, 1);

	}

	// Draw the selected gate on top
	if (selected >= 0){

		// To allow copy/pasting from the gate drawing section above
		i = selected;

		// If it's a normal gate
		if (gates[i]["letter"] != "fun"){

			// Draw it
			drawGate(gates[i]["letter"], gates[i]["x"]*gridX+gateSize/2+offsetX, offsetY+gates[i]["y"]*gridY+gateSize/2, true, gates[i]["size"]);

		// If it's a function call 
		} else {

			// Draw it normally
			if (gates[i]["rec"]){
				drawGate(gates[i]["letter"], gates[i]["x"]*gridX+gateSize/2+offsetX, offsetY+gates[i]["y"]*gridY+gateSize/2, true, gates[i]["size"]);
			} else {
				drawGate("?", gates[i]["x"]*gridX+gateSize/2+offsetX, offsetY+gates[i]["y"]*gridY+gateSize/2, true, gates[i]["size"]);
			}

		}

	}

	// If box selecting
	if (selected == -6){

		// Draw the box
		ctx.fillStyle = "#aaaaaa55";
		ctx.fillRect(selectStartX, selectStartY, selectEndX-selectStartX, selectEndY-selectStartY);

	}

	// If help window open 
	if (helpOpen){

		var helpWidth = 500;
		var helpHeight = 300;
		var helpLeft = window.innerWidth / 2 - helpWidth / 2;
		var helpTop = window.innerHeight / 2 - helpHeight / 2;

		// Draw the outline
		ctx.fillStyle = "#dddddd";
		roundRect(ctx, helpLeft, helpTop, helpWidth, helpHeight, 20, true, false);

		// Draw the title inner rect
		ctx.fillStyle = "#eeeeee";
		roundRect(ctx, helpLeft+30, helpTop+30, helpWidth-60, 80, 10, true, false);

		// Draw the title text
		ctx.font = "35px bold Arial";
		ctx.fillStyle = "#555555";
		ctx.fillText("Welcome to Agate!", helpLeft+80, helpTop+85);

		// Draw the current tip 
		drawGate(tips[tipInd][0], helpLeft+75, helpTop+170, false, 1, true);
		ctx.font = "20px bold Arial";
		ctx.fillStyle = "#555555";
		ctx.fillText(tips[tipInd][1], helpLeft+125, helpTop+160);
		ctx.fillText(tips[tipInd][2], helpLeft+125, helpTop+195);

		// Draw the "out-of" text
		ctx.fillText("(tip " + (tipInd+1) + "/" + tips.length + ")", helpLeft+205, helpTop+255);
		
		// Draw the left arrow
		leftDims = [helpLeft+60, helpLeft+160, helpTop+240, helpTop+260];
		if (nextPrevHover == 1){
			ctx.fillStyle = "#222222";
		} else {
			ctx.fillStyle = "#555555";
		}
		ctx.beginPath();
		ctx.moveTo(helpLeft+80, helpTop+240);
		ctx.lineTo(helpLeft+80, helpTop+260);
		ctx.lineTo(helpLeft+60, helpTop+250);
		ctx.lineTo(helpLeft+80, helpTop+240);
		ctx.fill();
		ctx.fillText("prev", helpLeft+95, helpTop+255);

		// Draw the right arrow
		rightDims = [helpLeft+340, helpLeft+440, helpTop+240, helpTop+260];
		if (nextPrevHover == 2){
			ctx.fillStyle = "#222222";
		} else {
			ctx.fillStyle = "#555555";
		}
		ctx.beginPath();
		ctx.moveTo(helpLeft+420, helpTop+240);
		ctx.lineTo(helpLeft+420, helpTop+260);
		ctx.lineTo(helpLeft+440, helpTop+250);
		ctx.lineTo(helpLeft+420, helpTop+240);
		ctx.fill();
		ctx.fillText("next", helpLeft+355, helpTop+255);

	}

	// If the load window is open 
	if (loadOpen){

		// Settings to be updated here in case of window resize
		var loadWidth = 400;
		var loadHeight = 120;
		var loadLeft = window.innerWidth / 2 - loadWidth / 2;
		var loadTop = window.innerHeight / 2 - loadHeight / 2;

		// Draw the outline
		ctx.fillStyle = "#dddddd";
		roundRect(ctx, loadLeft, loadTop, loadWidth, loadHeight, 20, true, false);

		// Update the preset selection box 
		inputBox.style.top = (loadTop+30) + "px";
		inputBox.style.left = (loadLeft+30) + "px";
		inputBox.style.width = (loadWidth-150) + "px";
		inputBox.style.display = "block";
		
		// Draw the second load button
		openDims = [loadLeft+305, loadLeft+365, loadTop+23, loadTop+83];
		drawGate("open", loadLeft+335, loadTop+53, openHover, 1);

	// Otherwise, hide the selection box DOM element
	} else {
		inputBox.style.display = "none";
	}

}

// Render the given states at the specified position 
function renderState(ctx, states, x, y, qubitsWithGates, goLeft){

	// Style parameters
	ctx.lineWidth = fontSize / 7;
	ctx.strokeStyle = "#555555";
	ctx.fillStyle = ctx.strokeStyle;

	// For each state
	for (var i=0; i<states.length; i++){

		// If of significant probability
		if ((i < 10) && (i < 3 || states[i][0] >= cutoffThresh)){
		
			// For each qubit of the state
			for (var j=0; j<states[i][2].length; j++){

				// If there's anything on that qubit
				if (qubitsWithGates.indexOf(y+j) >= 0){

					// Draw that qubit's state
					textX = (x+i)*gridX+offsetX+gridX*0.27;
					textY = (y+j)*gridY+offsetY+gridY*0.6;
					ctx.font = fontSize + "px Arial";
					ctx.fillText(states[i][2][j], textX, textY);

				}

			}

			// To simplify the code
			leftX = (x+i)*gridX+offsetX+gateSize/2-gridX*0.4;
			rightX = (x+i)*gridX+offsetX+gateSize/2+gridX*0.4;
			topY = y*gridY+offsetY-(gridY-gateSize)/2;
			bottomY = (y+states[i][2].length)*gridY+offsetY-(gridY-gateSize)/2;

			// Draw the top part of the ket
			ctx.beginPath();
			ctx.moveTo(leftX, topY);
			ctx.lineTo(rightX, topY);
			ctx.stroke();

			// Probability estimate at the top
			if (states[i][0] >= 100){
				textX = (x+i)*gridX+offsetX+gridX*0.05;
			} else if (states[i][0] >= 10) {
				textX = (x+i)*gridX+offsetX+gridX*0.15;
			} else {
				textX = (x+i)*gridX+offsetX+gridX*0.2;
			}
			textY = (y-1)*gridY+offsetY+gridY/2+8;
			ctx.font = (fontSize/2)+"px Arial";
			ctx.fillText(states[i][0] + "%", textX, textY);

			// Draw the bottom part of the ket
			ctx.beginPath();
			ctx.moveTo(leftX, bottomY);
			ctx.lineTo((leftX+rightX)/2, bottomY+gridY*0.2);
			ctx.lineTo(rightX, bottomY);
			ctx.stroke();

		}

	}

}

// Given inputs, gates and a box, simulate the circuit and return the states/counts 
function simulateCircuit(inputLocal, gates, boundingBox, repeats, recDepth){

	// Init the results array
	var resultsLocal = [];

	// List of the gates to apply in order
	var toApply = [];

	// Get valid gates
	var validGates = []
	for (var i=gateOptions; i<gates.length; i++){
		if (gates[i]["rec"] != true && gates[i]["x"] >= boundingBox[0] && gates[i]["x"] <= boundingBox[1] && gates[i]["y"] >= boundingBox[2] && gates[i]["y"] <= boundingBox[3]){
			validGates.push(gates[i]);
		}
	}

	// Sort in order
	var sortedGates = validGates.slice();
	sortedGates.sort(function(a, b){return a["x"] - b["x"];});

	// Repeats a number of times
	for (var i=0; i<repeats; i++){
	
		// Start with input state with coefficient 1+0i
		var state = inputLocal[2];
		var coeff = inputLocal[1].slice();

		// For each gate in order
		for (var j=0; j<sortedGates.length; j++){

			// Gate info
			var letter = sortedGates[j]["letter"];
			var target = sortedGates[j]["y"]-boundingBox[2];
			var controlIDs = sortedGates[j]["attached"];

			// Check if controls all valid 
			var controlsValid = true;
			for (var k=0; k<controlIDs.length; k++){

				// Get control info
				var controlInd = fromIDArray(controlIDs[k], sortedGates);
				var controlQubit = sortedGates[controlInd]["y"]-boundingBox[2];
				var controlFilled = sortedGates[controlInd]["letter"] == "controlFilled";

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
					var qubitBefore = state[target];
					if (randNums[randInd] < 0.5){
						state = state.substring(0, target) + (state[target] == "1" ? "0" : "1") + state.substring(target+1, state.length);
					}

					// H|1> = |0>-|1>
					if (qubitBefore == "1" && state[target] == "1"){
					
						// Update coefficient
						coeff[0] = -coeff[0];
						coeff[1] = -coeff[1];

					}

					// Next random number
					randInd += 1;
					if (randInd > numRands){randInd = 0};

				// If it's an X
				} else if (letter == "X"){

					// Bit flip
					state = state.substring(0, target) + (state[target] == "1" ? "0" : "1") + state.substring(target+1, state.length);

				// If it's a Y
				} else if (letter == "Y"){

					// Update coefficient
					if (state[target] == "1"){
						var temp = coeff[0];
						coeff[0] = -coeff[1];
						coeff[1] = temp;
					} else {
						var temp = coeff[0];
						coeff[0] = coeff[1];
						coeff[1] = -temp;
					}

					// Bit flip
					state = state.substring(0, target) + (state[target] == "1" ? "0" : "1") + state.substring(target+1, state.length);
					
				// If it's a Z
				} else if (letter == "Z" && state[target] == "1"){

					// Update coefficient
					coeff[0] = -coeff[0];
					coeff[1] = -coeff[1];

				// If it's an S
				} else if (letter == "S" && state[target] == "1"){

					// Update coefficient
					var temp = coeff[0];
					coeff[0] = -coeff[1];
					coeff[1] = temp;
				
				// If it's a T 
				} else if (letter == "T" && state[target] == "1"){

					// Update coefficient
					var a = coeff[0];
					var b = coeff[1];
					coeff[0] = (a-b) / Math.sqrt(2);
					coeff[1] = (a+b) / Math.sqrt(2);

				// If it's a function 
				} else if (letter == "fun"){
					
					// If gate is valid
					var rectInd = indFromFunID(sortedGates[j]["funID"]);
					if (rectInd >= 0 && recDepth < maxRecDepth){

						// Prepare the next input state
						var finInd = target + sortedGates[j]["size"]-1;
						var newInput = [100, coeff, state.substring(target, finInd+1)];

						// Sim the function section once
						var newResults = simulateCircuit(newInput, gates, lineStartEnds[rectInd], 1, recDepth+1);

						// Update the main state 
						state = state.substring(0, target) + newResults[0][2] + state.substring(finInd+1, state.length);
						coeff = newResults[0][1];

					}

				}

			}

		}

		// Check if this state has already been added
		var exists = -1;
		for (var k=0; k<resultsLocal.length; k++){
			if (resultsLocal[k][2] == state){
				exists = k;
			}
		}

		// If it doesn't exist, add it
		if (exists < 0){
			resultsLocal.push([1, coeff, state]);

		// Otherwise, increment the count 
		} else {
			resultsLocal[exists][0] += 1;
			resultsLocal[exists][1][0] += coeff[0];
			resultsLocal[exists][1][1] += coeff[1];
		}

	}

	// Only normalise the top-level results
	if (recDepth == 0){
		
		// Get mag of total vector and normalise each coefficient
		var totalMag = 0;
		for (var i=0; i<resultsLocal.length; i++){
			resultsLocal[i][0] = Math.sqrt(resultsLocal[i][1][0]**2+resultsLocal[i][1][1]**2);
			resultsLocal[i][1][0] /= resultsLocal[i][0];
			resultsLocal[i][1][1] /= resultsLocal[i][0];
			totalMag += resultsLocal[i][0];
		}

		// Turn counts into probabilities
		for (var i=0; i<resultsLocal.length; i++){
			resultsLocal[i][0] = Math.round(100 * (resultsLocal[i][0] / totalMag));
		}

	}

	// Sort the states in probability order and return
	resultsLocal.sort(function(a, b){return b[0] - a[0];});
	return resultsLocal;

}

// Get the index of a rect with a certain function ID
function indFromFunID(funID){
	for (var m=0; m<lineStartEnds.length; m++){
		if (lineStartEnds[m][4] == funID){
			return m;
		}
	}
	return -1;
}

// Return true if two imaginary numbers are similar a+ib = [a, b]
function compareImag(num1, num2){
	return Math.abs(num1[0]-num2[0]) < 0.1 && Math.abs(num1[1]-num2[1]) < 0.1;
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

			// Move the control
			gates[selected]["x"] = Math.round((e.clientX - offsetX - gateSize / 2) / gridX);
			gates[selected]["y"] = Math.round((e.clientY - offsetY - gateSize / 2) / gridY);

			// Move the og too
			og = gates[fromID(gates[selected]["og"])];
			og["x"] = gates[selected]["x"];

		// If it's a function
		} else if (gates[selected]["letter"] == "sub"){

			// Get whichever circuit section it's in 
			inSection = -1;
			mouseX = Math.round((e.clientX - offsetX - gateSize / 2) / gridX);
			mouseY = Math.round((e.clientY - offsetY - gateSize / 2) / gridY);
			for (var j=0; j<lineStartEnds.length; j++){
				if (mouseX >= lineStartEnds[j][0]-1 && mouseX <= lineStartEnds[j][1]+1 && mouseY >= lineStartEnds[j][2]-1 && mouseY <= lineStartEnds[j][3]+1){
					inSection = j;
					break;
				}
			}

			// Move it to the top left of that section 
			if (inSection >= 0){
				gates[selected]["x"] = lineStartEnds[inSection][0]-1;
				gates[selected]["y"] = lineStartEnds[inSection][2]-1;
			} else {
				gates[selected]["x"] = mouseX;
				gates[selected]["y"] = mouseY;
			}

			// Show the delete bar
			showDelete = true;
			
		// If it's a text object
		} else if (gates[selected]["letter"].substring(0,4) == "text"){
			
			// Show the delete bar
			showDelete = true;

			// Move this gate to the mouse, x and y 
			gates[selected]["x"] = Math.round(-dragOffset + (e.clientX - offsetX - gateSize / 2) / gridX);
			newY = Math.round((e.clientY - offsetY - gateSize / 2) / gridY);

			// Update the new y now the delta has been processed
			gates[selected]["y"] = newY;

		// If it's a normal gate
		} else {
			
			// Show the delete bar
			showDelete = true;

			// Move this gate to the mouse, x and y 
			gates[selected]["x"] = Math.round((e.clientX - offsetX - gateSize / 2) / gridX);
			newY = Math.round(-dragOffset + (e.clientY - offsetY - gateSize / 2) / gridY);

			// Move any attached controls along with it
			for (var i=0; i<gates[selected]["attached"].length; i++){
				control = gates[fromID(gates[selected]["attached"][i])]
				control["x"] = Math.round((e.clientX - offsetX - gateSize / 2) / gridX);
			}

			// Update the new y now the delta has been processed
			gates[selected]["y"] = newY;

		}

	// If dragging multiple gates 
	} else if (selected >= 0 && selectionArray.length > 0){

		// Determine the deltas from the selected gate
		if (gates[selected]["letter"].substring(0,4) == "text"){
			deltaX = Math.round(-dragOffset + (e.clientX - offsetX - gateSize / 2) / gridX) - gates[selected]["x"];
		} else {
			deltaX = Math.round((e.clientX - offsetX - gateSize / 2) / gridX) - gates[selected]["x"];
		}
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
				}

			// If a control 
			} else {

				// Who's og isn't in the selection
				og = fromID(gates[sel]["og"]);
				if (selectionArray.indexOf(og) < 0){
				
					// Move this gate to the mouse x
					gates[sel]["x"] += deltaX;

					// Move the og too
					og["x"] += deltaX;

				}

				// Follow the y always
				gates[sel]["y"] += deltaY;

			}

		}

	// If dragging the background
	} else if (selected == -5){

		// Move the offsets
		offsetX += e.movementX;
		offsetY += e.movementY;

	// If selecting
	} else if (selected == -6){

		// Change the pointer
		canvas.style.cursor = "pointer";

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

		// Reset things
		canvas.style.cursor = "initial";
		hover = -1;

		// Check over every draggable gate 
		for (var i=0; i<gates.length; i++){
			if (gates[i]["draggable"]){

				// Get the dimensions to check
				var gxMin = gates[i]["x"]*gridX+offsetX;
				var gyMin = gates[i]["y"]*gridY+offsetY;
				var gxMax = gxMin + gateSize;
				var gyMax = gyMin + gateSize;
				var perSizeY = gridY;
				var perSizeX = gridX;

				// If it's not a text object 
				if (gates[i]["letter"].substring(0,4) != "text"){

					// Check for mouse within gate area 
					for (var j=0; j<gates[i]["size"]; j++){
						if (e.clientX > gxMin && e.clientX < gxMax && e.clientY > gyMin && e.clientY < gyMax+j*perSizeY){
							canvas.style.cursor = "pointer";
							hover = i;
							dragOffset = j;
							break;
						}
					}
					
				// If it's a text object 
				} else {

					// Check for mouse within gate area 
					for (var j=0; j<gates[i]["size"]; j++){
						if (e.clientX > gxMin && e.clientX < gxMax+j*perSizeX && e.clientY > gyMin && e.clientY < gyMax){
							canvas.style.cursor = "pointer";
							hover = i;
							dragOffset = j;
							break;
						}
					}

				}

			}

		}

		// Check over every non-draggable (i.e. toolbar) gate 
		for (var i=0; i<gates.length; i++){
			if (!gates[i]["draggable"]){

				// Get the dimensions to check
				var gxMin = gates[i]["x"]*gridXFixed;
				var gyMin = gates[i]["y"]*gridYFixed;
				var gxMax = gxMin + gateSizeFixed;
				var gyMax = gyMin + gateSizeFixed;
				var perSizeY = gridYFixed;
				var perSizeX = gridXFixed;

				// Check for mouse within gate area 
				for (var j=0; j<gates[i]["size"]; j++){
					if (e.clientX > gxMin && e.clientX < gxMax && e.clientY > gyMin && e.clientY < gyMax+j*perSizeY){
						canvas.style.cursor = "pointer";
						hover = i;
						dragOffset = j;
						break;
					}
				}

			}

		}

		// Check for other button hover  
		if (e.clientX > leftDims[0] && e.clientX < leftDims[1] && e.clientY > leftDims[2] && e.clientY < leftDims[3]){
			nextPrevHover = 1;
			openHover = false;
			canvas.style.cursor = "pointer";
		} else if (e.clientX > rightDims[0] && e.clientX < rightDims[1] && e.clientY > rightDims[2] && e.clientY < rightDims[3]){
			nextPrevHover = 2;
			openHover = false;
			canvas.style.cursor = "pointer";
		} else if (loadOpen && e.clientX > openDims[0] && e.clientX < openDims[1] && e.clientY > openDims[2] && e.clientY < openDims[3]){
			openHover = true;
			nextPrevHover = 0;
			canvas.style.cursor = "pointer";
		} else if (hover == -1 && selected == -1) {
			nextPrevHover = 0;
			openHover = false;
			canvas.style.cursor = "initial";
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
			if (gates[selected]["x"] == gates[og]["x"] && gates[selected]["y"] >= gates[og]["y"] && gates[selected]["y"] <= gates[og]["y"]+gates[og]["size"]-1){

				// Remove from the attached list of its parent
				gates[og]["attached"].splice(gates[og]["attached"].indexOf(fromID(selected)), 1);

				// Remove this gate
				gates.splice(selected, 1);

			}

		// If not a control
		} else {

			// If dropped into the toolbar 
			if (e.clientX > toolbarOffsetX && e.clientX < toolbarOffsetX+toolbarWidth && e.clientY > 0 && e.clientY < toolbarHeight){

				// Remove all its controls
				for (var i=0; i<gates[selected]["attached"].length; i++){
					gates.splice(fromID(gates[selected]["attached"][i]), 1);
				}
				
				// Remove this gate
				gates.splice(selected, 1);

			}

		}

		// If no longer any gates
		if (gates.length == gateOptions){
			helpOpen = true;
		}

		// Circuit has changed
		circuitUpdated = true;

	// If many selected 
	} else if (selected > 0 && selectionArray.length > 0){

		// If dropped into the toolbar 
		if (e.clientX > toolbarOffsetX && e.clientX < toolbarOffsetX+toolbarWidth && e.clientY > 0 && e.clientY < toolbarHeight){

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
				if (ind >= gateOptions){
					gates.splice(ind, 1);
				}
			}

			// Stop selecting everything since they no longer exist
			selectionArray = [];

		}

		// If no longer any gates
		if (gates.length == gateOptions){
			helpOpen = true;
		}

		// Circuit has changed
		circuitUpdated = true;

	}
	
	// Deselect current gate 
	selected = -1;
	mouseMove(e);

	// Update the canvas
	redraw();

}

// When mouse button pressed down
function mouseDown(e){

	// Get the current time in milliseconds
	var currentTime = new Date().getTime();

	// If it's the second open icon 
	if (openHover){

		// See what's in the selection box
		var ind = inputBox.selectedIndex;

		// If asking to load a local file
		if (ind == 0){

			// Open the file input box
			document.getElementById("fileIn").click(); 

		// If loading some sort of preset
		} else {

			// Hide the load window
			loadOpen = false;
			openHover = false;
			
			// Get it and process it
			asQasm = decodeURIComponent(presets[ind][1]);

			// Load the gates from this
			fromQASM(asQasm);

			// If loading a blank preset, show the help
			if (asQasm.length == 0){
				helpOpen = true;
			}

			// Re-sim and redraw (twice just to ensure consistent functions)
			circuitUpdated = false;
			redraw();
			circuitUpdated = true;
			redraw();

		}
		
	// If hovering over a gate
	} else if (hover >= 0){

		// If showing the help, close it 
		if (helpOpen){
			helpOpen = false;
		}

		// Double click 
		if ((currentTime - lastClickTime) < doubleClickMilli){

			// If it can be dragged (i.e. not in the toolbar)
			if (gates[hover]["draggable"]){

				// If it's a filled control
				if (gates[hover]["letter"] == "controlFilled"){

					// Change it to be unfilled
					gates[hover]["letter"] = "controlUnfilled";
					circuitUpdated = true;

				// If it's a filled control
				} else if (gates[hover]["letter"] == "controlUnfilled"){

					// Change it to be unfilled
					gates[hover]["letter"] = "controlFilled";
					circuitUpdated = true;

				// If it's a sub gate
				} else if (gates[hover]["letter"] == "sub"){

					// Create a sub call at the cursor
					gates.push({"id": nextID, "funID": gates[hover]["funID"],"letter": "fun", "x": Math.round(gates[hover]["x"]), "y": Math.round(gates[hover]["y"]), "size": 1, "draggable": true, "og": gates[hover]["id"], "attached":[]})
					nextID += 1;

					// Select this new gate
					selected = gates.length-1;
					hover = gates.length-1;

				// If it's a text object 
				} else if (gates[hover]["letter"].substring(0,4) == "text"){

					// Open a prompt to change the text
					var newText = prompt("Enter new text:", gates[hover]["letter"].substr(4));

					// If the user didn't cancel
					if (newText !== null){

						// Update the gate's text and size
						gates[hover]["letter"] = "text" + newText;
						ctx.font = "35px Arial";
						gates[hover]["size"] = Math.max(1, Math.ceil(ctx.measureText(newText).width / gridX))
						circuitUpdated = true;

					}

				// If it's a normal gate (and not selecting many)
				} else if (selectionArray.length == 0) {

					// Create a control at the cursor
					gates.push({"id": nextID, "letter": "controlFilled", "x": Math.round(gates[hover]["x"]), "y": Math.round(gates[hover]["y"]), "size": 1, "draggable": true, "og": gates[hover]["id"], "attached":[]})
					nextID += 1;

					// Add this control to the attached list of the og gate
					gates[hover]["attached"].push(nextID-1);

					// Select this new control
					selected = gates.length-1;
					hover = gates.length-1;

				}
				
			}

		// Single click
		} else {

			// If selecting something not already selected
			if (selectionArray.indexOf(hover) == -1){
				selectionArray = [];
			}
			
			// If it can be dragged, select it
			if (gates[hover]["draggable"]){
				selected = hover;

			// If it's the text icon, create a text object 
			} else if (gates[hover]["letter"] == "text"){
				gates.push({"id": nextID, "letter": "textdouble click to edit", "x": Math.round(gates[hover]["x"]), "y": Math.round(gates[hover]["y"]), "size": 7, "draggable": true, "attached":[]})
				dragOffset = 2;
				nextID += 1;
				selected = gates.length-1;
				hover = gates.length-1;

			// If it's the save icon 
			} else if (gates[hover]["letter"] == "save"){

				// Convert circuit to qasm 
				asQASM = toQASM();

				// Download the qasm
				download("circuit.qasm", asQASM);

			// If it's the open icon 
			} else if (gates[hover]["letter"] == "open"){

				// Open the loading choice box
				loadOpen = true;

			// If it's a new function
			} else if (gates[hover]["letter"] == "sub"){
				gates.push({"id": nextID, "funID": nextFunctionID, "letter": gates[hover]["letter"], "x": Math.round(gates[hover]["x"]), "y": Math.round(gates[hover]["y"]), "size": 1, "draggable": true, "attached":[]})
				nextID += 1;
				nextFunctionID += 1;
				selected = gates.length-1;
				hover = gates.length-1;

			// If it can't, create a new gate and select that 
			} else {
				gates.push({"id": nextID, "letter": gates[hover]["letter"], "x": Math.round(gates[hover]["x"]), "y": Math.round(gates[hover]["y"]), "size": 1, "draggable": true, "attached":[]})
				nextID += 1;
				selected = gates.length-1;
				hover = gates.length-1;
				mouseMove(e);
			}


		}

	// If hovering over the next/prev tip buttons
	} else if (nextPrevHover > 0) {

		// If the prev tip button
		if (nextPrevHover == 1){
			tipInd -= 1;
			if (tipInd < 0){
				tipInd = tips.length-1;
			}

		// If the next tip button
		} else if (nextPrevHover == 2){
			tipInd += 1;
			if (tipInd >= tips.length){
				tipInd = 0;
			}
		}
	
	// If not hovering over anything
	} else {

		// Stop selecting things
		selectionArray = [];
		loadOpen = false;
		
		// Double click
		if ((currentTime - lastClickTime) < doubleClickMilli){

			// The user is now selecting
			selected = -6;
			selectStartX = e.clientX;
			selectStartY = e.clientY;
			selectEndX = e.clientX;
			selectEndY = e.clientY;

		// Single click
		} else if (!helpOpen) {

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
	var qasmString = "";

	// Figure out which functions need defining 
	var gatesNeeded = [];

	// Add text objects with position info 
	for (var i=gateOptions; i<gates.length; i++){
		if (gates[i]["letter"].substring(0,4) == "text"){
			qasmString += "// " + gates[i]["x"] + " " + gates[i]["y"] + " " + gates[i]["letter"].substr(4) + "\n";
		}
	}

	// For each section
	for (var k=0; k<lineStartEnds.length; k++){

		var qasmSubstring = "";

		// Is this section a function definition?
		var isFunc = (lineStartEnds[k][4] != -1);

		// Determine how many qubits are needed for the main circuit
		var minQubit = 9999;
		var maxQubit = -9999;
		var minPos = 9999;
		var maxPos = -9999;
		var validGates = []
		for (var i=gateOptions; i<gates.length; i++){

			// Ignore subroutine definition gates and invalid gates
			if (gates[i]["letter"] != "sub" && gates[i]["rec"] != true){

				// See if this gate is part of the circuit
				if (gates[i]["x"] >= lineStartEnds[k][0] && gates[i]["x"] <= lineStartEnds[k][1] && gates[i]["y"] >= lineStartEnds[k][2] && gates[i]["y"] <= lineStartEnds[k][3]){
					validGates.push(gates[i]);

					// Determine min/maxes
					if (gates[i]["y"] < minQubit){
						minQubit = gates[i]["y"];
					}
					if (gates[i]["y"]+gates[i]["size"]-1 > maxQubit){
						maxQubit = gates[i]["y"]+gates[i]["size"]-1;
					}
					if (gates[i]["x"] > maxPos){
						maxPos = gates[i]["x"];
					}
					if (gates[i]["x"] < minPos){
						minPos = gates[i]["x"];
					}

				}

			}

		}

		// Add the bit specifying a gate
		if (isFunc){
			qasmSubstring += "gate f" + lineStartEnds[k][4] + " ";
			qasmSubstring += "q0";
			for (var i=1; i<1+maxQubit-minQubit; i++){
				qasmSubstring += "," + "q" + i;
			}
			qasmSubstring += " // " + (lineStartEnds[k][0]-1) + " " + (lineStartEnds[k][2]-1);
			qasmSubstring += "\n{\n";

		// Or just a register if not a function 
		} else {
			qasmSubstring += "qubit q[" + (1+maxQubit-minQubit) + "];";
			qasmSubstring += " // " + minPos + " " + minQubit;
			qasmSubstring += "\n";
		}

		// Keep track of what the latest position for each qubit is
		var latestX = [];
		for (var i=0; i<1+maxQubit-minQubit; i++){
			latestX.push(0);
		}

		// Create a copy of the array
		var copy = validGates.slice();

		// Sort the list, leftmost gates first
		copy.sort(function(a, b){return a["x"] - b["x"];});

		// Loop over this sorted list
		for (var i=0; i<copy.length; i++){

			// Get info about this gate
			var xPos = copy[i]["x"]-minPos+1;
			var qubit = copy[i]["y"]-minQubit;
			var letter = copy[i]["letter"].toLowerCase();
			var controls = copy[i]["attached"];
			var numControls = controls.length;

			// Function calls need their id too
			if (letter == "fun"){
				letter = "f" + copy[i]["funID"];
			}

			// Don't add controls directly
			if (letter != "controlfilled" && letter != "controlunfilled"){

				// Without controls
				if (numControls == 0){

					// Determine whether there's any free space behind it 
					var numIdenNeeded = xPos-latestX[qubit]-1;
					for (var j=qubit; j<qubit+copy[i]["size"]; j++){
						if (xPos-latestX[j]-1 < numIdenNeeded){
							numIdenNeeded = xPos-latestX[j]-1;
						}
					}

					// Add identities if there's free space 
					for (var j=0; j<numIdenNeeded; j++){
						qasmSubstring += "i q[" + qubit + "];\n";
					}

					// Add the targets
					qasmSubstring += letter + " ";
					for (var j=qubit; j<qubit+copy[i]["size"]; j++){
						if (j != qubit){
							qasmSubstring += ",";
						}
						if (isFunc){
							qasmSubstring += "q" + j;
						} else {
							qasmSubstring += "q[" + j + "]";
						}
					}
					
					// Finish this section
					qasmSubstring += ";\n";

					// Update the offset between the min and max
					minGateQubit = qubit;
					maxGateQubit = qubit+copy[i]["size"]-1;
					for (var j=minGateQubit; j<maxGateQubit+1; j++){
						latestX[j] = xPos;
					}

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
					maxGateQubit = qubit+copy[i]["size"]-1;
					for (var j=0; j<numControls; j++){
						controlQubit = copy[controlIndices[j]]["y"]-minQubit;
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
						if (isFunc){
							qasmSubstring += "i q" + closestIndex + ";\n";
						} else {
							qasmSubstring += "i q[" + closestIndex + "];\n";
						}
					}

					// Add the ccc...ch
					var gateName = "";
					for (var j=0; j<numControls; j++){
						controlIndex = controlIndices[j];
						type = copy[controlIndex]["letter"];
						if (type == "controlFilled"){
							qasmSubstring += "c";
							gateName += "c";
						} else {
							qasmSubstring += "o";
							gateName += "o";
						}
					}

					// Add the main gate and see if this has already been used
					qasmSubstring += letter + " ";
					gateName += letter;
					if (gatesNeeded.indexOf(gateName) < 0){
						gatesNeeded.push(gateName);
					}

					// Add the controls q[1], q[2] etc.
					for (var j=0; j<numControls; j++){
						controlIndex = controlIndices[j];
						controlQubit = copy[controlIndex]["y"]-minQubit;
						if (isFunc){
							qasmSubstring += "q" + controlQubit + ",";
						} else {
							qasmSubstring += "q[" + controlQubit + "],";
						}
						latestX[controlQubit] = xPos;
					}

					// Add the target
					for (var j=qubit; j<qubit+copy[i]["size"]; j++){
						if (j != qubit){
							qasmSubstring += ",";
						}
						if (isFunc){
							qasmSubstring += "q" + j;
						} else {
							qasmSubstring += "q[" + j + "]";
						}
					}

					// Finish this section
					qasmSubstring += ";\n";

					// Update the offset between the min and max
					for (var j=minGateQubit; j<maxGateQubit+1; j++){
						latestX[j] = xPos;
					}

				}

			}

		}

		// Add the bit stopping the gate definition
		if (isFunc){
			qasmSubstring += "}\n";
		} 

		// Add this section to the top if it's a function
		if (isFunc){
			qasmString = qasmSubstring + qasmString;

		// Or to the bottom if it isn't
		} else {
			qasmString = qasmString + qasmSubstring;
		}

	}

	// Add any functions needed 
	console.log("Extra gate definitions needed:", gatesNeeded);

	// Add the QASM requirements
	qasmString = "OPENQASM 3.0;\n" + qasmString;

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

		// Hide the load window
		loadOpen = false;
		openHover = false;

		// Load the QASM 
		fromQASM(text);

		// Re-sim and redraw (twice just to ensure consistent functions)
		circuitUpdated = false;
		redraw();
		circuitUpdated = true;
		redraw();

	};

	// Trigger this event
	reader.readAsText(input.files[0]);

}

// Load the gates from a QASM string
function fromQASM(qasmString){

	// Split into the different lines
	var lines = qasmString.split("\n");

	// Things to figure out
	var numQubitsRequired = 0;
	var regToQubit = {};
	var regSizes = {};
	var latestX = [];
	var currentFunc = -1;
	var funIDtoOG = {};
	var gateOffsetX = 0;
	var gateOffsetYMin = 0;
	var gateOffsetYMax = 0;

	// Reset things
	gates = gatesInit.slice();
	nextID = 0;
	nextFunctionID = 0;

	// Split the lines into different sections 
	var sectionStartEnds = [];
	var startedAt = -1;
	var currentType = -1;
	for (var i=1; i<lines.length; i++){
		
		// If it's a comment, split without replacing commas
		if (lines[i].substr(0,2) == "//"){
			var words = lines[i].replace(/\s+/g," ").split(" ");

		// Split into components
		} else {
			var words = lines[i].replace(/;/g,"").replace(/,/g," ").replace(/\s+/g," ").split(" ");
		}

		// Load comments as text objects 
		if (words[0] == "//" && words.length >= 4){

			// Extract the info
			var xPos = parseInt(words[1]);
			var yPos = parseInt(words[2]);
			var text = words.slice(3,words.length).join(" ");
			ctx.font = "35px Arial";
			var textWidth = ctx.measureText(text).width;

			// Ensure it's valid
			if (!isNaN(xPos) && !isNaN(yPos) && text.length > 0){

				// Add the gate object
				gates.push({"id": nextID, "letter": "text"+text, "x": xPos, "y": yPos, "size": Math.max(1,Math.round(textWidth/gridX)), "draggable": true, "attached":[]})
				nextID += 1;

			}

		// When reaching the main section
		} else if (words[0] == "qubit" || words[0] == "qreg"){

			// If in something before, push it
			if (startedAt >= 0){
				sectionStartEnds.push([startedAt, i-1, currentType]);
			}

			// Now in the main section
			startedAt = i;
			currentType = -1;

		// When reaching a function
		} else if (words[0] == "gate" && words[1][0] == "f"){

			// If in something before, push it
			if (startedAt >= 0){
				sectionStartEnds.push([startedAt, i-1, currentType]);
			}

			// Now in a function
			startedAt = i;
			currentType = parseInt(words[1].substr(1));

		}

	}
	
	// If in something at the end, push it
	if (startedAt >= 0){
		sectionStartEnds.push([startedAt, i-1, currentType]);
	}

	// Sort this so the main section goes first
	sectionStartEnds.sort(function(a, b){return a[2] - b[2];});

	// For each of these sections
	for (var n=0; n<sectionStartEnds.length; n++){

		// Iterate over the lines within this section
		for (var i=sectionStartEnds[n][0]; i<sectionStartEnds[n][1]+1; i++){

			// Ignore any blank lines
			if (lines[i].length > 0){

				// Ignore comments
				if (lines[i][0] != "/" && lines[i] != "include" && lines[i] != "{"){

					// Split into components
					var words = lines[i].replace(/;/g,"").replace(/,/g," ").replace(/\s+/g," ").split(" ");
					
					// If position stated explicitly 
					var explicitPosition = false;
					var explicitX = 0;
					var explicitY = 0;
					var startOfComment = words.indexOf("//");
					if (startOfComment >= 0){

						// Extract the explicitly given positions
						explicitX = parseInt(words[startOfComment+1]);
						explicitY = parseInt(words[startOfComment+2]);

						// If valid
						if (!isNaN(explicitX) && !isNaN(explicitY)){
							explicitPosition = true;
						}

						// Remove this to make other processing easier
						words = words.slice(0, startOfComment);

					}

					// If it's specifying qubit registers 
					if (words[0] == "qubit" || words[0] == "qreg"){

						// Determine how many qubits are in this register
						var startInd = words[1].indexOf("[");
						var endInd = words[1].indexOf("]");
						var num = parseInt(words[1].substring(startInd+1, endInd));
						var name = words[1].substring(0, startInd);

						// Update the various offsets 
						numQubitsRequired += num;
						regSizes[name] = num;
						gateOffsetYMin = gateOffsetYMax + 2;
						gateOffsetYMax = gateOffsetYMin + num;

						// If being forced somewhere 
						if (explicitPosition){

							// Add to mapping
							regToQubit[name] = explicitY;
							for (var k=0; k<num; k++){
								regToQubit[name+"["+k+"]"] = explicitY + k;
							}

							// Ensure the x-offset array is big enough
							while (latestX.length < explicitY+num){
								latestX.push(0);
							}
							for (var k=explicitY; k<explicitY+num; k++){
								latestX[k] = explicitX;
							}

						// If using the automated placement
						} else {

							// Add to mapping
							regToQubit[name] = gateOffsetYMin;
							for (var k=0; k<num; k++){
								regToQubit[name+"["+k+"]"] = gateOffsetYMin + k;
							}

							// Ensure the x-offset array is big enough
							while (latestX.length < gateOffsetYMax){
								latestX.push(0);
							}

						}

					// If defining a new gate (function)
					} else if (words[0] == "gate" && words[1][0] == "f"){

						// Get the function id
						funcInd = parseInt(words[1].substr(1));
						currentFunc = funcInd;
						funcSize = words.length - 2;
						funIDtoOG[funcInd] = nextID;

						// Update the overall next function ID
						if (funcInd >= nextFunctionID){
							nextFunctionID = funcInd + 1;
						}

						// If being forced somewhere 
						if (explicitPosition){

							// Keep track of where each function starts
							gateOffsetYMin = explicitY;
							gateOffsetYMax = explicitY + funcSize + 1;

							// Add to the reg->qubit mapping, but this time it's q0 -> 0 not q[0] -> 0
							for (var k=2; k<2+funcSize; k++){
								regToQubit[words[k]] = explicitY + k - 1;
							}

							// Ensure the x-offset array is big enough
							while (latestX.length < explicitY+funcSize+1){
								latestX.push(0);
							}
							for (var k=explicitY; k<explicitY+funcSize+1; k++){
								latestX[k] = explicitX+2;
							}

							gates.push({"id": nextID, "size": 1, "letter": "sub", "x": explicitX, "y": explicitY, "draggable": true, "og": -1, "attached": [], "funID": funcInd})
							nextID += 1

						} else {

							// Keep track of where each function starts
							gateOffsetYMin = gateOffsetYMax + 2;
							gateOffsetYMax = gateOffsetYMin + funcSize + 1;

							// Add to the reg->qubit mapping, but this time it's q0 -> 0 not q[0] -> 0
							for (var k=2; k<2+funcSize; k++){
								regToQubit[words[k]] = gateOffsetYMin + k - 1;
							}

							// Ensure the x-offset array is big enough
							while (latestX.length < gateOffsetYMax){
								latestX.push(0);
							}

							// Add the gate
							gates.push({"id": nextID, "size": 1, "letter": "sub", "x": -2, "y": gateOffsetYMin, "draggable": true, "og": -1, "attached": [], "funID": funcInd})
							nextID += 1

						}

					// If leaving a gate definition
					} else if (words[0] == "}"){
						currentFunc = -1;

					// If an identity
					} else if (words[0] == "i"){

						// Just increase the spacing there
						target = regToQubit[words[words.length-1]];
						latestX[target] += 1;

					// If specifying a standard gate operation 
					} else {

						// If given specific registers 
						if (lines[i].indexOf("[") >= 0 || sectionStartEnds[n][2] >= 0){

							// Determine gate info
							var numControls = words[0].split("o").length + words[0].split("c").length - 2;
							if (currentFunc == -1){
								var target = regToQubit[words[1+numControls]];
							} else {
								var target = 1+gateOffsetYMin + parseInt(words[1+numControls].substr(1));
							}
							var letter = words[0].substring(numControls, words[0].length);

							// Standard gate names should be uppercase for display
							if (["x", "y", "z", "s", "t", "h"].indexOf(letter) >= 0){
								letter = letter.toUpperCase();
							}

							// Determine control info
							var controls = []
							var controlTypes = [];
							var controlIDs = [];
							var latestPos = latestX[target];
							for (var j=1; j<1+numControls; j++){
								var con = regToQubit[words[j]];
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
							var gateSize = words.length - 1 - numControls;
							var minQubit = target;
							var maxQubit = target + gateSize - 1;
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
							var targetID = nextID;
							if (letter[0] == "f"){
								funcInd = parseInt(letter.substr(1));
								gates.push({"id": targetID, "size": 1, "letter": "fun", "x": latestPos, "y": target, "draggable": true, "og": -1, "funID": funcInd, "attached": controlIDs})
							} else {
								gates.push({"id": targetID, "size": 1, "letter": letter, "x": latestPos, "y": target, "draggable": true, "og": -1, "attached": controlIDs})
							}
							nextID += 1
							
							// Add the controls
							for (var j=0; j<numControls; j++){
								gates.push({"id": controlIDs[j], "letter": controlTypes[j], "x": latestPos, "y": controls[j], "size": 1, "draggable": true, "og": targetID, "attached": []})
							}

							// Update the latestX for all those qubits
							for (j=minQubit; j<maxQubit+1; j++){
								latestX[j] = latestPos+1;
							}

						// If given a whole register 
						} else {

							var targetReg = words[1];
							var regStart = regToQubit[targetReg];
							var regSize = regSizes[targetReg];
							var letter = words[0];

							// Standard gate names should be uppercase for display
							if (["x", "y", "z", "s", "t", "h"].indexOf(letter) >= 0){
								letter = letter.toUpperCase();
							}

							// Determine the min and max qubits this gate affects
							var minQubit = regStart;
							var maxQubit = regStart + regSize - 1;

							// For each qubit that needs a gate
							for (j=minQubit; j<maxQubit+1; j++){
								latestPos = latestX[j];

								// Add the gate 
								if (letter[0] == "f"){
									funcInd = parseInt(letter.substr(1));
									gates.push({"id": nextID, "size": 1, "letter": "fun", "x": latestPos, "y": j, "draggable": true, "og": -1, "funID": funcInd, "attached": []})
								} else {
									gates.push({"id": nextID, "size": 1, "letter": letter, "x": latestPos, "y": j, "draggable": true, "og": -1, "attached": []})
								}
								nextID += 1
								
								// Update the latestX for all those qubits
								latestX[j] = latestPos+1;

							}

						}

					}
					
				}

			}

		}

	}

	// Ensure all functions have their og set
	for (var i=0; i<gates.length; i++){
		if (gates[i]["letter"] == "fun" && gates[i]["og"] == -1){
			gates[i]["og"] = funIDtoOG[gates[i]["funID"]];
		}
	}

	// Recenter the camera
	var minX = 9999;
	var maxX = -9999;
	var minY = 9999;
	var maxY = -9999;
	for (var i=gateOptions; i<gates.length; i++){
		if (gates[i]["x"] < minX){
			minX = gates[i]["x"];
		}
		if (gates[i]["letter"].substr(0,4) == "text"){
			if (gates[i]["x"]+gates[i]["size"] > maxX){
				maxX = gates[i]["x"]+gates[i]["size"];
			}
		} else {
			if (gates[i]["x"] > maxX){
				maxX = gates[i]["x"];
			}
		}
		if (gates[i]["y"] < minY){
			minY = gates[i]["y"];
		}
		if (gates[i]["y"] > maxY){
			maxY = gates[i]["y"];
		}
	}
	offsetX = Math.max(3*gridXFixed-minX*gridX, window.innerWidth / 2 - (maxX-minX+1)*gridX / 2 - (minX+1)*gridX);
	offsetY = Math.max(2*gridYFixed-minY*gridY, window.innerHeight / 2 - (maxY-minY+1)*gridY / 2 - (minY+1)*gridY);
	console.log(offsetX, minX, maxX, gridXFixed, gridX);
	console.log(offsetY, minY, maxY, gridYFixed, gridY);

}

// Triggered when the scroll wheel is moved
function mouseWheel(e){

	// If scrolling up 
	if (e.deltaY < 0){

		// Figure out the zoom point before scaling
		var xs = (e.clientX - offsetX) / (gridX / gridXFixed);
		var ys = (e.clientY - offsetY) / (gridY / gridYFixed);

		// Expand the dimensions to zoom in
		var zoomIn = 1.0 + zoomSpeed;
		gridY *= zoomIn;
		gridX *= zoomIn;
		gateSize *= zoomIn;
		fontSize *= zoomIn;

		// Update now the scale has changed
		offsetX = e.clientX - xs * (gridX / gridXFixed);
		offsetY = e.clientY - ys * (gridY / gridYFixed);
	
	// If scrolling down
	} else {

		// Figure out the zoom point before scaling
		var xs = (e.clientX - offsetX) / (gridX / gridXFixed);
		var ys = (e.clientY - offsetY) / (gridY / gridYFixed);

		// Contract the dimensions to zoom ou
		var zoomOut = 1.0 - zoomSpeed;
		gridY *= zoomOut;
		gridX *= zoomOut;
		gateSize *= zoomOut;
		fontSize *= zoomOut;

		// Update now the scale has changed
		offsetX = e.clientX - xs * (gridX / gridXFixed);
		offsetY = e.clientY - ys * (gridY / gridYFixed);
	
	}

	// Redraw everything now the sizes have changed
	redraw();

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

// Convert touch -> mouse, from https://stackoverflow.com/questions/1517924/javascript-mapping-touch-events-to-mouse-events
function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";

    switch(event.type)
    {
        case "touchstart":  type = "mousedown"; break;
        case "touchmove":   type = "mousemove"; break;
        case "touchend":    type = "mouseup";   break;
        case "touchcancel": type = "mouseup";   break;
        default:           return;
    }

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
                                  first.screenX, first.screenY,
                                  first.clientX, first.clientY, false,
                                  false, false, false, 0, null);

    first.target.dispatchEvent(simulatedEvent);
	event.preventDefault();

}
