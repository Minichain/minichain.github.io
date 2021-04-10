const patchNotes = [
    ["v0.03.00.0", ["Inventory added.", "Combat system modified.", "Warps/Portals added to change between scenes.", "World has completely changed. Also the way it is stored/loaded."]],
    ["v0.02.04.0", ["Text translations added (English, Spanish and Catalan).", "Musical mode can be changed by holding TAB."]],
    ["v0.02.03.0", ["Face Culling.", "Game Loop stabilized.", "Effect added when changing musical mode.", "New enemies."]],
    ["v0.02.02.0", ["Interface / HUD improvements."]],
    ["v0.02.01.0", ["Haste potions added. You can use them by pressing \"B\".", "Torches added.", "Rendering distance does not depend on zoom anymore.", "New type of tree added.", 
    "Potions and coin sprites added to the HUD."]],
    ["v0.02.00.0", ["Mana potions added. You can use them by pressing \"M\".", "Health potions added. You can use them by pressing \"H\".", "You can now Buy and Sell items to some NPCs.",
    "New sound effects added when buying/selling and drinking a potion.", "Update and Render time is displayed on the debug menu in nanoseconds."]],
    ["v0.01.04.0", ["Smoke particles added when running.", "Interaction entities are not displayed when menu is showing."]],
    ["v0.01.00.0", ["Input/Action Manager refactor (in progress).", "After this refactor, the developer should be able to assign any input to any action in the game."]],
    ["v0.00.08.0", ["You can now interact with some NPCs by pressing \"F\"."]],
    ["v0.00.07.0", ["Custom Taskbar Icon added.", "NPCs added.", "You can change HUD visibility by pressing \"ALT + Z\".", "Background music changed.",
    "Logs are stored in AppData, in a file called \"log_file.txt\".", "Database is now stored in AppData.", "Menu scroll bar improved.", "Number of lights limited to 25."]],
    ["v0.00.06.0", ["Enemies drop coins.", "Coins can be picked up.", "More enemies added.", "All sprites have been re-skinned!"]],
    ["v0.00.04.0", ["ScrollBar added to the Menu.", "You can scroll the menu using the \"mouse wheel\".", "You can now enable/disable shaders from the menu.",
    "Now you can change Game Time speed from the Menu.", "You can enable/disable enemies spawn in the Menu.", "You can modify ambience sound gain."]]
];

var patchNotesAppended = [];
var lastElementAppended;

function onLoad() {
    updateProjectVideo();

    lastElementAppended = 0;
    window.addEventListener("scroll", function(e) {
        let distanceToBottom = Math.abs(window.pageYOffset + window.innerHeight - document.body.offsetHeight);
        // console.log("Distance to bottom: " + distanceToBottom);
        if (distanceToBottom < 512) {
            if (patchNotes.length > lastElementAppended && !patchNotesAppended.includes(patchNotes[lastElementAppended][0])) {
                // console.log("Append " + patchNotes[lastElementAppended][0]);
                appendPatchNote(patchNotes[lastElementAppended][0], patchNotes[lastElementAppended][1]);
                lastElementAppended++;
            }
        }
    });
}

function appendPatchNote(title, listOfChanges) {
    patchNotesAppended.push(title);
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
    updateProjectVideo();
}

function updateProjectVideo() {
    var projectVideoElement = document.getElementsByClassName("projectVideo")[0];
    projectVideoElement.width = projectVideoElement.parentElement.clientWidth * 0.9;    // 90% of parent width
    projectVideoElement.height = projectVideoElement.width * (9 / 16);
}