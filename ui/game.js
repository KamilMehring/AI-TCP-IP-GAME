// let pakiet = "#tcp";
let gSett = {
	match: 'tcp',
	answTime: 5000	//czas na odpowiedź: 5s
}
// PLAYER
var inOut = {
	in: 'in',
	out: 'out',
	btn: 'btnAdd',
	init() {
		document.getElementById(inOut.btn).addEventListener('click', inOut.action);
	},
	action() {
		console.log("Click!");
		let content = document.getElementById(inOut.in).value;
		document.getElementById(inOut.out).textContent = content;
	}
}

// wywolanie funkcji init() przy zaladowaniu okna przegladarki
window.addEventListener('load', inOut.init);
const Player = {
	name: null,
	points: 0,
	setName: (value) => {
		console.log('Ustaw nazwę gracza');
		if (value !== null) {
			Player.name = value;
			return true;
		} else
			return false;
	},
	getName: () => {
		console.log('Player name is: ' + Player.name);
		return Player.name;
	},
	addPoints: (value = 0) => {
		Player.points = parseInt(Player.points) + parseInt(value);
	},
	subtractPoints: (value = 0) => {
		Player.points = parseInt(Player.points) - parseInt(value);
	},
	getPoints: () => {
		return parseInt(Player.points)
	},
	eol: null
}
// MATCH
let target = null; // tutaj dynamicznie będziemy przypisywać elementy
const fields = [
	{ offset: 0064, label: "Ack number", no: 39 },
	{ offset: 096, label: "Data offset", no: 41 },
	{ offset: 0016, label: "Destination port", no: 35 },
	{ offset: 0106, label: "Flags", no: 43 },
	{ offset: 128, label: "Header and Data checksum", no: 46 },
	{ offset: 0160, label: "Options", no: 49 },
	{ offset: 0100, label: "Reserved", no: 42 },
	{ offset: 0032, label: "Sequence number", no: 37 },
	{ offset: 0000, label: "Source port", no: 34 },
	{ offset: 0144, label: "Urgent pointer", no: 47 },
	{ offset: 0112, label: "Window size", no: 44 },
];
// TIMER
const Timer = {
	t1: null,	// match Time
	t2: null,	// answer Time
	countDown: () => {
		var t = gSett.answTime;
		Timer.t2 = setInterval(() => {
			//	console.log(t);
			if (t <= 0) {
				clearInterval(Timer.t2);
				drawTarget();
			}
			t = t - 100;
			Timer.shrinkLine(t);
		}, 100);

	},
	countWidth: (value) => {
		var full = gSett.answTime;
		return value * 100 / full;
	},
	shrinkLine: (value) => {
		var line = document.querySelector("#nextItem").querySelector("hr");
		var correct = Timer.countWidth(value);
		line.style.width = correct + "%";
	}
}
// ?MATCH?
let drawTarget = () => {
	clearInterval(Timer.t2);
	var trgtNo = randomize(fields.length - 1);
	if (trgtNo !== false) {
		Timer.countDown();				// odliczanie czasu na odpowiedź
		target = fields[trgtNo];	// przypisanie wylosowanego elementu
		console.log(trgtNo);
		console.log(fields[trgtNo]);
		console.log(haveIt);
		var fndNode = document.querySelector("#nextItem").querySelector("output");
		fndNode.textContent = target.label;	// wyświetlenie elementu
	}
}
let withdrawLastTarget = () => {
	haveIt.pop();
}

let haveIt = [];
let randomize = (maxNr) => {
	//Generate random number
	let random = (Math.random() * maxNr).toFixed();

	//Coerce to number by boxing
	random = Number(random);

	if (!haveIt.includes(random)) {
		haveIt.push(random);
		return random;
	} else {
		if (haveIt.length <= maxNr) {
			//Recursively generate number
			return randomize(maxNr);
		} else {
			console.log('No more numbers available.')
			return false;
		}
	}
}
// GAME
const Game = {
	started: false,
	paused: false,
	start: () => {
		Player.points = 0;
		// clear haveIt[];
		clearPoints();	// wyzerowanie punktów
		buildZone();	// wyświetlenie obszaru gry
		Game.started = true;
		drawTarget();
		Player.getName();
		Player.getPoints();
	},
	pause: () => {
		Game.paused = !Game.paused;
		console.log('Stan pauzowania gry: ' + Game.paused);
	},
	isPaused: () => {
		return Game.paused;
	},
	finish: () => {
		// clear Pocket #tcp
		// clear Element #nextItem
		// clear ?
	},
	eol: null
}
let procCell = (e) => {
	if (e.target.dataset.cell != "hdr") {
		if (compareValues(getNodeNo(e.target))) {
			displayElement(target, e.target);
			Player.addPoints(1);
			displayPoints();
		} else {
			//	decsPoints();
			withdrawLastTarget();
			// usuń poprzednio wylosowany element
		}
		target = null;
		drawTarget();
	}
}
let getNodeNo = (node) => {
	return Array.from(node.parentNode.children).indexOf(node);
}
let compareValues = (value) => {
	return (value == target.no) ? true : false;
}
// UI
let dspMessage = (text) => {
	console.log(text);
}
let buildZone = () => {
	let pNode = document.getElementById("tcp");
	if (pNode !== null) {
		var divs = pNode.querySelectorAll("div");
		for (let i = 0; i < divs.length; i++) {
			divs[i].addEventListener('click', procCell);
		}
		pNode.style.display = "grid";
	} else {
		dspMessage("Brak węzła TCP");
	}
}
let displayElement = (what, where) => {
	where.textContent = what.label;
}
let displayPoints = (e) => {
	var val = 1;
	var ptsNode = document.querySelector("#points").querySelector("output");
	ptsNode.textContent = Player.getPoints();//parseInt(ptsNode.textContent)+val;
}
let clearPoints = () => {
	var ptsNode = document.querySelector("#points").querySelector("output");
	ptsNode.textContent = 0;
}


let init = () => {
	//Game.start();	// DEBUGOWANIE
	//drawTarget();	// DEBUGOWANIE
	document.getElementById("btnNewGame").addEventListener('click', Game.start);
	document.getElementById("btnRematch").addEventListener('click', drawTarget);
}
let hideShow = () => {
	var x = document.getElementById("hide");
	if (x.style.display === "none") {
		x.style.display = "grid";
	} else {
		x.style.display = "none";
	}
}
document.getElementById('btnNewGame').addEventListener('click', show, false);

function show() {
	document.getElementById('tcp').style.display = 'grid';
	this.style.display = 'none'
}




window.addEventListener('load', init);
