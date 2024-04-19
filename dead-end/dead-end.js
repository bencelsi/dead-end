const gameData = {
	title: 'Dead End2',
	gameName: 'dead-end',
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