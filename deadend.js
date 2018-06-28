(function(){
	const HEIGHT = 600;
	const WIDTH = 600;
	var location = 1; //current location (outside/inside)
	var power = false;
	var img;
	var imgs;
	var screen;
	var newimg;
	var clear = false; //whether not to listen to user input
	var frame = 0;

	//frame relation data:	
	const json = 
{ 	frames: [
		{//0
			forward: 1
		},{//1
			left: 7, right: 3, forward: 15
		},{//2s
			left: 7, right: 3, forward: 15
		},{//3
			left: 1, right: 4,
			boxes: [
				{	pos: [.1*WIDTH, .25*HEIGHT, .5*WIDTH, .65*HEIGHT],
					cursor: "forward",
					action: "frame = 8; playGif(\"sidepath1\", 9, 350, \"sidepath\", 0);"
				}
			]
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
				{	pos: [.04*WIDTH, .5*HEIGHT, .25*WIDTH, .75*HEIGHT],
					cursor: "zoom",
					action: function(){frame = 14;}	
				}
			]
		},{//12
			left: 10, right: 8, back: 11,
		},{//13
		},{
			left: 10, right: 8, back: 11,
			boxes: [
				{	if: "!power", 
					pos: [.4*WIDTH, .5*HEIGHT, .15*WIDTH, .15*HEIGHT],
					cursor: "interact",
					action: "power = true;"	
				},
				{	if: "power",
					img: "x12",
					action: "frame=999;"
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
	],
	presetBoxes: {
		left:	{
			pos: [0*WIDTH, .2*HEIGHT, .2*WIDTH, .6*HEIGHT],
			cursor: "left",
			action: function(frame){transition(frame, "left")}},
		right: {
			pos: [.8*WIDTH, .2*HEIGHT, .2*WIDTH, .6*HEIGHT],
			cursor: "right",
			action: function(frame){transition(frame, "right")}},
		forward: {
			pos: [.25*WIDTH, .25*HEIGHT, .5*WIDTH, .5*HEIGHT],
			cursor: "forward",
			action: function(frame){transition(frame, "fade")}},
		back: {
			pos: [0*WIDTH, .8*HEIGHT, 1*WIDTH, .2*HEIGHT],
			cursor: "back",
			action: function(frame){transition(frame, "fade");}
		}
	}
}
	
//******************************************
//*****************MODEL********************
//******************************************

	window.onload = function(){
		img = getById("img");
		imgs = getById("imgs");
		screen = getById("screen");
		imgs.style.left = "0px";
		getById("current").style.opacity = 1.0;
		importImages();
		updateBoxes(frame);
		clear = true;
		var rain = new Audio('audio/outsiderain.mp3');
		//rain.play();
		rain.loop = true;
		rain.volume = .5;
	};

	function importImages(){
		for (var i = 0; i < 27; i++) {
			var preload = new Image();
			preload.src = "der/DER100" + correctFrame(i) + ".jpeg";
			getById("preloads").appendChild(preload);
		}
	}


//******************************************
//*****************VIEW********************
//******************************************



	function playGif(name, frames, delay, audio, audioDelay){
		var gif = getById("fullGif");
		gif.src = "movies/" + name + ".gif" + "?a="+Math.random();
		gif.style.visibility = "visible"
		getById("movies").appendChild(gif);
		setTimeout(function(){
			gif.style.visibility = "hidden";
		}, frames*delay);
		setTimeout(function(){
			var sound = new Audio("audio/"+audio+".mp3");
			sound.volume = .5;
			sound.play();
		}, audioDelay);
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
	function updateBoxes(frame) {
		getById("setBoxes").innerHTML = "";
		getById("customBoxes").innerHTML = "";
		var frameData = json.frames[frame];
		console.log(frame);		//gets the frame data for the current frame
		if (frameData.left != null) {
			console.log("Left");
			makeBox(json.presetBoxes.left, frameData.left);
		}
		if (frameData.right != null) {
			makeBox(json.presetBoxes.right, frameData.right);
		}
		if (frameData.forward != null) {
			makeBox(json.presetBoxes.forward, frameData.forward);
		}
		if (frameData.back != null) {
			makeBox(json.presetBoxes.back, frameData.back);
		}
		if (frameData.boxes != null){			//creates custom boxes
			for (var i = 0; i < frameData.boxes.length; i++) {
				if (frameData.boxes[i].if == null || eval(frameData.boxes[i].if)){	//the "if" property is used for conditional boxes
					if (frameData.boxes[i].action != null){
						makeBox(frameData.boxes[i], new Function(frameData.boxes[i].action));
					} else {
						makeBox(frameData.boxes[i], null);
					}
				}
			}
		}
	}

	
	function makeBox(info, param) {
		
		var box = document.createElement("div");
		box.className = "box";
		//box.setAttribute("name", action);

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

		box.onclick = 
			function(){
				boxClick(function(){
					info.action(param)
				});
			};
				
		getById("customBoxes").appendChild(box);
	}


//******************************************
//*****************CONTROLLER***************
//******************************************
	
	
	function transition(frame, type){	
		frame = correctFrame(frame);	//changes frame based on if power is on, or something like that
		console.log(frame);
		updateBoxes(frame);
		var topBox = document.createElement("div"); //top box covers everything to dictate cursor
		topBox.id = "topBox";
		getById("screen").appendChild(topBox);
			
		newimg = document.createElement("img");
		newimg.id = "newimg";
		newimg.src = "der/DER100" + frame + ".jpeg";
		
		if (type === "left"){
			newimg.style.left = "-"+WIDTH+"px";
		} else if (type === "right") {
			newimg.style.left = WIDTH+"px";
		}
		img.classList.add(type+"Out");
		newimg.classList.add(type+"In");
		
		getById("new").appendChild(newimg);
		setTimeout(function (){
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
	}, 475);
	}


	function boxClick(action){
		console.log("boxClick");
		if (clear) {
			clear = false;
			(action)();
			
			//tr(1,"forward");
			//action(); //sets the new frame.
			clear = true;
		}
	}

//******************************************
//*****************OTHER********************
//******************************************


	function getById(id) {
		return document.getElementById(id);
	}


})();