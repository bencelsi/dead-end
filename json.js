///=optional

Var json =
{	Nodes: [
		1:{
			img: “bla.png”,
			clickBoxes: [
				/left: 2;
				/right: 14;
				/back: 
				{	pos: [25, 20, 50, 5],
					mouseOver: “zoomIn”,
					transition: “fade”,
					/goTo: 16
					/action: "getKey"
				},
				{	pos: [25, 20, 50, 5],
					mouseOver: “zoomIn”,
					transition: “fade”,
					/goTo: 16
					/action: "getKey"
				}
			]
		},

		2:{
			img: “bla.png”,
			clickBoxes: [
				/left: 3,
				/right: 14,
				/back: 10,
				/forward: 20,
				{	pos: [25, 20, 50, 5],
					img: 
					mouseOver: “zoomIn”,
					transition: “fade”,
					/goTo: 16
					/action: "getKey"
				},
			
			]
		}
	]
}

var frame = 13;

var frameData = json.Nodes[frame];
for (var i = 0; i <frameData.clickBoxes.length; i++){

	var b = document.createElement( div)
	b.onclick = partial(goTo, json.Nodes[frame].)





function goTo(transition, destination) {



}