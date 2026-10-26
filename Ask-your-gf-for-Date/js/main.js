let yesAlreadyAccepted = false;

// Wires the page once the markup and the other scripts are ready.
function startProposalPage() {
    try {
        window.proposalApp.startTypewriter();
        window.proposalApp.bindNoButton();
        window.proposalApp.bindMusic();
        window.proposalApp.bindInvite();
        window.proposalApp.bindPlan();
        document.querySelector(".yes-btn").addEventListener("click", onYesClick);
    } catch (error) {
        console.error("proposal start failed", { message: error && error.message });
    }
}

// Yes does not open the card yet. It only reveals the two plans.
function onYesClick() {
    if (yesAlreadyAccepted) {
        return;
    }
    try {
        yesAlreadyAccepted = true;
        window.proposalApp.showPlanStep();
    } catch (error) {
        yesAlreadyAccepted = false;
        console.error("yes click failed", { message: error && error.message });
    }
}

// Runs after one plan is picked: celebration, confetti, then the invitation card.
function finishDate() {
    try {
        document.querySelector(".question").textContent = "Yay, See you tomorrow!";
        const gif = document.querySelector(".gif");
        gif.src = "image/dance.gif";
        gif.alt = "Celebrating";
        document.querySelector(".no-btn").hidden = true;
        document.getElementById("music-nudge").hidden = true;
        window.proposalApp.burstConfetti();
        window.proposalApp.openInvite();
    } catch (error) {
        console.error("date finish failed", { message: error && error.message });
    }
}

window.proposalApp.finishDate = finishDate;
startProposalPage();
