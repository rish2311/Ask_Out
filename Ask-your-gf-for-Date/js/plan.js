window.proposalApp = window.proposalApp || {};

// The only two plans the page will accept from a click.
const PLAN_CHOICES = ["Go karting", "Wonderla"];
let planAlreadyChosen = false;

function isKnownPlan(plan) {
    return PLAN_CHOICES.indexOf(plan) !== -1;
}

// Returns the picked plan, or a blank string when nothing valid was picked yet.
function readChosenPlan() {
    const plan = String(window.proposalApp.chosenPlan || "").trim();
    if (!isKnownPlan(plan)) {
        return "";
    }
    return plan;
}

// Hides Yes and No so she can pick one plan before the invite opens.
function showPlanStep() {
    document.querySelector(".question").textContent = "Go karting or Wonderla?";
    document.querySelector(".btn-grp").hidden = true;
    document.getElementById("plan-grp").hidden = false;
}

function onPlanClick(event) {
    if (planAlreadyChosen) {
        return;
    }
    const plan = event.currentTarget.getAttribute("data-plan");
    if (!isKnownPlan(plan)) {
        console.error("plan choice invalid", { plan: plan });
        return;
    }
    try {
        planAlreadyChosen = true;
        window.proposalApp.chosenPlan = plan;
        document.getElementById("plan-grp").hidden = true;
        window.proposalApp.finishDate();
    } catch (error) {
        planAlreadyChosen = false;
        console.error("plan click failed", { message: error && error.message });
    }
}

function bindPlan() {
    const buttons = document.querySelectorAll(".plan-btn");
    buttons.forEach(function (button) {
        button.addEventListener("click", onPlanClick);
    });
}

window.proposalApp.readChosenPlan = readChosenPlan;
window.proposalApp.showPlanStep = showPlanStep;
window.proposalApp.bindPlan = bindPlan;
