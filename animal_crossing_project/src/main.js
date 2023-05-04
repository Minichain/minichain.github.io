var pictures = [
	["2020_03_24_01", ""],
	["2020_03_24_02", ""],
	["2020_03_24_03", "La primera vez que Minichain visita la isla de Sakura"],
	["2020_03_29_01", ""],
	["2020_04_07_01", ""],
	["2020_04_19_01", ""],
	["2020_04_19_02", ""],
	["2020_05_13_01", ""],
	["2020_05_13_02", ""],
	["2020_05_13_03", ""],
	["2020_05_13_04", ""],
	["2020_05_13_05", ""],
	["2020_05_14_01", ""],
	["2020_05_14_02", ""],
	["2020_05_14_03", ""],
	["2020_05_23_01", ""],
	["2020_05_23_02", ""],
	["2020_05_23_03", ""],
	["2020_05_23_04", ""],
	["2020_07_00_01", ""],
	["2020_07_15_01", "Usando el Palantir para comunicarnos con Sauron"],
	["2020_07_15_02", ""],
	["2020_07_16_01", "Un bañito hehe"],
	["2020_07_16_02", ""],
	["2020_07_23_01", ""],	
	["2020_08_02_01", ""],
	["2020_08_02_02", ""],
	["2020_08_14_01", "Estrellitas fugaces"], 
	["2020_08_23_01", ""],
	["2020_08_23_02", "Qué monos estamos!"], 
	["2020_08_23_03", "Qué monos estamos! Parte 2"],
	["2020_08_00_01", ""],
	["2020_09_02_01", ""],
	["2020_10_00_01", "Happy Halloween!"],
	["2020_11_14_01", ""],
	["2020_11_26_01", "Día del Pavo"],
	["2020_12_00_01", ""],
	["2020_12_00_02", ""],
	["2020_12_00_03", ""],
	["2020_12_00_04", ""],
	["2020_12_00_05", ""],
	["2020_12_00_06", ""],
	["2020_12_00_07", ""],
	["2020_12_00_08", ""],
	["2020_12_00_09", ""],
	["2020_12_00_10", ""],
	["2020_12_03_01", ""],
	["2020_12_11_01", ""], 			
	["2020_12_22_01", ""],
	["2020_12_31_01", "Adiós 2020!"],
	["2021_01_01_02", "Happy New Year!"],
	["2021_02_14_01", "Carnavaaaal!!"],
	["2021_02_00_01", "A bailar!!"],
	["2021_02_00_02", ""],
	["2021_02_15_01", ""],
	["2021_02_26_01", ""],
	["2021_03_03_01", ""],
	["2021_03_03_02", ""],
	["2021_03_03_03", ""],
	["2021_11_25_01", ""],
	["2021_11_25_02", ""],
	["2021_11_25_03", ""]
];

var lastPictureAppended;
var currentMonth;
var currentSeason;

function onLoad() {
	lastPictureAppended = 0;
	currentMonth = -1;

	addScrollEventListener();
	loadPictures();
	updateMonthRows();
	updateImageDescription();
	getClosestMonthAndSetSeason();
}

function addScrollEventListener() {
	window.addEventListener("scroll", () => {
		loadPictures();
		getClosestMonthAndSetSeason();
	});
}

function getClosestMonthAndSetSeason() {
	let pageY = window.pageYOffset;
	let monthRows = document.getElementsByClassName("monthRow");
	let closestMonth = "January";
	let lastComputedDistance = -1;
	for (let i = 0; i < monthRows.length; i++) {
		let newComputedDistance = Math.abs(pageY - monthRows[i].offsetTop);
		if (lastComputedDistance == -1 || newComputedDistance < lastComputedDistance) {
			closestMonth = monthRows[i].getElementsByClassName("monthText")[0].textContent.split(" ")[0];
			lastComputedDistance = newComputedDistance;
		}
	}
	
	setSeason(getSeasonFromMonth(getMonthNumber(closestMonth)));
}

function loadPictures() {
	let distanceToBottom = Math.abs(window.pageYOffset + window.innerHeight - document.body.offsetHeight);
	while (distanceToBottom < 1024) {
		if (pictures.length > lastPictureAppended) {
			appendPicture(pictures[lastPictureAppended][0], pictures[lastPictureAppended][1]);
			lastPictureAppended++;
		}
		distanceToBottom += 128;
	}
}

function appendPicture(pictureName, pictureDescription) {
	console.log("Append picture: " + pictureName);
	let centerColumnDiv = document.getElementsByClassName("centerColumn")[0];
	let imageRowDiv = document.createElement("div");
	imageRowDiv.className = "imageRow";
	let picture = document.createElement("img");
	picture.className = "image";

	let year = pictureName.split("_")[0];
	let month = pictureName.split("_")[1];
	if (currentMonth != month) {
		appendNewDate(year, month, centerColumnDiv);
	}

	picture.src = "animal_crossing_project/res/images/" + pictureName + ".jpg";
	imageRowDiv.appendChild(picture);
	if (pictureDescription != "") {
		addOrUpdateDescription(pictureDescription, imageRowDiv);
	}
    centerColumnDiv.appendChild(imageRowDiv);

	if (pictureName == "2020_03_24_03") easterEgg01(imageRowDiv);
	if (pictureName == "2020_08_14_01") easterEgg02(imageRowDiv);
	if (pictureName == "2020_07_15_01") easterEgg03(imageRowDiv);
	if (pictureName == "2021_02_15_01") easterEgg04(imageRowDiv);
}

var objectiveEasterEgg01 = 26;
function easterEgg01(imageRowDiv) {
	let counter = 0;
	let textDisplayed = false;
	let code = "T6EFQ-GG6XD-??7PT";
	let textToDisplay = "Regalito: " + code + " | Siguiente pista: Estrellas fugaces";
	imageRowDiv.addEventListener("click", function() {
		counter++;
		if (counter >= objectiveEasterEgg01) {
			if (!textDisplayed) {
				addOrUpdateDescription(textToDisplay, imageRowDiv);
				updatePicture("animal_crossing_project/res/images/easter_egg_01.jpg", imageRowDiv)
				textDisplayed = true;
			}
		} else if (counter > 0) {
			addOrUpdateDescription(objectiveEasterEgg01 - counter, imageRowDiv);
		}
	});
}

var objectiveEasterEgg02 = 50;
function easterEgg02(imageRowDiv) {
	let counter = 0;
	let codeDisplayed = false;
	imageRowDiv.addEventListener("click", function() {
		counter++;
		if (counter >= objectiveEasterEgg02) {
			if (!codeDisplayed) {
				addOrUpdateDescription("Vamos a ver Suzume! | Siguiente pista: Nos comunicamos con Sauron", imageRowDiv);
				updatePicture("animal_crossing_project/res/images/easter_egg_02_03.jpg", imageRowDiv)
				codeDisplayed = true;
			}
		} else if (counter > 0) {
			addOrUpdateDescription(objectiveEasterEgg02 - counter, imageRowDiv);
			if (counter == 10) {
				updatePicture("animal_crossing_project/res/images/easter_egg_02_01.jpg", imageRowDiv)
			} else if (counter == 25) {
				updatePicture("animal_crossing_project/res/images/easter_egg_02_02.jpg", imageRowDiv)
			}
		}
	});
}

var objectiveEasterEgg03 = 100;
function easterEgg03(imageRowDiv) {
	let counter = 0;
	let codeDisplayed = false;
	let code = "T6EFQ-GG6XD-??7PT";
	imageRowDiv.addEventListener("click", function() {
		counter++;
		if (counter >= objectiveEasterEgg03) {
			if (!codeDisplayed) {
				addOrUpdateDescription("Regalito! (Mira Steam hehe) | Siguiente pista: Festivaaaaal!!", imageRowDiv);
				updatePicture("animal_crossing_project/res/images/easter_egg_03_03.jpg", imageRowDiv)
				codeDisplayed = true;
			}
		} else if (counter == (objectiveEasterEgg03 / 4)) {
			addOrUpdateDescription("Ya casi está!", imageRowDiv);
			updatePicture("animal_crossing_project/res/images/easter_egg_03_01.jpg", imageRowDiv)
		} else if (counter == (objectiveEasterEgg03 / 2)) {
			addOrUpdateDescription("Un poco más...", imageRowDiv);
			updatePicture("animal_crossing_project/res/images/easter_egg_03_02.jpg", imageRowDiv)
		} else if (counter > (objectiveEasterEgg03 / 4) * 3) {
			addOrUpdateDescription(objectiveEasterEgg03 - counter, imageRowDiv);
		} else if (counter == 1) {
			addOrUpdateDescription("Sigue haciendo click", imageRowDiv);
		}
	});
}

var objectiveEasterEgg04 = 200;
function easterEgg04(imageRowDiv) {
	let counter = 0;
	let codeDisplayed = false;
	imageRowDiv.addEventListener("click", function() {
		counter++;
		if (counter >= objectiveEasterEgg04) {
			if (!codeDisplayed) {
				addOrUpdateDescription("Nos vamos a París!", imageRowDiv);
				updatePicture("animal_crossing_project/res/images/easter_egg_04_05.jpg", imageRowDiv)
				codeDisplayed = true;
			}
		} else if (counter == 25) {
			addOrUpdateDescription("Ya casi está!", imageRowDiv);
			updatePicture("animal_crossing_project/res/images/easter_egg_04_01.jpg", imageRowDiv)
		} else if (counter == 50) {
			addOrUpdateDescription("Un poco más...", imageRowDiv);
			updatePicture("animal_crossing_project/res/images/easter_egg_04_02.jpg", imageRowDiv)
		} else if (counter == 75) {
			addOrUpdateDescription("Este es un pelín más complicao", imageRowDiv);
		} else if (counter == 100) {
			addOrUpdateDescription("UwU", imageRowDiv);
			updatePicture("animal_crossing_project/res/images/easter_egg_04_03.jpg", imageRowDiv)
		} else if (counter == 125) {
			addOrUpdateDescription("UwUn poco más", imageRowDiv);
			updatePicture("animal_crossing_project/res/images/easter_egg_04_04.jpg", imageRowDiv)
		} else if (counter > 150) {
			addOrUpdateDescription(objectiveEasterEgg04 - counter, imageRowDiv);
		} else if (counter == 1) {
			addOrUpdateDescription("Sigue haciendo click", imageRowDiv);
		}
	});
}

function appendNewDate(year, month, centerColumnDiv) {
	let monthRowDiv = document.createElement("div");
	monthRowDiv.className = "monthRow";
	let h1 = document.createElement("h1");
	h1.className = "monthText";
	h1.textContent = getMonthName(month) + " " + year;
	monthRowDiv.appendChild(h1);
	centerColumnDiv.appendChild(monthRowDiv);
	currentMonth = month;
}

function setSeason(season) {
	if (season != currentSeason) {
		console.log("Set season to " + season);
		if (season === "Winter") {
			document.body.style.backgroundImage = "url(animal_crossing_project/res/images/winter_background_01.jpg)";
		} else if (season === "Fall") {
			document.body.style.backgroundImage = "url(animal_crossing_project/res/images/fall_background_01.jpg)";
		} else if (season === "Summer") {
			document.body.style.backgroundImage = "url(animal_crossing_project/res/images/summer_background_01.jpg)";
		} else if (season === "Spring") {
			document.body.style.backgroundImage = "url(animal_crossing_project/res/images/spring_background_01.jpg)";
		}
		currentSeason = season;
	}
}

function addOrUpdateDescription(pictureDescription, imageRowDiv) {
	console.log("Add description: " + pictureDescription);
	let imageDescriptionDiv = imageRowDiv.querySelector("div");
	if (imageDescriptionDiv) {
		let description = imageDescriptionDiv.querySelector("h2");
		description.textContent = pictureDescription;
	} else {
		imageDescriptionDiv = document.createElement("div");
		imageDescriptionDiv.className = "imageDescription";
		let description = document.createElement("h2");
		description.textContent = pictureDescription;
		imageDescriptionDiv.appendChild(description);
		imageRowDiv.appendChild(imageDescriptionDiv);
	}
}

function updatePicture(newPicturePath, imageRowDiv) {
	let imageDiv = imageRowDiv.querySelector("img");
	imageDiv.src = newPicturePath;
}

function onResize() {
	updateMonthRows();
	updateImageDescription();
}

function updateMonthRows() {
	var elements = document.getElementsByClassName("monthRow");
	var i;
	for (i = 0; i < elements.length; i++) {
		var padding = document.body.offsetWidth;
		elements[i].style.paddingTop = (padding * 0.01).toString() + "px";
		elements[i].style.paddingBottom = (padding * 0.01).toString() + "px";
		var fontSize = padding * 0.05;
		if (fontSize > 40) fontSize = 40;
		elements[i].getElementsByTagName("h1")[0].style.fontSize = fontSize.toString() + "px";;
	}
}

function updateImageDescription() {
	var elements = document.getElementsByClassName("imageDescription");
	var i;
	for (i = 0; i < elements.length; i++) {
		var padding = document.body.offsetWidth;
		var fontSize = padding * 0.025;
		if (fontSize > 20) fontSize = 20;
		elements[i].getElementsByTagName("h2")[0].style.fontSize = fontSize.toString() + "px";;
	}
}

function getSeasonFromMonth(monthNumber) {
	monthNumber = parseInt(monthNumber);
	switch (monthNumber) {
		default:
		case 1:
		case 2:
		case 12:
			return "Winter";
		case 3:
		case 4:
		case 5:
			return "Spring";
		case 6:
		case 7:
		case 8:
			return "Summer";
		case 9:
		case 10:
		case 11:
			return "Fall";
	}
}

function getMonthName(monthNumber) {
	monthNumber = parseInt(monthNumber);
	switch (monthNumber) {
		default:
		case 1:
			return "January";
		case 2:
			return "February";
		case 3:
			return "March";
		case 4:
			return "April";
		case 5:
			return "May";
		case 6:
			return "June";
		case 7:
			return "July";
		case 8:
			return "August";
		case 9:
			return "September";
		case 10:
			return "October";
		case 11:
			return "November";
		case 12:
			return "December";
	}
}

function getMonthNumber(monthName) {
	switch (monthName) {
		default:
		case "January":
			return 1;
		case "February":
			return 2;
		case "March":
			return 3;
		case "April":
			return 4;
		case "May":
			return 5;
		case "June":
			return 6;
		case "July":
			return 7;
		case "August":
			return 8;
		case "September":
			return 9;
		case "October":
			return 10;
		case "November":
			return 11;
		case "December":
			return 12;
	}
}