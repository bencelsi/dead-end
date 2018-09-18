(function() {
	"use strict";
	const FRAME_PATH = "assets/frames/DER100"
	const GIF_PATH = "assets/gifs/"
	const OTHER_PATH = "assets/other/"
	const AUDIO_PATH = "assets/audio/"
	const BOX_PATH = "assets/boxES/"

	const HEIGHT = 750;
	const WIDTH = 750;
	const SIDE_SPEED = 400;
	const FADE_SPEED = 1000;

	var power = false;
	var processes = 0; //whether not to listen to user input
	var startFrame = 0;
	var frame = 0;
	var key = 0;
	var lever = 0;

	window.onload = function() {
		initModel();
		initController();
		initView();
	};


//TODO: separate frame data from box data... may solve a lot.
const json = 
{ 	frames: {
		0: {//0
			forward: 1
		},1:{//1
			left: 7, right: 3, forward: 15
		},2:{//2
			left: 7, right: 3, forward: 16
		},3:{//3
			left: ()=>power?2:1, right: 4,
			boxes: [
				{	pos: [.1, .25, .5, .65],
					cursor: "forward",
					addListeners: function(box) {
						box.onclick = ()=>{
							transition(8, "fade");
							playGif("sidepath1", 9, 350);
							playSound("sidepath", 0, false);
						};
					}
				}
			]
		},4:{//4
			left: 3, right: 5
		},5:{//5
			left: 4, right: 6
		},6:{//6
			left: 5, right: 7,
		},7:{//7
			left: 6, right: ()=>power?2:1,
		},8:{//8
			left: 11, right: 9,
		},9:{//9
			left: 8, right: 10,
		},10:{//10
			left: 9, right: 11, forward: 6
		},11:{//11
			left: 10, right: 8,
			boxes: [
				{	pos: [.04, .5, .25, .75],
					cursor: "zoom",
					addListeners: function(box) {
						box.onclick = ()=>transition(14, "fade");
					}	
				}
			]
		},12:{//12
			left: 10, right: 8, back: 11,
		},13:{//13
		},14:{
			left: 10, right: 8, back: 11,
			boxes: [
				{	condition: ()=>{return(!power);},
					pos: [.4, .5, .15, .15],
					cursor: "interact",
					addListeners: function(box) {
						box.onmousedown = ()=>{
							box.onmousemove = ()=>{
								console.log(box.onclick);
							}
						};box.onmouseup = ()=>{
							box.onmousemove = null;
						};
					}
				},
				{	condition: ()=>{return(power);},
					img: "x12",
				}
			]
		},15:{//15
			left: 23, right: 20
		},16:{//16
			left: 24, right: 21
		},17:{//17
			left: 16, right: 18, forward: 13
		},18:{//18
			left: 17, right: 19
		},19:{//19
			left: 18, right: 16
		},20:{//20
			left: 15, right: 22
		},21:{//21
			left: 16, right: 22
		},22:{//22
			left: ()=>power?21:20, right: ()=>power?24:23, forward: 5
		},23:{//23
			left: 22, right: 15
		},24:{//24
			left: 22, right: 16
		},100:{
			forward:101
		},101:{
			forward:102
		},102:{
			forward:103
		},103:{
			forward:104
		},104:{
			forward:105
		},105:{
			forward:0
		}
	},
	standardBoxes: {
		left: {
			pos: [0, .2, .2, .6],
			transition: "left",
			cursor: "left"
		},
		right: {
			pos: [.8, .2, .2, .6],
			transition: "right",
			cursor: "right"
		},
		forward: {
			pos: [.25, .25, .5, .5],
			transition: "fade",
			cursor: "forward"
		},
		back: {
			pos: [0, .8, 1, .2],
			transition: "fade",
			cursor: "back"
		}
	},
	sounds: {}
}

//MODEL DATA
const boxes = {
	standard: {
		left: {
			pos: [0, .2, .2, .6],
			transition: "left",
			cursor: "left"
		},
		right: {
			pos: [.8, .2, .2, .6],
			transition: "right",
			cursor: "right"
		},
		forward: {
			pos: [.25, .25, .5, .5],
			transition: "fade",
			cursor: "forward"
		},
		back: {
			pos: [0, .8, 1, .2],
			transition: "fade",
			cursor: "back"
		}
	},
	custom: {

	}
}

//******************************************
//*****************MODEL********************
//******************************************
	function initModel() {
		initSounds();
	}

	function initSounds() {
		var rain = playSound("outsiderain", 0, true);
		//var generator = playSound("reddit", .5, true);
		//json.sounds.rain = rain;
		//json.sounds.rain.volume = 0;
		rain.volume = .2;
		for (var i = 0; i < 999; i++) {
			//json.sounds.rain.volume += .001;
		}
	}

	function setVolume(n, volume, speed) {
		//	json.sounds.n.volume = volume;
	}



//******************************************
//*****************CONTROLLER***************
//******************************************	
	function initController() {

	}

	//processess and updates boxes, based on the given frame
	function updateBoxes(newFrame) {
		console.log(newFrame);
		clearBoxes();
		frame = newFrame;
		var frameData = json.frames[frame];
		if (frameData.boxes != null) {			//creates custom boxes
			for (var i = 0; i < frameData.boxes.length; i++) {
				makeCustomBox(frameData.boxes[i]);
			}
		}
		updateStandardBoxes(newFrame);
	}

	function updateBox(boxData) {
		clearBox(boxData.box)
	}


//******************************************
//*****************VIEW*********************
//******************************************
	function initView() {
		importImages();
		makeStandardBoxes();
		updateBoxes(startFrame);
		window.onclick = ()=>launchFullScreen(getById("window"));
	}

//STANDARD BOXES
	function makeStandardBoxes() {
		makeStandardBox(boxes.standard.left);
		makeStandardBox(boxes.standard.right);
		makeStandardBox(boxes.standard.forward);
		makeStandardBox(boxes.standard.back);
	} 
	function makeStandardBox(boxData) {
		var box = makeBox(boxData);
		getById("standardBoxes").appendChild(box);
	}
	function updateStandardBoxes(frame) {
		updateStandardBox(boxes.standard.left, json.frames[frame].left);
		updateStandardBox(boxes.standard.right, json.frames[frame].right);
		updateStandardBox(boxes.standard.forward, json.frames[frame].forward);
		updateStandardBox(boxes.standard.back, json.frames[frame].back);
	}
	function updateStandardBox(boxData, destinationFrame) {
		var element = boxData.element;
		if (destinationFrame == null) {
			element.style.visibility = "hidden";
		} else {
			element.style.visibility = "visible";
			element.onclick = ()=>{transition(simpleEval(destinationFrame), boxData.transition);};
		}
	}


//CUSTOM BOXES
	//returns a box element from a JSON object containing box info, or null if the box shouldn't exist
	function makeCustomBox(boxData) {
		if (boxData.condition == null || boxData.condition()) {
			var box = makeBox(boxData);
			if (boxData.img != null) {											//pic boxes
				var pic = document.createElement("img");
				pic.classList.add("picBox");
				pic.src = BOX_PATH + simpleEval(boxData.img) + ".png";
				getById("picBoxes").appendChild(pic);
			}
			if(boxData.addListeners != null) {
				boxData.addListeners(box);
			}

			getById("boxes").appendChild(box);
		}
	}
	function clearCustomBoxes() {
		var frameData = json.frames[frame];
		console.log(frame)
		if (frameData.boxes != null) {
			for (var i = 0; i < frameData.boxes.length; i++) {
				if (frameData.boxes[i].element != null) {
					clearBox(frameData.boxes[i].element);
				}
			}
		}
	}

	
//GENERIC BOXES
	function makeBox(boxData) {
		var box = document.createElement("div");
		box.className = "box";
		boxData.element = box;
		setBoxPos(boxData);
		setBoxCursor(boxData);
		return box;
	}
	function setBoxPos(boxData) {
		if (boxData.pos != null) {
			var element = boxData.element;
			element.style.left = boxData.pos[0] * WIDTH + "px";
			element.style.top = boxData.pos[1] * HEIGHT + "px";
			element.style.width = boxData.pos[2] * WIDTH + "px";
			element.style.height = boxData.pos[3] * HEIGHT + "px";
		}
	}
	function setBoxCursor(boxData) {
		var element = boxData.element;
		if (boxData.cursor != null) {
			element.classList.add(boxData.cursor + "Cursor");
		}
	}
	function clearBox(box) {
		box.remove();
	}
	
//TRANSITIONS
	//make a controller function for this?
	function transition(newFrame, type) {
		if (processes == 0) {
			processes++;

			var img = getById("img");
			var transitions = getById("transitions");
			updateBoxes(newFrame);
			if (type === "none") {
				img.src = FRAME_PATH + frame + ".png"
			} else {
				createTransition(type+"Out", 0);
				img.src = FRAME_PATH + frame + ".png"
				var x = 0;
				if (type === "left") {
					x = -WIDTH;
				} else if (type === "right") {
					x = WIDTH;
				}
				createTransition(type+"In", x); 
				img.style.visibility = "hidden";
				setTimeout(()=>{
					img.style.visibility = "visible";
				}, 100);

				if (type === "left" || type == "right") {
					setTimeout(()=>{
						transitions.innerHTML = "";
						processes--;
					}, SIDE_SPEED);
				} else {
					setTimeout(()=>{
						transitions.innerHTML = "";
						processes--;
					}, FADE_SPEED);
				}
			}
		}
	}
	function createTransition(type, x) {
		var transition = document.createElement("div");
		var img = document.createElement("img");
		var picBoxes = document.createElement("div");
		img.src = getById("img").src;
		img.classList.add("frame");
		picBoxes.innerHTML = getById("picBoxes").innerHTML;
		transition.appendChild(img);
		transition.appendChild(picBoxes);
		transition.classList.add("transition");
		transition.style.left = x+"px";
		transition.classList.add(type);
		getById("transitions").appendChild(transition);
	}

//OTHER
	//Plays the gif of the given name.  Takes the number of frames and the delay to calculate the time... (maybe make this automatic somehow?)
	function playGif(name, frames, delay) {
		processes++;	
		var gif = getById("fullGif");
		gif.src = GIF_PATH + name + ".gif" + "?a="+Math.random();
		gif.style.visibility = "visible"
		getById("movies").appendChild(gif);
		setTimeout(function() {
			gif.style.visibility = "hidden";
			processes--;
		}, frames*delay);	
	}

	function playSound(name, volume, loop) {
		var sound = new Audio(AUDIO_PATH + name + ".mp3");	
		sound.volume = 0;
		sound.play();
		return sound;
	}

	//launches full screen mode on the given element.
	function launchFullScreen(element) {
		if(element.requestFullScreen) {
		   element.requestFullScreen();
		} else if(element.mozRequestFullScreen) {
		   element.mozRequestFullScreen();
		} else if(element.webkitRequestFullScreen) {
		   element.webkitRequestFullScreen();
		}
	}

	function importImages() {
		for (var i = 0; i < 27; i++) {
			var preload = new Image();
			//preload.src = FRAME_PATH + i + ".png";
			getById("preloads").appendChild(preload);
		}
	}



//******************************************
//*****************HELPER*******************
//******************************************
	
	//returns the element with the given id
	function getById(id) {
		return document.getElementById(id);
	}

	//If x is a function, returns result of evaluating it, otherwise returns x
	function simpleEval(x) {
		if (x instanceof Function) {
			return (x)();
		} else {
			return x;
		}
	}

})();