window.proposalApp = window.proposalApp || {};

const POINTER_PADDING = 8;
const DODGE_GAP = 80;
const YES_GROWTH = 1.1;
const YES_SCALE_CAP = 2;
let dodgeLocked = false;

// Listens for hover and touch, because a phone tap never sends mouseenter.
function bindNoButton() {
    const noBtn = document.querySelector(".no-btn");
    noBtn.addEventListener("mouseenter", dodgeNo);
    noBtn.addEventListener("touchstart", onNoTouch, { passive: false });
}

// Stops the tap from also becoming a click on No.
function onNoTouch(event) {
    event.preventDefault();
    dodgeNo(event);
}

// Ignores the extra mouse event that some phones fire right after touch.
function dodgeNo(event) {
    if (dodgeLocked) {
        return;
    }
    dodgeLocked = true;
    window.setTimeout(function () {
        dodgeLocked = false;
    }, 400);

    try {
        moveNoButton(event);
        growYesButton();
    } catch (error) {
        console.error("no button dodge failed", { message: error && error.message });
    }
}

// Pins No to the viewport so the next spot is not stuck inside the button row.
function moveNoButton(event) {
    const noBtn = document.querySelector(".no-btn");
    const spot = pickSpot(noBtn, readPointer(event));
    noBtn.style.position = "fixed";
    noBtn.style.margin = "0";
    noBtn.style.left = spot.left + "px";
    noBtn.style.top = spot.top + "px";
}

function readPointer(event) {
    if (event.touches && event.touches[0]) {
        return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    if (typeof event.clientX === "number") {
        return { x: event.clientX, y: event.clientY };
    }
    return null;
}

// Picks a spot that is on screen and not still under the pointer.
function pickSpot(noBtn, pointer) {
    const maxLeft = window.innerWidth - noBtn.offsetWidth - POINTER_PADDING;
    const maxTop = window.innerHeight - noBtn.offsetHeight - POINTER_PADDING;
    let left = POINTER_PADDING;
    let top = POINTER_PADDING;
    let attempt = 0;

    while (attempt < 8) {
        left = POINTER_PADDING + Math.random() * Math.max(0, maxLeft - POINTER_PADDING);
        top = POINTER_PADDING + Math.random() * Math.max(0, maxTop - POINTER_PADDING);
        if (!isNearPointer(left, top, noBtn, pointer)) {
            return { left: left, top: top };
        }
        attempt += 1;
    }
    return { left: left, top: top };
}

function isNearPointer(left, top, noBtn, pointer) {
    if (!pointer) {
        return false;
    }
    const centerX = left + noBtn.offsetWidth / 2;
    const centerY = top + noBtn.offsetHeight / 2;
    const distanceX = centerX - pointer.x;
    const distanceY = centerY - pointer.y;
    return Math.hypot(distanceX, distanceY) < DODGE_GAP;
}

// Grows Yes a little each miss and clears the gap that used to separate it from No.
function growYesButton() {
    const yesBtn = document.querySelector(".yes-btn");
    const nextScale = window.proposalApp.yesScale * YES_GROWTH;
    window.proposalApp.yesScale = Math.min(YES_SCALE_CAP, nextScale);
    yesBtn.style.marginRight = "0";
    yesBtn.style.setProperty("--yes-scale", String(window.proposalApp.yesScale));
}

window.proposalApp.bindNoButton = bindNoButton;
