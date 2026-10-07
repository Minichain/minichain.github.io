// Light/dark mode toggle for the Hadestown pages. The chosen mode is saved in localStorage,
// so it is kept when moving between the song list and the songs.
// This script is loaded in the <head> so the mode is applied before the page is drawn,
// avoiding a flash of the dark mode when light mode is selected.
var THEME_STORAGE_KEY = "hadestownTheme";
var LIGHT_MODE_CLASS = "lightMode";
var SUN_ICON_PATH = "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM11 1h2v3h-2zm0 19h2v3h-2zM1 11h3v2H1zm19 0h3v2h-3zM4.22 5.64l1.42-1.42 2.12 2.12-1.42 1.42zm12.02 12.02l1.42-1.42 2.12 2.12-1.42 1.42zM4.22 18.36l2.12-2.12 1.42 1.42-2.12 2.12zM16.24 6.34l2.12-2.12 1.42 1.42-2.12 2.12z";
var MOON_ICON_PATH = "M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36A5.39 5.39 0 0 1 12.4 4.1c-.44-.06-.9-.1-1.36-.1z";

function isLightMode() {
    return document.documentElement.classList.contains(LIGHT_MODE_CLASS);
}

function getSavedTheme() {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (e) {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
        // Storage may be blocked (private window...). The mode just won't be remembered.
    }
}

function toggleTheme() {
    var isLight = !isLightMode();
    document.documentElement.classList.toggle(LIGHT_MODE_CLASS, isLight);
    saveTheme(isLight ? "light" : "dark");
    updateThemeButton();
}

// The button shows the mode it switches to: a sun in dark mode and a moon in light mode.
function updateThemeButton() {
    var button = document.getElementById("themeButton");
    var isLight = isLightMode();
    button.title = isLight ? "Switch to dark mode" : "Switch to light mode";
    button.querySelector("path").setAttribute("d", isLight ? MOON_ICON_PATH : SUN_ICON_PATH);
}

function setUpThemeButton() {
    var button = document.createElement("button");
    button.className = "themeButton";
    button.id = "themeButton";
    button.innerHTML = '<svg viewBox="0 0 24 24"><path/></svg>';
    button.addEventListener("click", toggleTheme);
    document.body.appendChild(button);
    updateThemeButton();
}

if (getSavedTheme() === "light") {
    document.documentElement.classList.add(LIGHT_MODE_CLASS);
}
document.addEventListener("DOMContentLoaded", setUpThemeButton);
