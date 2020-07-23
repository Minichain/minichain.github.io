function onLoad() {
    updateElements();
}

function onWindowResize() {
    updateElements();
}

function updateElements() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    var bannerImageElement = document.getElementsByClassName("bannerImage");
    var portraitImageElement = document.getElementsByClassName("portraitImage");
    var div01Element = document.getElementsByClassName("div01");
    var divMyNameElement = document.getElementsByClassName("divMyName");
    var divIconsElement = document.getElementsByClassName("divIcons");
    var divBriefDescriptionElement = document.getElementsByClassName("divBriefDescription");

    if (w < 1000) {
        // console.log("Opacity 0.0");
        bannerImageElement[0].style.opacity = "0.0";
        div01Element[0].style.width = w;
        div01Element[0].style.height = "275px";
        portraitImageElement[0].style.top = "15%";
        divMyNameElement[0].style.width = w;
        divIconsElement[0].style.width = w;
        divBriefDescriptionElement[0].style.width = w;
    } else {
        // console.log("Opacity 1.0");
        bannerImageElement[0].style.opacity = "1.0";
        div01Element[0].style.height = "350px";
        portraitImageElement[0].style.top = "40%";
    }
}