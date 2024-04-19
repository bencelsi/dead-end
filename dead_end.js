(function() {
'use strict'

// TODO - branch-based image caching
// use format A1a.a - room A , position 1, direction a, variant (ie, power on, door open)
// TODO - fluent interface for gifs, pics, boxes.
// Ideal: smooth transition between standard box, custom, pic - all on 1 map
// Idea: you move around, but scary creature keeps following you
// Homepage w multiple games
// Single file? or game data in separate
// understand let vs var etc.
// Add 'gameState' to data
// Remove other games... put into a fork, and periodically rebase
// freeze game data?
// Add 'menu' logic

// GAME DATA ******************************************
const data = {
	commonData: {
		standardBoxes : {
			left: {
				hitbox: [0, .2, .2, .8],
				transition: 'left',
				cursor: 'left' },
			right: {
				hitbox: [.8, 1, .2, .8],
				transition: 'right',
				cursor: 'right' },
			forward: {
				hitbox: [.25, .75, .25, .75],
				transition: 'fade',
				cursor: 'forward' },
			back: {
				hitbox: [0, 1, 0, .2],
				transition: 'fade',
				cursor: 'back' }
		}
	},
	gameData: {
		deadEnd: {
			startRoom: 'A',
			startFrame: '0a',
			extension: 'png',
			frames: {
				A: {
					'0a': { forward: '0b' },
					'0b': { forward: '0c' },
					'0c': { forward: '0d' },
					'0d': { forward: '0e' },
					'0e': { forward: () => { playSound('churchbell', 1); setTimeout(() => { transition('0g', 'fade') }, 3000); return '0f'} },
					'0f': { },
					'0g': { forward: '1a' },
					'1a': { forward: '3a', left: '1f', right: '1b' },
					'1b': { left: () => state.power ? '1g' : '1a', right: '1c',
							boxes: [{
								hitbox: [.1, .75, .25, .75],
								cursor: 'forward',
									onclick: () => {
								transition('2a', 'fade')
								playGif('sidepath1', 9, 350)
								playSound('sidepath', 1, false) }}],
							toCache: { frames: ['2a', '1g', '1a'], gifs: ['sidepath1'] }},
					'1c': { left: '1b', right: '1d' },
					'1d': { left: '1c', right: '1e' },
					'1e': { left: '1d', right: '1f' },
					'1f': { left: '1e', right: () => state.power ? '1g' : '1a' },
					'1g': { left: '1f', right: '1b', forward: '3e' },
					'2a': { left: '2d', right: '2b' },
					'2b': { left: '2a', right: '2c' },
					'2c': { left: '2b', right: '2d', forward: '1d' },
					'2d': { left: '2c', right: '2a',
							boxes: [
							{	hitbox: [.05, .2, .25, .75],
								cursor: 'zoom',
								onclick: () => transition('2e', 'fade')}]},
					'2e': { left: '2c', right: '2a', back: '2d',
							boxes: [
							{	hitbox: () => { return (state.power ? [.45, .57, .23, .3] : [.45, .57, .4, .47]) },
								cursor: 'open',
								onclick: () => { state.power = !state.power; refreshCustomBoxes() }},
							{	condition: () => { return state.power },
								img: 'x14.1' },
							{	condition: () => { return state.power },
								img: 'x14.2.1' }]},
					'3a': { left: '3d', right: '3b' },
					'3b': { left: '3a', right: '3c' },
					'3c': { left: () => state.power ? '3f' : '3b', right: () => state.power ? '3g' : '3d', forward: '1d' },
					'3d': { left: '3c', right: '3a' },
					'3e': { left: '3g', right: '3f',
							boxes: [
							{	hitbox: () => { return(inventory['key'].state == 3 ? [.4, .5, .2, .6] : [.45, .5, .33, .42]) },
								img: () => {
									if (inventory['key'].state == 2) {
										return 'x16.1'
									} else if (inventory['key'].state == 3) {
										return 'x16.2'
									} else {
										return null }},
								cursor: () => { return(inventory['key'].state == 3 ? 'forward' : 'open') },
								id: () => { return(inventory['key'].state <= 2 ? 'frontDoor' : null) },
								onclick: () => {
									if (inventory['key'].state <= 1) {
										//playSound('momoko', 1, true)
									} else if (inventory['key'].state == 2) {
										inventory['key'].state = 3
										refreshCustomBoxes() 
									} else if (inventory['key'].state == 3) {
										setRoom('B', 'jpeg'); transition('1a', 'fade') 
									}}}]
						},
					'3f': { left: '3e', right: '3c' },
					'3g': { left: '3c', right: '3e',
							boxes: [
							{	hitbox: [.48, .57, .87, .93],
								cursor: 'zoom',
								onclick: () => transition('3h', 'fade') }],
							},
					'3h': { back: '3g',
							boxes: [
							 {	condition: () => { return inventory['key'].state == 0 },
								hitbox: [.32, .65, .4, .48],
								cursor: 'open',
								onclick: () => { inventory['key'].state = 1; refreshCustomBoxes(); refreshInventory() }},
							{ 	condition: () => { return inventory['key'].state == 0 },	
								img: 'x12' }]},
					'3i': { forward: () => { setRoom('B', 'jpeg'); return '1a' }},
				},
				B: {
					'1a': { left: '1d', right: '1b', forward: '2a' },
					'1b': { left: '1a', right: '1c'},
					'1c': { left: '1b', right: '1d', forward: () => { setRoom('A', 'png'); return '3c' } },
					'1d': { left: '1c', right: '1a', forward: '3d' },
					'2a': { left: '2d', right: '2b'},
					'2b': { left: '2a', right: '2c'},
					'2c': { left: '2b', right: '2d', forward: '1c' },
					'2d': { left: '2c', right: '2a'},
					'3a': { left: '3d', right: '3b', forward: () => { extension = 'png'; return '5a' }},
					'3b': { left: '3a', right: '3c', forward: '1b' },
					'3c': { left: '3b', right: '3d' },
					'3d': { left: '3c', right: '3a', forward: '4d'},
					'3h': { left: '3c', right: '3a', forward: '4d'},
					'4a': { left: '4d', right: '4b', forward: () => { extension = 'png'; return '6a' } },
					'4b': { left: '4a', right: '4c', forward: '3b' },
					'4c': { left: '4b', right: '4d' },
					'4d': { left: '4c', right: '4a' },
					'5a': { left: '5d', right: '5b' },
					'5b': { left: '5a', right: '5c' },
					'5c': { left: '5b', right: '5d', forward: () => { extension = 'jpeg'; return '3c' } },
					'5d': { left: '5c', right: '5a' },
					'6a': { forward: '6b', back: '4a' },
					'6b': { forward: '7a', back: '4a' },
					'7a': { left: '7h', right: '7b' },
					'7b': { left: '7a', right: '7c' },
					'7c': { left: '7b', right: '7d' },
					'7d': { left: '7c', right: '7e' },
					'7e': { left: '7d', right: '7f', forward: () => { extension = 'jpeg'; return '4c' }},
					'7f': { left: '7e', right: '7g' },
					'7g': { left: '7f', right: '7h' },
					'7h': { left: '7g', right: '7a' },
				}
			},
		},
	}
}
																																																			
const state = {
	power: false,
	inventory: {
		key: {
			state: 0,
			img: 'burger',
			targetId: 'frontDoor',
			targetAction: () => {
				inventory['key'].state = 2
				refreshCustomBoxes()
				refreshInventory()
			}
		}
	}
}

// INIT ******************************************
const GAME = 'deadEnd'
const FRAME_PATH = 'assets/' + GAME + '/frames'
const GIF_PATH = 'assets/' + GAME + '/gifs/'
const AUDIO_PATH = 'assets/' + GAME + '/audio/'
const PIC_PATH = 'assets/' + GAME + '/pics/'
const INVENTORY_PATH = 'assets/' + GAME + '/inventory/'
const CURSOR_PATH = 'cursors/'
const HEIGHT = 750
const WIDTH = 750
const SIDE_SPEED = 400
const FADE_SPEED = 400

// globals consts
const gameData = data.gameData[GAME]
const commonData = data.commonData
const inventory = state.inventory
const standardBoxes = commonData.standardBoxes;

//global vars:

let extension = gameData.extension
let room = gameData.startRoom
let frame = gameData.startFrame
let framesData = gameData.frames[room]
let frameData = framesData[frame]
let processes = 0 // whether or not to listen to user input

//DOM globals:
let standardBoxesDiv
let customBoxesDiv
let picsDiv
let cacheDiv

window.onload = function() {
	init()
}

function init() {
	standardBoxesDiv = getById('standardBoxes')
	customBoxesDiv = getById('customBoxes')
	picsDiv = getById('pics')
	cacheDiv = getById('cache')
	setupStandardBoxes()
	transition(frame, 'fade')
	refreshInventory()
	//window.onclick = ()=>launchFullScreen(getById('window'))
}

// DOM setup  ******************************************
function setupStandardBoxes() {
	for (let standardBox in standardBoxes) {
		let boxData = standardBoxes[standardBox]
		let box = makeBox(boxData.hitbox, boxData.cursor)
		boxData.element = box
		standardBoxesDiv.appendChild(box)
	}
}

// TRANSITIONS ******************************************
function transition(newFrame, type) {
	if (processes > 0) {
		return
	}
	processes++
	frame = newFrame
	frameData = framesData[frame]
	createTransition(type + 'Out')
	getById('img').src = FRAME_PATH + '/' + room + '/' + frame + '.' + extension
	refreshStandardBoxes()
	refreshCustomBoxes()
	createTransition(type + 'In')
	setTimeout(() => {
		getById('transitions').innerHTML = ''
		cacheResources()
		processes--
	}, SIDE_SPEED)
}

function createTransition(type) {
	let transition = document.createElement('div')
	transition.appendChild(getById('img').cloneNode(true)) //creates duplicate img
	let picBoxes = picsDiv.cloneNode(true)
	picBoxes.id = null
	transition.appendChild(picBoxes)
	transition.classList.add('transition')
	transition.classList.add(type)
	if (type == 'leftIn') {
		transition.style.left = -WIDTH + 'px'
	} else if (type == 'rightIn') {
		transition.style.left = WIDTH + 'px'
	}
	
	getById('transitions').appendChild(transition)
}


// CUSTOM BOXES ******************************************
function refreshCustomBoxes() {
	picsDiv.innerHTML = ''
	customBoxesDiv.innerHTML = ''
	let boxes = framesData[frame].boxes
	if (boxes != null) {
		for (let i = 0; i < boxes.length; i++) {
			let boxData = boxes[i]
			if (boxData.condition != null && !boxData.condition()) {
				continue
			}
			makeCustomBox(boxData)
		}
	}
}

// returns a box element from a JSON object containing box info, or null if the box shouldn't exist
function makeCustomBox(boxData) {
	let hitbox = simpleEval(boxData.hitbox)
	let cursor = simpleEval(boxData.cursor)
	let onclick = boxData.onclick
	let id = simpleEval(boxData.id)
	let img = simpleEval(boxData.img)
	if (hitbox != null) {
		let box = makeBox(hitbox, cursor, onclick, id)
		customBoxesDiv.appendChild(box)
	}
	if (img != null) {
		let pic = document.createElement('img')
		pic.classList.add('picBox')
		pic.src = PIC_PATH + simpleEval(boxData.img) + '.png'
		picsDiv.appendChild(pic)
	}
}

function makeBox(hitbox, cursor, onclick = null, id = null) {
	let box = document.createElement('div')
	box.className = 'box'
	box.style.left = hitbox[0] * WIDTH + 'px'
	box.style.width = (hitbox[1] - hitbox[0]) * WIDTH + 'px'
	box.style.bottom = hitbox[2] * HEIGHT + 'px'
	box.style.height = (hitbox[3] - hitbox[2]) * HEIGHT + 'px'
	setCursor(box, cursor)
	if (id != null) {
		box.id = id
	}
	if (onclick != null) {
		box.onclick = onclick
	}
	return box
}


// STANDARD BOXES ******************************************

function refreshStandardBoxes() {
	refreshStandardBox(standardBoxes.left, framesData[frame].left)
	refreshStandardBox(standardBoxes.right, framesData[frame].right)
	refreshStandardBox(standardBoxes.forward, framesData[frame].forward)
	refreshStandardBox(standardBoxes.back, framesData[frame].back)
}

function refreshStandardBox(boxData, destinationFrame) {
	let element = boxData.element
	if (destinationFrame == null) {
		element.style.visibility = 'hidden'
	} else {
		element.style.visibility = 'visible'
		element.onclick = () => { transition(simpleEval(destinationFrame), boxData.transition) }
	}
}


// INVENTORY ••••••••••••••••••••••••••••••••••••••••••••••••••

function refreshInventory() {
	getById('inventory').innerHTML = ''
	for (let item in inventory) {
		if (inventory[item].state == 1){
			makeInventoryItem(item)
		}
	}
}

function makeInventoryItem(id) {
	let item = document.createElement('div')
	item.classList.add('inventory')
	item.classList.add('box')
	item.style.left = '0px'
	item.style.top = '0px'
	let img = document.createElement('img')
	img.src = INVENTORY_PATH + inventory[id].img + '.png'
	item.appendChild(img)
	makeDraggable(item, inventory[id].targetId, inventory[id].targetAction)
	getById('inventory').appendChild(item)
}

// Make given inventory box draggable, execute action if dropped on targetId
function makeDraggable(item, targetId, targetAction) {
	setCursor(item, 'open')
	item.onmousedown = function(event) {
		event.preventDefault()
		setCursor(item, 'closed')	
		let itemX = parseInt(item.style.left)
		let itemY = parseInt(item.style.top)
		let mouseX = event.clientX
		let mouseY = event.clientY
		document.onmousemove = function(event) {
			event.preventDefault()
			item.style.left = itemX + event.clientX - mouseX + 'px'
			item.style.top = itemY + event.clientY - mouseY + 'px'
		};
		document.onmouseup = function(event) {
			document.onmousemove = null
			document.onmouseup = null
			event.preventDefault()
			let target = getById(targetId)
			if (target != null && isCollide(item, target)){
				targetAction()
			} else {
				item.style.left = itemX
				item.style.top = itemY
				document.onmousemove = null
				setCursor(item, 'open')
			}

		}
	}
}

// CACHING

let cacheSet = new Set()
function cacheResources() {
	cacheFrame(frameData.left) //these may be null
	cacheFrame(frameData.right)
	cacheFrame(frameData.forward)
	cacheFrame(frameData.back)
}

function cacheFrame(frame) {
	if (frame == null || frame instanceof Function) {
		return
	}
	
	let src = FRAME_PATH + '/' + room + '/' + frame + '.' + extension
	if (cacheSet.has(src)) {
		console.log('already cached')
		return
	}

	console.log("caching " + frame)

	if (cacheDiv.childNodes.length >= 20) {
		let cachedImageToRemove = cacheDiv.childNodes[0]
		console.log('removing ' + cachedImageToRemove)
		cacheSet.delete(cachedImageToRemove)
	}

	let cachedImage = new Image()
	cachedImage.src = src
	cacheDiv.appendChild(cachedImage)
	cacheSet.add(src)
}


// GIFS ••••••••••••••••••••••••••••••••••••••••••••••••••

//Plays the gif of the given name.  Takes the number of frames and the delay to calculate the time... (maybe make this automatic somehow?)
function playGif(name, frames, delay) {
	processes++
	let gif = getById('fullGif')
	gif.src = GIF_PATH + name + '.gif' + '?a='+Math.random()
	gif.style.visibility = 'visible'
	getById('movies').appendChild(gif)
	setTimeout(() => {
		gif.style.visibility = 'hidden'
		processes--
	}, frames * delay)
}


// SOUND ******************************************

function playSound(name, volume, loop) {
	let sound = new Audio(AUDIO_PATH + name + '.mp3')
	sound.volume = volume
	sound.play()
	return sound
}

/*
function initSounds() {
		//let rain = playSound('outsiderain', 1, true)
		//let generator = playSound('reddit', .5, true)
		//json.sounds.rain = rain
		//json.sounds.rain.volume = 0	
		rain.volume = .2
		for (let i = 0; i < 999; i++) {
			//json.sounds.rain.volume += .001
		}
}
function setVolume(n, volume, speed) {
	//	json.sounds.n.volume = volume
}
*/


// HELPERS ******************************************	

function getById(id) {
	return document.getElementById(id)
}

function setCursor(element, cursor) {
	element.style.cursor = 'url(' + CURSOR_PATH + cursor + '.png), auto'
}

//launches full screen mode on the given element.
function launchFullScreen(element) {
	if(element.requestFullScreen) {
	   element.requestFullScreen()
	} else if(element.mozRequestFullScreen) {
	   element.mozRequestFullScreen()
	} else if(element.webkitRequestFullScreen) {
	   element.webkitRequestFullScreen()
	}
}

// If x is a function, returns the result of evaluating x, otherwise returns x
function simpleEval(x) {
	return (x instanceof Function) ? x() : x
}

// Returns true if a and b are overlapping
function isCollide(a, b) {
	return !(
		((a.y + a.height) < (b.y)) ||
		(a.y > (b.y + b.height)) ||
		((a.x + a.width) < b.x) ||
		(a.x > (b.x + b.width)))
}

// TODO: do better.
function setRoom(newRoom, newExtension) {
	console.log(extension)
	console.log(newExtension)
	if (newRoom == null) {
		framesData = gameData.frames
	} else {
		extension = newExtension
		room = newRoom;
		framesData = gameData.frames[room]
	}
}

})();