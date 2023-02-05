var indoorsPlans = [
	"Play board games",
	"Play videogames",
	"Netflix & chill",
	"Watch \"The Office\"",
	"Play music"
];

var outdoorsPlans = [
	"Visit a market",
	"Go to the cinema",
	"Go to a concert",
	"Geocatching"
];

var pastPlans = [];

function onLoad() {}

function onResize() {}

function whatToDoIndoors() {
	document.body.style.background = "#AFEEEE";
	updateWhatToDo(indoorsPlans[getRandomInRange(0, indoorsPlans.length - 1)]);
}

function whatToDoOutdoors() {
	document.body.style.background = "#B4EEB4";
	updateWhatToDo(outdoorsPlans[getRandomInRange(0, outdoorsPlans.length - 1)]);
}

function updateWhatToDo(whatToDo) {
	document.getElementById("whatToDo").innerHTML = "<b>" + whatToDo + "</b>";
	document.getElementById("pastPlans").innerHTML = getPastPlansText();
	pastPlans.push(whatToDo);
	if (pastPlans.length > 10) pastPlans.shift();
}

function getPastPlansText() {
	let textToDisplay = "";
	for (let i = pastPlans.length - 1; i >= 0; i--) {
		textToDisplay += pastPlans[i] + "<br>";
	}
	return textToDisplay;
}

function getRandomInRange(min, max) {
	return Math.floor(Math.random() * (max + 1)) + min;
}