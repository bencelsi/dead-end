(function() {
	"use strict";
	const FRAME_PATH = "assets/frames/DER100"
	const GIF_PATH = "assets/gifs/"
	const OTHER_PATH = "assets/other/"
	const AUDIO_PATH = "assets/audio/"
	const BOX_PATH = "assets/boxes/"
	const INVENTORY_PATH = "assets/inventory/"
	const HEIGHT = 750;
	const WIDTH = 750;
	const SIDE_SPEED = 400;
	const FADE_SPEED = 300;

	let power = true;
	let processes = 0; //whether not to listen to user input
	let frame = 16;
	let key = 0;
	let lever = 0;

	window.onload = function() {
		initModel();
		initController();
		initView();
	};

//MODEL DATA
const frames = { 
	0: {//0
		forward: 1	
	},1:{//1
		left: 7, right: 3, forward: 15
	},2:{//2
		left: 7, right: 3, forward: 16
	},3:{//3
		left: ()=>power?2:1, right: 4
	},4:{//4
		left: 3, right: 5
	},5:{//5
		left: 4, right: 6
	},6:{//6
		left: 5, right: 7
	},7:{//7
		left: 6, right: ()=>power?2:1
	},8:{//8
		left: 11, right: 9
	},9:{//9
		left: 8, right: 10
	},10:{//10
		left: 9, right: 11, forward: 6
	},11:{//11
		left: 10, right: 8
	},12:{//12
		back: 24
	},13:{//13
	},14:{
		left: 10, right: 8, back: 24
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
}

const inventory = 
[]


//CONTROL DATA
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
		3:	[{	pos: [.1, .25, .5, .65],
				cursor: "forward",
				addListeners: function(box) {
					box.onclick = ()=>{
						transition(8, "fade");
						playGif("sidepath1", 9, 350);
						playSound("sidepath", 0, false);
					};
				}
			}],
		11:[{	pos: [.04, .5, .25, .75],
				cursor: "zoom",
				addListeners: function(box) {
					box.onclick = ()=>transition(14, "fade");
				}	
			}],
		12:[{ 
			pos: [.46, .53, .11, .2],
			condition: ()=>{return(inventoryMap[0].state == 0);},
			cursor: "open",
			img: "x12",
			addListeners: function(box) {
				box.onclick = ()=>{
					inventoryMap[0].state == 1;
					inventory.push(0);
					updateBoxes(frame);
					updateInventory(frame);
				}
			}
		}],
		14:[{
				pos: [.46, .53, .11, .2],
				cursor: "open",
				addListeners: function(box) {
					makeDraggable(box,
						function(event) {
							console.log(event.clientY);
							if (event.clientY > 300){
								//power = true;
								updateBoxes(frame);
								//box.src = BOX_PATH + "x14.2.3" + ".png";
							} else {
								box.src = BOX_PATH + "x14.2.2" + ".png";
							}
						}
					);
				}
			},{condition: ()=>{return(power);},
				img: "x12",
				cursor: "open",
			}],
		24:[{	pos: [.4, .6, .05, .1],
				cursor: "zoom",
				addListeners: function(box) {
					box.onclick = ()=>{
						transition(12, "fade");
					}
				}
			}]
	}
}

//******************************************
//*****************MODEL********************
//******************************************
	function initModel() {
		initSounds();
	}

	function initSounds() {
		let rain = playSound("outsiderain", 0, true);
		//let generator = playSound("reddit", .5, true);
		//json.sounds.rain = rain;
		//json.sounds.rain.volume = 0;
		rain.volume = .2;
		for (let i = 0; i < 999; i++) {
			//json.sounds.rain.volume += .001;
		}
	}

	function setVolume(n, volume, speed) {
		//	json.sounds.n.volume = volume;
	}


	let inventoryMap = {
		0: {
			name: "key",
			state: 0,
			img: "burger"
		}
	}

//******************************************
//*****************CONTROLLER***************
//******************************************



	function initController() {
		updateInventory();
	}

	//processess and updates boxes, based on the given frame
	function updateBoxes(newFrame) {
		console.log(newFrame);
		clearCustomBoxes();
		frame = newFrame;

		updateStandardBoxes(newFrame);
		let boxesData = boxes.custom[frame];
		if (boxesData != null) {			//creates custom boxes
			for (let i = 0; i < boxesData.length; i++) {
				makeCustomBox(boxesData[i]);
			}
		}
	}

	function updateInventory(){
		for (let i = 0; i < inventory.length; i++){
			makeInventoryBox(inventory[i]);
		}
	}

	//makes inventory boxes draggable
	function makeDraggable(box, release) {
		setBoxCursor(box, "open");
		box.onmousedown = function(event) {
			//mouseDown();

			event.preventDefault();
			setBoxCursor(box, "closed");
			
			let boxX = parseInt(box.style.left)
			let boxY = parseInt(box.style.top)
			let mouseX = event.clientX
			var mouseY = event.clientY
			
			document.onmousemove = function(event) {
				event.preventDefault();
				
				box.style.left = boxX + event.clientX - mouseX + "px";
				box.style.top = boxY + event.clientY - mouseY + "px";
			};

			document.onmouseup = function(event) {
				event.preventDefault();
				if (release != undefined) {
					release();
				} else {
					box.style.left = boxX;
					box.style.top = boxY;
					//setBoxPos(box, [0,0,0,0]);
					console.log(box.style.top);
					document.onmousemove = null;
					setBoxCursor(box, "open");
				}
			};
		};
	}

	


//******************************************
//*****************VIEW*********************
//******************************************
	function initView() {
		importImages();
		makeStandardBoxes();
		updateBoxes(frame);	
		//window.onclick = ()=>launchFullScreen(getById("window"));
	}

//STANDARD BOXES
	function makeStandardBoxes() {
		makeStandardBox(boxes.standard.left);
		makeStandardBox(boxes.standard.right);
		makeStandardBox(boxes.standard.forward);
		makeStandardBox(boxes.standard.back);
	} 

	function makeStandardBox(boxData) {
		let box = makeBox(boxData);
		getById("standardBoxes").appendChild(box);
	}

	function updateStandardBoxes(frame) {
		updateStandardBox(boxes.standard.left, frames[frame].left);
		updateStandardBox(boxes.standard.right, frames[frame].right);
		updateStandardBox(boxes.standard.forward, frames[frame].forward);
		updateStandardBox(boxes.standard.back, frames[frame].back);
	}

	function updateStandardBox(boxData, destinationFrame) {
		let element = boxData.element;
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
			let box = makeBox(boxData);
			if (boxData.img != null) {											//pic boxes
				let pic = document.createElement("img");
				pic.classList.add("picBox");
				pic.src = BOX_PATH + simpleEval(boxData.img) + ".png";
				box.appendChild(pic);
			}
			if(boxData.addListeners != null) {
				boxData.addListeners(box);
			}
			getById("customBoxes").appendChild(box);
		}
	}

	function clearCustomBoxes() {
		getById("customBoxes").innerHTML = "";
		/*
		let boxesData = boxes.custom[frame];
		if (boxesData != null) {
			for (let i = 0; i < boxesData.length; i++) {
				if (boxesData[i].element != null) {
					boxesData[i].element.remove();
				}
			}
		}*/
	}

//INVENTORY BOXES
	function makeInventoryBox(id){
		let box = document.createElement("div");
		box.classList.add("inventory");
		box.classList.add("box");
		box.id = inventoryMap[id].name;
		box.style.left = "0px";
		box.style.top = "0px";
		let img = document.createElement("img");
		console.log(inventoryMap.id);
		img.src = INVENTORY_PATH + inventoryMap[id].img + ".png";
		box.appendChild(img);
		makeDraggable(box);
		getById("inventory").appendChild(box);
	}

//GENERIC BOXES
	function makeBox(boxData) {
		let box = document.createElement("div");
		box.className = "box";
		boxData.element = box;
		setBoxPos(box, boxData.pos);
		setBoxCursor(box, boxData.cursor);
		return box;
	}

	function setBoxPos(box, pos) {
		if (pos != null) {
			box.style.left = pos[0] * WIDTH + "px";
			box.style.top = pos[1] * HEIGHT + "px";
			box.style.width = pos[2] * WIDTH + "px";
			box.style.height = pos[3] * HEIGHT + "px";
		}
	}

	function setBoxCursor(box, cursor){
		box.style.cursor = "url(" + OTHER_PATH + cursor + ".png), auto";
	}
	
//TRANSITIONS
	//make a controller function for this?
	function transition(newFrame, type) {
		if (processes == 0) {
			processes++;
			if (type == "left"){
				leftTransition(newFrame);
			} else if (type == "right"){
				rightTransition(newFrame);
			} else if (type == "fade"){
				fadeTransition(newFrame);
			}
			setTimeout(()=>{
				getById("transitions").innerHTML = "";
				processes--;
			}, SIDE_SPEED);
		}
	}

	function leftTransition(newFrame) {
		createTransition("leftOut", 0);
		getById("img").src = FRAME_PATH + newFrame + ".png"
		updateBoxes(newFrame);
		createTransition("leftIn", -WIDTH);
		
	}

	function rightTransition(newFrame) {
		createTransition("rightOut", 0);
		getById("img").src = FRAME_PATH + newFrame + ".png"
		updateBoxes(newFrame);
		createTransition("rightIn", WIDTH);
	}

	function fadeTransition(newFrame) {
		createTransition("fadeOut", 0);
		getById("img").src = FRAME_PATH + newFrame + ".png"
		updateBoxes(newFrame);
		createTransition("fadeIn", 0);
	}


	function createTransition(type, x) {
		let transition = document.createElement("div");
		let img = document.createElement("img");
		let picBoxes = document.createElement("div");
		img.src = getById("img").src;
		img.classList.add("frame");
		let children = getById("customBoxes").children;
		for (let i = 0; i < children.length; i++) {
			if (children[i].src != undefined){
				let clone = children[i].cloneNode();
				picBoxes.appendChild(clone);
			}
		}
		//picBoxes.innerHTML = getById("picBoxes").innerHTML;
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
		let gif = getById("fullGif");
		gif.src = GIF_PATH + name + ".gif" + "?a="+Math.random();
		gif.style.visibility = "visible"
		getById("movies").appendChild(gif);
		setTimeout(function() {
			gif.style.visibility = "hidden";
			processes--;
		}, frames*delay);	
	}

	function playSound(name, volume, loop) {
		let sound = new Audio(AUDIO_PATH + name + ".mp3");	
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
		for (let i = 0; i < 27; i++) {
			let preload = new Image();
			preload.src = FRAME_PATH + i + ".png";
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

	function isCollide(a, b) {
    	return !(
     		((a.y + a.height) < (b.y)) ||
      	(a.y > (b.y + b.height)) ||
      	((a.x + a.width) < b.x) ||
      	(a.x > (b.x + b.width))
    	);
}

})();