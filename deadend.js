
(function(){
	"use strict";
	const HEIGHT = 750;
	const WIDTH = 750;
	const TRANSITION_SPEED = 400;
	var power = false;
	var processes = 0; //whether not to listen to user input
	var frame = 0;

	//frame relation data:	
	const json = 
{ 	frames: [
		{//0
			forward: 1
		},{//1
			left: 7, right: 3, forward: 15
		},{//2
			left: 7, right: 3, forward: 16
		},{//3
			left: ()=>power?2:1, right: 4,
			boxes: [
				{	pos: [.1*WIDTH, .25*HEIGHT, .5*WIDTH, .65*HEIGHT],
					cursor: "forward",
					action: ()=>{
						transition(8, "fade");
						playGif("sidepath1", 9, 350);
						playSound("sidepath", 0, false);
					}
				}
			]
		},{//4
			left: 3, right: 5
		},{//5
			left: 4, right: 6
		},{//6
			left: 5, right: 7,
		},{//7
			left: 6, right: ()=>power?2:1,
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
					action: ()=>transition(14, "fade")	
				}
			]
		},{//12
			left: 10, right: 8, back: 11,
		},{//13
		},{
			left: 10, right: 8, back: 11,
			boxes: [
				{	condition: ()=>{return(!power);},
					pos: [.4*WIDTH, .5*HEIGHT, .15*WIDTH, .15*HEIGHT],
					cursor: "interact",
					action: ()=>{power = true; updateBoxes(frame);}	
				},
				{	condition: ()=>{return(power);},
					img: "x12",
				}
			]
		},{//15
			left: 23, right: 20
		},{//16
			left: 24, right: 21
		},{//17
			left: 16, right: 18, forward: 13
		},{//18
			left: 17, right: 19
		},{//19
			left: 18, right: 16
		},{//20
			left: 15, right: 22
		},{//21
			left: 16, right: 22
		},{//22
			left: ()=>power?21:20, right: ()=>power?24:23, forward: 5
		},{//23
			left: 22, right: 15
		},{//24
			left: 22, right: 16
		}
	],
	boxes: {
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
	},
	sounds: {}
}

//******************************************
//*****************MODEL********************
//******************************************
	
	function initializeSounds(){
		var rain = playSound("outsiderain", 0, true);
		//var generator = playSound("reddit", .5, true);
		json.sounds.rain = rain;
		//json.sounds.rain.volume = 0;
		//rain.volume = 0;
		for (var i = 0; i < 999; i++) {
			json.sounds.rain.volume += .001;
		}
	}

	function setVolume(n, volume, speed){
		json.sounds.n.volume = volume;
	}

	window.onload = function(){
		
		importImages();
		updateBoxes(0);
		initializeSounds();
	};

	function importImages(){
		for (var i = 0; i < 27; i++) {
			var preload = new Image();
			preload.src = "der/DER100" + i + ".jpeg";
			getById("preloads").appendChild(preload);
		}
	}

//******************************************
//*****************VIEW*********************
//******************************************

	function playGif(name, frames, delay){
		processes++;
		var gif = getById("fullGif");
		gif.src = "movies/" + name + ".gif" + "?a="+Math.random();
		gif.style.visibility = "visible"
		getById("movies").appendChild(gif);
		setTimeout(function(){
			gif.style.visibility = "hidden";
			processes--;
		}, frames*delay);	
	}

	function playSound(name, volume, loop){
		var sound = new Audio("audio/"+name+".mp3");
		
		sound.volume = volume;
		sound.play();
		return sound;
	}
	

	//processess and updates the clickable boxes, based on the current frame
	function updateBoxes(newFrame) {
		frame = newFrame;
		console.log(frame);
		getById("boxes").innerHTML = "";
		getById("picBoxes").innerHTML = "";
		var frameData = json.frames[frame];
		if (frameData.left != null) {
			makeBox(json.boxes.left, simpleEval(frameData.left));
		}
		if (frameData.right != null) {
			makeBox(json.boxes.right, simpleEval(frameData.right));
		}
		if (frameData.forward != null) {
			makeBox(json.boxes.forward, simpleEval(frameData.forward));
		}
		if (frameData.back != null) {
			makeBox(json.boxes.back, simpleEval(frameData.back));
		}
		if (frameData.boxes != null){			//creates custom boxes
			for (var i = 0; i < frameData.boxes.length; i++) {
				if (frameData.boxes[i].condition == null || frameData.boxes[i].condition()){	//the "if" property is used for conditional boxes
					if (frameData.boxes[i].action != null){
						makeBox(frameData.boxes[i], frameData.boxes[i].action);
					} else {
						makeBox(frameData.boxes[i], null);
					}
				}
			}
		}
	}

	//takes box info, and a parameter for potential function action info
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
			pic.src = "der/DER100" + simpleEval(info.img) + ".png";
			getById("picBoxes").appendChild(pic);
		}

		box.onclick = 
			function(){
				boxClick(function(){
					info.action(param)
				});
			};
				
		getById("boxes").appendChild(box);
	}


//******************************************
//*****************CONTROLLER***************
//******************************************
	
	
	function transition(frame, type){
		processes++;
		var img = getById("img");
		var transitions = getById("transitions");
		if (type === "none"){
			updateBoxes(frame);
			img.src = "der/DER100" + frame + ".jpeg"
		} else {
			createTransition(type+"Out", 0);
			img.src = "der/DER100" + frame + ".jpeg"
			updateBoxes(frame);
			var x = 0;
			if (type === "left"){
				x = -WIDTH;
			} else if (type === "right"){
				x = WIDTH;
			}
			createTransition(type+"In", x); 

			img.style.visibility = "hidden";
			setTimeout(()=>{
				img.style.visibility = "visible";
			}, TRANSITION_SPEED/2);
			setTimeout(()=>{
				transitions.innerHTML = "";
				processes--;
			}, TRANSITION_SPEED-15);
		}
	}

	function createTransition(type, x){
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

	function boxClick(action){
		if (processes == 0) {
			processes++;
			launchFullScreen(getById("window"));
			action();
			processes--;
		}
	}

	function launchFullScreen(element) {
		if(element.requestFullScreen) {
		   element.requestFullScreen();
		} else if(element.mozRequestFullScreen) {
		   element.mozRequestFullScreen();
		} else if(element.webkitRequestFullScreen) {
		   element.webkitRequestFullScreen();
		}
	}


//******************************************
//*****************OTHER********************
//******************************************


	function getById(id) {
		return document.getElementById(id);
	}

	function simpleEval(x) {
		if (x instanceof Function){
			return (x)();
		} else {
			return x;
		}
	}

})();