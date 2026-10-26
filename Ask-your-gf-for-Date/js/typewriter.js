window.proposalApp = window.proposalApp || {};

// Builds the opening line so a blank name does not leave a stray comma.
function buildQuestion(partnerName) {
    const name = String(partnerName || "").trim();
    if (!name) {
        return "Will you go out with me?";
    }
    return "Will you go out with me, " + name + "?";
}

// Reveals the buttons only after the question has finished typing.
function showChoices(buttons) {
    buttons.classList.remove("is-waiting");
    buttons.removeAttribute("aria-hidden");
}

// Types the question, or shows it at once when the visitor prefers less motion.
function startTypewriter() {
    const question = document.querySelector(".question");
    const buttons = document.querySelector(".btn-grp");
    const text = buildQuestion(window.proposalApp.config.partnerName);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    buttons.classList.add("is-waiting");
    if (reduceMotion) {
        question.textContent = text;
        showChoices(buttons);
        return;
    }

    let index = 0;
    const timer = window.setInterval(function () {
        index += 1;
        question.textContent = text.slice(0, index);
        if (index >= text.length) {
            window.clearInterval(timer);
            showChoices(buttons);
        }
    }, 70);
}

window.proposalApp.startTypewriter = startTypewriter;
