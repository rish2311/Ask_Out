window.proposalApp = window.proposalApp || {};

const PLAY_ICON = "image/play.png";
const PAUSE_ICON = "image/pause (1).png";

// Keeps the icon and the nudge tied to real playback, not to the click alone.
function bindMusic() {
    const audio = document.getElementById("music");
    const toggle = document.getElementById("playPauseButton");
    const nudge = document.getElementById("music-nudge");

    audio.addEventListener("play", function () {
        showPauseIcon(toggle, nudge);
    });
    audio.addEventListener("pause", function () {
        showPlayIcon(toggle);
    });
    toggle.addEventListener("click", function () {
        toggleMusic(audio);
    });
    toggle.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleMusic(audio);
        }
    });
    nudge.addEventListener("click", function () {
        toggleMusic(audio);
    });
    showPlayIcon(toggle);
}

function showPauseIcon(toggle, nudge) {
    toggle.src = PAUSE_ICON;
    toggle.alt = "Pause the song";
    nudge.hidden = true;
}

function showPlayIcon(toggle) {
    toggle.src = PLAY_ICON;
    toggle.alt = "Play the song";
}

// Catches a blocked play so the page stays quiet instead of throwing.
function toggleMusic(audio) {
    try {
        if (!audio.paused) {
            audio.pause();
            return;
        }
        const playResult = audio.play();
        if (playResult && typeof playResult.catch === "function") {
            playResult.catch(function (error) {
                console.error("music play failed", { message: error && error.message });
            });
        }
    } catch (error) {
        console.error("music toggle failed", { message: error && error.message });
    }
}

window.proposalApp.bindMusic = bindMusic;
