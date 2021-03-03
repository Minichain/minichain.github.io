function onLoad() {
	updateMonthRows();
	updateImageDescription();
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

window.addEventListener("scroll", () => {
	var pageY = window.pageYOffset;
	// console.log("Scroll!! pageY: " + pageY);
	
	var monthRowMarch = document.getElementById("monthRowMarch");
	var monthRowJune = document.getElementById("monthRowJune");
	var monthRowSeptember = document.getElementById("monthRowSeptember");
	var monthRowDecember = document.getElementById("monthRowDecember");
	
	if ((pageY - monthRowDecember.offsetTop) > 0) {
		document.body.style.backgroundImage = "url(res/animal_crossing/winter_background_01.png)";
	} else if ((pageY - monthRowSeptember.offsetTop) > 0) {
		document.body.style.backgroundImage = "url(res/animal_crossing/fall_background_01.png)";
	} else if ((pageY - monthRowJune.offsetTop) > 0) {
		document.body.style.backgroundImage = "url(res/animal_crossing/summer_background_01.png)";
	} else if ((pageY - monthRowMarch.offsetTop) > 0) {
		document.body.style.backgroundImage = "url(res/animal_crossing/spring_background_01.png)";
	}
});