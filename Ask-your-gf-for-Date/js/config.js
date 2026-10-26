window.proposalApp = window.proposalApp || {};

// Starting scale for Yes. Each No dodge multiplies this by 1.1, and it never passes 2.
window.proposalApp.yesScale = 1;

// Filled when she picks Go karting or Wonderla. Blank until that click.
window.proposalApp.chosenPlan = "";

window.proposalApp.config = {
  // Name typed into the question. Blank keeps "Will you go out with me?"
  partnerName: "Mansi",
  // Name in the card thank-you line. Blank uses "I" instead of a name.
  hostName: "Mastikhor",
  // Place shown on the card. Blank becomes "We'll pick a place together."
  meetingPlace: "",
  // When line, shown as written. Blank becomes "We'll pick a time together."
  meetingTimeLabel: "the weekend",
  // Countdown target as YYYY-MM-DD at local midnight. Oct 31 2026 is Saturday, the start of that weekend.
  meetingDate: "2026-10-31"
};
