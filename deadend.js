(function(){
	var BOX_WIDTH = 600;
	var power = false;
	var img;
	var imgs;
	var screen;
	var newimg;
	var clear = false; //whether not to listen to user input
	var frame = 0;

	//frame relation data:
	var json = 
{frames: [
		{//0
			forward: 1
		},{//1
			left: 7, right: 3, forward: 15
		},{//2
			left: 7, right: 3, forward: 15
		},{//3
			left: 1, right: 4, forward: 8.1
		},{//4
			left: 3, right: 5
		},{//5
			left: 4, right: 6
		},{//6
			left: 5, right: 7,
		},{//7
			left: 6, right: 1,
		},{//8
			left: 11, right: 9,
		},{//9
			left: 8, right: 10,
		},{//10
			left: 9, right: 11, forward: 6
		},{//11
			left: 10, right: 8,
			boxes: [
				{	pos: [25, 300, 150, 450],
					cursor: "z",
					action: "frame = 14;"	
				}
			]
		},{//12
			left: 10, right: 8, back: 11,
		},{//13
		},{
			left: 10, right: 8, back: 11,
			boxes: [
				{	if: "!power", 
					pos: [250, 300, 100, 100],
					cursor: "m",
					action: "power = true;"	
				},
				{	if: "power", 
					img: "x12",
					action: ""
				}
			]
		},{//15
			left: 23, right: 20
		},{//16
			left: 23, right: 20
		},{//17
			left: 16, right: 18, forward: 13
		},{//18
			left: 17, right: 19
		},{//19
			left: 18, right: 16
		},{//20
			left: 15, right: 22
		},{//21
			left: 15, right: 22
		},{//22
			left: 20, right: 23, forward: 5
		},{//23
			left: 22, right: 15
		},{//24
			left: 22, right: 15
		}
	]
}

	window.onload = function(){
		img = getById("img");
		imgs = getById("imgs");
		screen = getById("screen");
		imgs.style.left = "0px";
		getById("current").style.opacity = 1.0;
		importImages();
		updateBoxes();
		clear = true;
	};

	function importImages(){
		for (var i = 0; i < 27; i++) {
			var preload = new Image();
			preload.src = "der/DER100" + correctFrame(i) + ".jpeg";
			getById("preloads").appendChild(preload);
		}
	}

	function boxClick(){
		if (clear) {
			clear = false;
			var topBox = document.createElement("div"); //top box covers everything to dictate cursor
			topBox.id = "topBox";
			getById("screen").appendChild(topBox);
		
			eval(this.getAttribute("name")); //sets the new frame. very insecure- maybe include array of actions? or create virtual box on server with all properties
			frame = correctFrame(frame);	//changes frame based on if power is on, or something like that

			newimg = document.createElement("img");
			newimg.id = "newimg";
			newimg.src = "der/DER100" + frame + ".jpeg";
			
			if (this.id == "leftBox" || this.id == "rightBox") {
				if (this.id === "leftBox"){
					newimg.style.left = "-600px";
					img.classList.add("leftOut");
					newimg.classList.add("leftIn");
				} else {
					newimg.style.left = "600px";
					img.classList.add("rightOut");
					newimg.classList.add("rightIn");
				}
				getById("new").appendChild(newimg);
				setTimeout(endStep, 500);
			} else {
				getById("new").appendChild(newimg);
				img.classList.add("fadeOut");
				newimg.classList.add("fadeIn");
				setTimeout(endStep, 500);
			}
			//debugger;
			updateBoxes();
		}
	}

	//for a given frame, this corrects it based on scene variables (such as power being on)
	function correctFrame(currentFrame){
		if (power){
			var powerFrames = [1, 15, 20, 23];
			for (var i = 0; i < powerFrames.length; i++){
				if (currentFrame == powerFrames[i]){
					return(currentFrame + 1);
				}
			}
		}
		return(currentFrame);
	}

	

	//clears and updates the clickable boxes, based on the current frame
	function updateBoxes() {
		getById("setBoxes").innerHTML = "";
		getById("customBoxes").innerHTML = "";
		var frameData = json.frames[frame];							//gets the frame data for the current frame
		if (frameData.left != null) {		
			makeBox("left", frameData.left);
		}
		if (frameData.right != null) {
			makeBox("right", frameData.right);
		}
		if (frameData.forward != null) {
			makeBox("forward", frameData.forward);
		}
		if (frameData.back != null) {
			makeBox("back", frameData.back);
		}
		if (frameData.boxes != null){			//creates custom boxes
			for (var i = 0; i < frameData.boxes.length; i++) {
				if (frameData.boxes[i].if == null || eval(frameData.boxes[i].if)){			//the "if" property is used for conditional boxes
					if (frameData.boxes[i].action != null){
						makeBox(frameData.boxes[i], frameData.boxes[i].action);
					} else {
						makeBox(frameData.boxes[i], null);
					}
				}
			}
		}
	}

	//makes either a custom box, or a "preset" box (such as a left or right box).
	//info is either the type of preset ("left", "right", etc.) or a JSON object with box data
	//action is the action taken when the box is clicked.
	function makeBox(info, action) {
		var box = document.createElement("div");
		box.className = "box";
		box.onclick = boxClick;

		if (typeof info === "string") {									//preset boxes
			box.id = info + "Box";
			box.classList.add(info + "Cursor");
			box.setAttribute("name", "frame = " + action + ";");
			getById("setBoxes").appendChild(box);
		} else {																	//custom boxes
			box.setAttribute("name", action);
			if (info.pos != null) {
				box.style.left = info.pos[0] + "px";
				box.style.top = info.pos[1] + "px";
				box.style.width = info.pos[2] + "px";
				box.style.height = info.pos[3] + "px";
			}
			if (info.cursor != null) {
				box.classList.add(info.cursor + "Cursor");
			}
			if (info.img != null) {											//pic boxes
				var pic = document.createElement("img");
				pic.classList.add("pBox");
				pic.src = "der/DER100" + info.img + ".jpeg";
				getById("new").appendChild(pic);
			}
			getById("customBoxes").appendChild(box);
		}
	}

	function getById(id) {
		return document.getElementById(id);
	}

	function endStep(){
			img.classList.remove("rightOut");
			newimg.classList.remove("rightIn");
			img.classList.remove("leftOut");
			newimg.classList.remove("leftIn");
			img.classList.remove("fadeOut");
			newimg.classList.remove("fadeIn");

			imgs.removeChild(getById("current"))
			getById("new").id = "current";
			getById("current").style.opacity = 1.0;
			img = newimg;
			img.id = "img";
			imgs.style.left = "0px";
			img.style.left = "0px";
			var newDiv = document.createElement("div");
			newDiv.id = "new";
			imgs.appendChild(newDiv);
			getById("screen").removeChild(topBox);
			clear = true;
	}
})();