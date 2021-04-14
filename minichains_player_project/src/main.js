var patchNotes = [];
var lastElementAppended;

function onLoad() {
    getPatchNotesFromUrl("https://raw.githubusercontent.com/Minichain/MinichainsPlayer/master/README.md");
}

function appendPatchNote(title, listOfChanges) {
    let patchNotesInnerDiv = document.getElementsByClassName("projectPatchNotesInnerDiv")[0];
    let listTitle = document.createElement("h2");
    listTitle.textContent = title;
    patchNotesInnerDiv.appendChild(listTitle);
    let list = document.createElement("ul");
    listOfChanges.forEach(element => {
        let li = document.createElement('li');
        li.textContent = element;
        list.appendChild(li);
    });
    patchNotesInnerDiv.appendChild(list);
}

function onResize() {

}

function getPatchNotesFromUrl(url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader("Content-Type");
            if (type.indexOf("text") !== 1) {
                // console.log(request.responseText);
                parsePatchNotes(request.responseText);
                addScrollEventListener();
            }
        }
    }
}

function addScrollEventListener() {
    lastElementAppended = 0;
    window.addEventListener("scroll", function(e) {
        let distanceToBottom = Math.abs(window.pageYOffset + window.innerHeight - document.body.offsetHeight);
        // console.log("Distance to bottom: " + distanceToBottom);
        if (distanceToBottom < 512) {
            if (patchNotes.length > lastElementAppended) {
                // console.log("Append " + patchNotes[lastElementAppended][0]);
                appendPatchNote(patchNotes[lastElementAppended][0], patchNotes[lastElementAppended][1]);
                lastElementAppended++;
            }
        }
    });
}

function parsePatchNotes(patchNotesTxt) {
    let str1 = "## Patch Notes\n\n";
    let str2 = "## Social Media";
    var patchNotesParsed = patchNotesTxt.slice(patchNotesTxt.indexOf(str1) + (str1).length, patchNotesTxt.indexOf(str2)).split("* **");
    patchNotesParsed = patchNotesParsed.slice(1, patchNotesParsed.length);
    patchNotesParsed.forEach(element => {
        let a = element.split("**");
        let version = String(a[0]);
        let notes = String(a[1]);
        notes = notes.split("*");
        // console.log("Version: " + version);
        // console.log("Notes: " + notes);
        patchNotes.push([version, notes.slice(1, notes.length)]);
    });
    // console.log("patchNotes:\n" + patchNotes);
}