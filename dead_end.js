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
		lictonSprings: {
			startFrame: '1a',
			startRoom: 'A',
			extension: 'jpeg',
			frames: {
				A: {
					'1a': { left: '1d', right: '1b', forward: '4a'},
					'1b': { left: '1a', right: '1c', forward: '2b'},
					'1c': { left: '1b', right: '1d'},
					'1d': { left: '1c', right: '1a'},
					'2a': { left: '2d', right: '2b', forward: '4a'},
					'2b': { left: '2a', right: '2c', forward: '3b'},
					'2c': { left: '2b', right: '2d'},
					'2d': { left: '2c', right: '2a', forward: '1d'},
					'3a': { left: '3d', right: '3b'},
					'3b': { left: '3a', right: '3c'},
					'3c': { left: '3b', right: '3d'},
					'3d': { left: '3c', right: '3a', forward: '2d'},
					'4a': { left: '4d', right: '4b'},
					'4b': { left: '4a', right: '4c'},
					'4c': { left: '4b', right: '4d', forward: '1c'},
					'4d': { left: '4c', right: '4a' },
					'5a': { left: '5d', right: '5c' },
					// '5b': { left: '5a', right: '5c' },
					'5c': { left: '5a', right: '5d', forward: '4c' },
					'5d': { left: '5c', right: '5a', forward: '6a' },
					'6a': { left: '6d', right: '6b', forward: '7a' },
					'6b': { left: '6a', right: '6c', forward: '5b' },
					'6c': { left: '6b', right: '6d', forward: '4c' },
					'6d': { left: '6c', right: '6a'},
					'7a': { left: '7d', right: '7b', forward: '8a'},
					'7b': { left: '7a', right: '7c'},
					'7c': { left: '7b', right: '7d', forward: '6c'},
					'7d': { left: '7c', right: '7a'},
					'8a': { left: '8d', right: '8b', forward: '9a'},
					'8b': { left: '8a', right: '8c'},
					'8c': { left: '8b', right: '8d', forward: '7c'},
					'8d': { left: '8c', right: '8a'},
					'9a': { left: '9d', right: '9b', forward: '10a'},
					'9b': { left: '9a', right: '9c'},
					'9c': { left: '9b', right: '9d', forward: '8c'},
					'9d': { left: '9c', right: '9a'},
					'10a': { left: '10d', right: '10b'},
					'10b': { left: '10a', right: '10c'},
					'10c': { left: '10b', right: '10d', forward: '9c'},
					'10d': { left: '10c', right: '10a'},
				}
			},
			boxes: {
				A: {
					'4a': [{
						hitbox: [.25,.45,.4,.6],
						cursor: 'forward',
						onclick: () => { transition('6a', 'fade') }},
					{
						hitbox: [.55,.8,.4,.6],
						cursor: 'forward',
						onclick: () => { transition('5a', 'fade') }}]
				}
			},
			
		},
	
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
					'1b': { left: () => power ? '1g' : '1a', right: '1c',
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
	
		georgeBushHouse: {
			startFrame: 101,
			startRoom: 'A',
			extension: 'jpg',
			frames: {
				A: {
					101: { left: 103, right: 102, forward: 1 },
					102: { left: 101 },
					103: { right: 101 },
					1:   { left: 2, right: 4, forward: 9},
					2:   { left: 3, right: 1},
					3:   { left: 4, right: 2 },
					4:   { left: 1, right: 3, forward: 5 },
					5:   { left: 8, right: 6 },
					6:   { left: 5, right: 7 },
					7: 	 { left: 6, right: 8, forward: 2 },
					8:   { left: 7, right: 5 },
					9:   { left: 10, right: 12 },
					10:  { left: 11, right: 9, forward: 13 },
					11:  { left: 12, right: 10, forward: 3 },
					12:  { left: 9, right: 11 },
					13:  { left: 14, right: 15 },
					14:  { left: 16, right: 13 },
					15:  { left: 13, right: 16 },
					16:  { left: 15, right: 14, forward: 12 },
					17:  { left: 20, right: 18 },
					18:  { left: 17, right: 19 },
					19:  { left: 18, right: 20 },
					20:  { left: 19, right: 17 },
					21:  { left: 24, right: 23 },
					22:  { left: 23, right: 24 },
					23:  { left: 21, right: 22 },
					24:  { left: 22, right: 21 },
					25:  { left: 22, right: 21 }
				}
			},
			boxes: {
				2:	[{	
					hitbox: [.2, .42, .15, .7],
					cursor: 'forward',
					onclick: () => { transition(21, 'fade') }}],
				12:	[{	
					hitbox: [.2, .4, .15, .7],
					cursor: 'forward',
					onclick: () => { transition(17, 'fade') }}],
				19:	[{	
					hitbox: [.45, .75, .1, .7],
					cursor: 'forward',
					onclick: () => { transition(10, 'fade') }}],
				22:	[{	
					hitbox: [.55, .9, 0, .87],
					cursor: 'forward',
					onclick: () => { transition(4, 'fade') }}],
				24:	[{	
					hitbox: [.45, .5, .2, .25],
					cursor: 'forward',
					onclick: () => { transition(25, 'none') }}],
				25:	[{	
					hitbox: [.2, .25, .12, .18],
					cursor: 'forward',
					onclick: () => { transition(24, 'none') }}],
			}
		},
	
		theSwamp: {
			startFrame: 0,
			extension: 'jpeg',
			frames: {
				0: 	{ left: 4, right: 2, forward: 1 },
				1:  { left: 4, right: 2, forward: 5 },
				2:  { left: 0, right: 3 },
				3:  { left: 2, right: 4 },
				4:  { left: 3, right: 0 },
				5:  { left: 8, right: 6, forward: 13 },
				6:  { left: 5, right: 7 },
				7:  { left: 6, right: 8, forward: 3 },
				8:  { left: 7, right: 5, forward: 9 },
				9:  { left: 12, right: 10 },
				10: { left: 9, right: 11 },
				11: { left: 10, right: 12, forward: 6 },
				12: { left: 11, right: 9 },
				13: { left: 16, right: 14, forward: 17 },
				14: { left: 13, right: 15, forward: 28 },
				15: { left: 14, right: 16, forward: 7 },
				16: { left: 15, right: 13, forward: 45 },
				17: { left: 20, right: 18, forward: 33 },
				18: { left: 17, right: 19, forward: 21 },
				19: { left: 18, right: 20, forward: 15 },
				20: { left: 19, right: 17 },
				21: { left: 24, right: 22 },
				22: { left: 21, right: 23, forward: 25 },
				23: { left: 22, right: 24, forward: 20 },
				24: { left: 23, right: 21 },
				25: { left: 28, right: 26, forward: 29 },
				26: { left: 25, right: 27, forward: 16 },
				27: { left: 26, right: 28, forward: 24  },
				28: { left: 27, right: 25 },
				29: { left: 32, right: 30 },
				30: { left: 29, right: 31 },
				31: { left: 30, right: 32, forward: 27 },
				32: { left: 31, right: 29 },
				33: { left: 36, right: 34 },
				34: { left: 33, right: 35, forward: 41 },
				35: { left: 34, right: 36, forward: 19 },
				36: { left: 35, right: 33, forward: 37 },
				37: { left: 40, right: 38 },
				38: { left: 37, right: 39, forward: 34 },
				39: { left: 38, right: 40, forward: 34 },
				40: { left: 39, right: 37 },
				41: { left: 44, right: 42 },
				42: { left: 41, right: 43 },
				43: { left: 42, right: 44, forward: 36 },
				44: { left: 43, right: 41 },
				45: { left: 48, right: 46 },
				46: { left: 45, right: 47 },
				47: { left: 46, right: 48, forward: 14 },
				48: { left: 47, right: 45 }
			}
		},
	
		summit: {
			startRoom: 'A',
			startFrame: '1a',
			extension: 'jpeg',
			frames: {
				A: {
					'1a': { forward: '1b' },
					'1b': { forward: '2a' },
					'2a': { forward: '3a' },
					'2b': {},
					'2c': {},
					'2d': {},
					'3a': { forward: '4a' },
					'3b': {},
					'3c': { forward: '2c' },
					'3d': {},
					'4a': { forward: '5a' },
					'4b': {},
					'4c': { forward: '3c' },
					'4d': {},
					'5a': { forward: '6a' },
					'5b': {},
					'5c': { forward: '4c' },
					'5d': { forward: '8d' },
					'6a': { forward: '7a' },
					'6b': {},
					'6c': { forward: '5c' },
					'6d': {},
					'7a': {},
					'7b': {},
					'7c': { forward: '6c'},
					'7d': {},
					'8a': {},
					'8b': { forward: '5b' },
					'8c': { forward: '18c' },
					'8d': { forward: '9e' },
					'9a': {},
					'9b': {},
					'9c': { forward: '8c' },
					'9d': {},
					'9e': { forward: '10d' },
					'10a': {},
					'10b': { forward: '9b' },
					'10c': { forward: '11c' },
					'10d': {},
					'11a': { forward: '10a'},
					'11b': {},
					'11c': {},
					'11d': { forward: '12d'},
					'12a': { forward: '15a'},
					'12b': { forward: '11b'},
					'12c': { forward: '13c'},
					'12d': {},
					'13a': { forward: '12a'},
					'13b': {},
					'13c': { forward: '14c'},
					'13d': {},
					'14a': { forward: '13a'},
					'14b': {},
					'14c': {},
					'14d': {},
					'15a': {},
					'15b': {},
					'15c': { forward: '12c' },
					'15d': {},
					'16a': { forward: '18a' },
					'16b': {},
					'16c': { forward: '17c'},
					'16d': {},
					'17a': { forward: '16a' },
					'17b': {},
					'17c': {},
					'17d': {},
					'18a': { forward: '8a' },
					'18b': {},
					'18c': { forward: '16c' },
					'18d': { forward: '19d' },
					'19a': {},
					'19b': { forward: '18b' },
					'19c': { forward: '20c' },
					'19d': { forward: '21d'},
					'20a': { forward: '19a' },
					'20b': {},
					'20c': {},
					'20d': {},
					'21a': {},
					'21b': { forward: '19b' },
					'21c': {},
					'21d': {},
				},
				B: {
					'1a': { forward: '1b', left: null, right: null },
					'1b': { forward: '2a', left: null, right: null },
					'2a': { forward: '3a' },
					'2b': {},
					'2c': {},
					'2d': {},
					'3a': { forward: '4a' },
					'3b': {},
					'3c': { forward: '2c' },
					'3d': {},
					'4a': { forward: '5a' },
					'4b': { forward: '3b' },
					'4c': { forward: '3c' },
					'4d': {},
					'5a': { forward: '6a' },
					'5b': {},
					'5c': { forward: '4c' },
					'5d': { forward: '8d' },
					'6a': { forward: '7a' },
					'6b': {},
					'6c': { forward: '5c' },
					'6d': {},
					'7a': {},
					'7b': {},
					'7c': { forward: '6c'},
					'7d': {},
					'8a': {},
					'8b': { forward: '5b' },
					'8c': { forward: '18c' },
					'8d': { forward: '9e' },
					'9a': {},
					'9b': {},
					'9c': { forward: '8c' },
					'9d': {},
					'9e': { forward: '10d' },
					'10a': {},
					'10b': { forward: '9b' },
					'10c': { forward: '11c' },
					'10d': {},
					'11a': { forward: '10a'},
					'11b': {},
					'11c': {},
					'11d': { forward: '12d'},
					'12a': { forward: '15a'},
					'12b': { forward: '11b'},
					'12c': { forward: '13c'},
					'12d': {},
					'13a': { forward: '12a'},
					'13b': {},
					'13c': { forward: '14c'},
					'13d': {},
					'14a': { forward: '13a'},
					'14b': {},
					'14c': {},
					'14d': {},
					'15a': {},
					'15b': {},
					'15c': { forward: '12c' },
					'15d': {},
					'16a': { forward: '18a' },
					'16b': {},
					'16c': { forward: '17c'},
					'16d': {},
					'17a': { forward: '16a' },
					'17b': {},
					'17c': {},
					'17d': {},
					'18a': { forward: '8a' },
					'18b': {},
					'18c': { forward: '16c' },
					'18d': { forward: '19d' },
					'19a': {},
					'19b': { forward: '18b' },
					'19c': { forward: '20c' },
					'19d': { forward: '21d'},
					'20a': { forward: '19a' },
					'20b': {},
					'20c': {},
					'20d': {},
					'21a': {},
					'21b': { forward: '19b' },
					'21c': {},
					'21d': {},
				}
			}
		},
	
		genasGarden: {
			startFrame: 1,
			extension: 'jpg',
			frames: {
				1:  { left: 4, right: 2 },
				2:  { left: 1, right: 3, forward: 14 },
				3:  { left: 2, right: 4, forward: 5 },
				4:  { left: 3, right: 1, forward: 17 },
				5:  { left: 8, right: 6 },
				6:  { left: 5, right: 7 },
				7:  { left: 6, right: 8, forward: 1 },
				8:  { left: 7, right: 5, forward: 9 },
				9:  { left: 12, right: 10 },
				10: { left: 9, right: 11 },
				11: { left: 10, right: 12, forward: 6 },
				12: { left: 11, right: 9, forward: 13 },
				13: { left: 16, right: 14 },
				14: { left: 13, right: 15 },
				15: { left: 14, right: 16, forward: 10 },
				16: { left: 15, right: 13, forward: 4 },
				17: { left: 20, right: 18 },
				18: { left: 17, right: 19 },
				19: { left: 18, right: 20, forward: 2 },
				20: { left: 19, right: 17 }
			}
		}
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
				inventory['key'].state = 2;
				refreshCustomBoxes();
				refreshInventory();
			}
		}
	}
}


//******************************************
// INIT
//******************************************

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
const extension = gameData.extension
const inventory = state.inventory
const standardBoxes = commonData.standardBoxes;

//global vars:
let room = gameData.startRoom
let frame = gameData.startFrame
let framesData = gameData.frames[room]
let frameData = framesData[frame]
let processes = 0 // whether or not to listen to user input

//DOM globals:
let standardBoxesDiv
let customBoxesDiv
let picsDiv

window.onload = function() {
	init()
}

function init() {
	standardBoxesDiv = getById('standardBoxes')
	customBoxesDiv = getById('customBoxes')
	picsDiv = getById('pics')

	makeStandardBoxes();
	transition(frame, 'fade');
	refreshInventory();
	//window.onclick = ()=>launchFullScreen(getById('window'));
}

//******************************************
// LOGIC
//******************************************


//TODO: do better.
function setRoom(newRoom, newExtension) {
	if (newRoom == null) {
		framesData = gameData.frames
	} else {
		extension = newExtension
		room = newRoom;
		framesData = gameData.frames[room]
	}
}


// TRANSITIONS
function transition(newFrame, type) {
	if (processes > 0) {
		return
	}
	processes++
	frame = newFrame
	createTransition(type + 'Out');
	getById('img').src = FRAME_PATH + '/' + room + '/' + frame + '.' + extension
	refreshStandardBoxes();
	refreshCustomBoxes();
	createTransition(type + 'In');
	setTimeout(() => {
		getById('transitions').innerHTML = '';
		cacheResources(frame)
		processes--;
	}, SIDE_SPEED);
}

//CUSTOM BOXES
function refreshCustomBoxes() {
	picsDiv.innerHTML = '';
	customBoxesDiv.innerHTML = '';
	let boxes = framesData[frame].boxes;
	if (boxes != null) {
		for (let i = 0; i < boxes.length; i++) {
			let boxData = boxes[i]
			if (boxData.condition != null && !boxData.condition()) {
				continue
			}
			makeCustomBox(boxData);
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
		let box = makeBox(hitbox, cursor, onclick, id);
		customBoxesDiv.appendChild(box);
	}
	if (img != null) {
		let pic = document.createElement('img')
		pic.classList.add('picBox')
		pic.src = PIC_PATH + simpleEval(boxData.img) + '.png'
		picsDiv.appendChild(pic)
	}
}

function makeBox(hitbox, cursor, onclick = null, id = null) {
	let box = document.createElement('div');
	box.className = 'box';
	box.style.left = hitbox[0] * WIDTH + 'px';
	box.style.width = (hitbox[1] - hitbox[0]) * WIDTH + 'px';
	box.style.bottom = hitbox[2] * HEIGHT + 'px';
	box.style.height = (hitbox[3] - hitbox[2]) * HEIGHT + 'px';
	setCursor(box, cursor)
	if (id != null) {
		box.id = id;
	}
	if (onclick != null) {
		box.onclick = onclick
	}
	return box;
}

// INVENTORY 
function refreshInventory() {
	getById('inventory').innerHTML = '';
	for (let item in inventory) {
		if (inventory[item].state == 1){
			makeInventoryItem(item);
		}
	}
}

function makeInventoryItem(id) {
	let item = document.createElement('div');
	item.classList.add('inventory');
	item.classList.add('box');
	item.style.left = '0px';
	item.style.top = '0px';
	let img = document.createElement('img');
	img.src = INVENTORY_PATH + inventory[id].img + '.png';
	item.appendChild(img);
	makeDraggable(item, inventory[id].targetId, inventory[id].targetAction);
	getById('inventory').appendChild(item);
}

// Make given inventory box draggable, execute action if dropped on targetId
function makeDraggable(item, targetId, targetAction) {
	setCursor(item, 'open')
	item.onmousedown = function(event) {
		event.preventDefault();
		setCursor(item, 'closed');	
		let itemX = parseInt(item.style.left)
		let itemY = parseInt(item.style.top)
		let mouseX = event.clientX
		let mouseY = event.clientY
		document.onmousemove = function(event) {
			event.preventDefault();
			item.style.left = itemX + event.clientX - mouseX + 'px';
			item.style.top = itemY + event.clientY - mouseY + 'px';
		};
		document.onmouseup = function(event) {
			document.onmousemove = null
			document.onmouseup = null
			event.preventDefault();
			let target = getById(targetId);
			if (target != null && isCollide(item, target)){
				targetAction();
			} else {
				item.style.left = itemX;
				item.style.top = itemY;
				document.onmousemove = null;
				setCursor(item, 'open');
			}

		};
	};
}


//******************************************
// DOM
//******************************************


function createTransition(type) {
	let transition = document.createElement('div');
	transition.appendChild(getById('img').cloneNode(true)); //creates duplicate img

	let picBoxes = picsDiv.cloneNode(true);
	picBoxes.id = null;
	transition.appendChild(picBoxes);
	transition.classList.add('transition');
	
	transition.classList.add(type);
	if (type == 'leftIn'){
		transition.style.left = -WIDTH + 'px';
				
	} else if (type == 'rightIn'){
		transition.style.left = WIDTH + 'px';
	}
	
	getById('transitions').appendChild(transition);
}


// CACHING
function cacheResources() {
	
	let framesToCache = []
	framesToCache.push(frameData.left) //these may be null
	framesToCache.push(frameData.right)
	framesToCache.push(frameData.left)
	framesToCache.push(frameData.back)

	cacheFrames(framesToCache)
}

function cacheFrames(frames) {
	for (let frame of frames) {
		if (frame == null) {
			return
		}
		let preload = new Image();
		preload.src = FRAME_PATH + '/' + room + '/' + frame + '.' + extension
		getById('preloads').appendChild(preload);
	}
}



//OTHER
//Plays the gif of the given name.  Takes the number of frames and the delay to calculate the time... (maybe make this automatic somehow?)
function playGif(name, frames, delay) {
	processes++;
	let gif = getById('fullGif');
	gif.src = GIF_PATH + name + '.gif' + '?a='+Math.random();
	gif.style.visibility = 'visible'
	getById('movies').appendChild(gif);
	setTimeout(() => {
		gif.style.visibility = 'hidden';
		processes--;
	}, frames * delay);	
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



//******************************************
//*****************SOUND********************
//******************************************

function playSound(name, volume, loop) {
	let sound = new Audio(AUDIO_PATH + name + '.mp3');	
	sound.volume = volume;
	sound.play();
	return sound;
}

/*
function initSounds() {
		//let rain = playSound('outsiderain', 1, true);
		//let generator = playSound('reddit', .5, true);
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
*/

//******************************************
//*****************1 time*******************
//******************************************	


function refreshStandardBoxes() {
	refreshStandardBox(standardBoxes.left, framesData[frame].left);
	refreshStandardBox(standardBoxes.right, framesData[frame].right);
	refreshStandardBox(standardBoxes.forward, framesData[frame].forward);
	refreshStandardBox(standardBoxes.back, framesData[frame].back);
}

function refreshStandardBox(boxData, destinationFrame) {
	let element = boxData.element;
	if (destinationFrame == null) {
		element.style.visibility = 'hidden'
	} else {
		element.style.visibility = 'visible'
		element.onclick = () => { transition(simpleEval(destinationFrame), boxData.transition) }
	}
}

function makeStandardBoxes() {
	for (let standardBox in standardBoxes) {
		let boxData = standardBoxes[standardBox]
		let box = makeBox(boxData.hitbox, boxData.cursor);
		boxData.element = box;
		standardBoxesDiv.appendChild(box);
	}
}

function makeStandardBox(boxData) {
	
}


//******************************************
//*****************HELPER*******************
//******************************************	

	function setCursor(element, cursor) {
		element.style.cursor = 'url(' + CURSOR_PATH + cursor + '.png), auto';
	}

	// Returns the element with the given id
	function getById(id) {
		return document.getElementById(id);
	}

	//returns true if a and b are overlapping
	function isCollide(a, b) {
    	return !(
     		((a.y + a.height) < (b.y)) ||
      		(a.y > (b.y + b.height)) ||
      		((a.x + a.width) < b.x) ||
      		(a.x > (b.x + b.width)));
	}

	//If x is a function, returns the result of evaluating x, otherwise returns x
	function simpleEval(x) {
		return (x instanceof Function) ? x() : x;
	}
	
})();