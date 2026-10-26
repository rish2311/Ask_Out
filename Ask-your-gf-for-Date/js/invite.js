window.proposalApp = window.proposalApp || {};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
let countdownTimerId = null;
let meetingTarget = null;

// Copies the placeholders into trimmed strings before any of them are shown.
function readConfig() {
    const source = window.proposalApp.config || {};
    return {
        partnerName: String(source.partnerName || "").trim(),
        hostName: String(source.hostName || "").trim(),
        meetingPlace: String(source.meetingPlace || "").trim(),
        meetingTimeLabel: String(source.meetingTimeLabel || "").trim(),
        meetingDate: String(source.meetingDate || "").trim()
    };
}

function isRealCalendarDate(value) {
    if (!DATE_PATTERN.test(value)) {
        return false;
    }
    const parts = value.split("-");
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function tomorrowStart() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    return date;
}

// Uses tomorrow when the date is blank or not a real calendar day.
function resolveMeetingStart(meetingDate) {
    if (!meetingDate) {
        return tomorrowStart();
    }
    if (!isRealCalendarDate(meetingDate)) {
        console.error("meeting date invalid", { meetingDate: meetingDate });
        return tomorrowStart();
    }
    const parts = meetingDate.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 0, 0, 0, 0);
}

function buildThankYou(hostName) {
    if (!hostName) {
        return "Thank you. I would love to take you out.";
    }
    return "Thank you. " + hostName + " would love to take you out.";
}

function buildPlaceLine(meetingPlace) {
    if (!meetingPlace) {
        return "We'll pick a place together.";
    }
    return "Where: " + meetingPlace;
}

function buildTimeLine(meetingTimeLabel) {
    if (!meetingTimeLabel) {
        return "We'll pick a time together.";
    }
    return "When: " + meetingTimeLabel;
}

// Uses her plan as the place. The config place is only a fallback.
function placeForInvite(config) {
    const plan = window.proposalApp.readChosenPlan();
    if (plan) {
        return plan;
    }
    return config.meetingPlace;
}

function fillInviteCopy() {
    const config = readConfig();
    document.getElementById("invite-message").textContent = buildThankYou(config.hostName);
    document.getElementById("invite-place").textContent = buildPlaceLine(placeForInvite(config));
    document.getElementById("invite-when").textContent = buildTimeLine(config.meetingTimeLabel);
}

function remainingParts(target) {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) {
        return null;
    }
    const totalSeconds = Math.floor(diff / 1000);
    return {
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60
    };
}

// Swaps the four numbers for one line once the target midnight has passed.
function renderCountdown() {
    const parts = remainingParts(meetingTarget);
    const countdown = document.getElementById("invite-countdown");
    const arrived = document.getElementById("invite-arrived");
    if (!parts) {
        countdown.hidden = true;
        arrived.hidden = false;
        stopCountdown();
        return;
    }
    countdown.hidden = false;
    arrived.hidden = true;
    document.getElementById("count-days").textContent = String(parts.days);
    document.getElementById("count-hours").textContent = String(parts.hours);
    document.getElementById("count-minutes").textContent = String(parts.minutes);
    document.getElementById("count-seconds").textContent = String(parts.seconds);
}

function startCountdown() {
    stopCountdown();
    renderCountdown();
    countdownTimerId = window.setInterval(renderCountdown, 1000);
}

function stopCountdown() {
    if (!countdownTimerId) {
        return;
    }
    window.clearInterval(countdownTimerId);
    countdownTimerId = null;
}

// Opens the card and restarts its entrance so a second open still springs in.
function openInvite() {
    try {
        const modal = document.getElementById("invite-modal");
        const card = modal.querySelector(".invite-card");
        meetingTarget = resolveMeetingStart(readConfig().meetingDate);
        fillInviteCopy();
        modal.hidden = false;
        card.classList.remove("is-open");
        window.requestAnimationFrame(function () {
            card.classList.add("is-open");
        });
        startCountdown();
        document.getElementById("invite-close").focus();
    } catch (error) {
        console.error("invite open failed", { message: error && error.message });
    }
}

function closeInvite() {
    const modal = document.getElementById("invite-modal");
    modal.hidden = true;
    modal.querySelector(".invite-card").classList.remove("is-open");
    stopCountdown();
}

function onInviteKeydown(event) {
    const modal = document.getElementById("invite-modal");
    if (event.key === "Escape" && modal && !modal.hidden) {
        closeInvite();
    }
}

function bindInvite() {
    document.getElementById("invite-close").addEventListener("click", closeInvite);
    document.getElementById("invite-backdrop").addEventListener("click", closeInvite);
    document.addEventListener("keydown", onInviteKeydown);
}

window.proposalApp.openInvite = openInvite;
window.proposalApp.bindInvite = bindInvite;
