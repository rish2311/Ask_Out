# Proposal page

Edit the values in `js/config.js`. The page reads them once when it loads. Refresh after a change.

## Variables

`partnerName` is the name in the opening question. `"Shreya"` produces "Will you go out with me, Shreya?". An empty string keeps "Will you go out with me?".

`hostName` is your name on the invitation card. `"Dattu"` produces "Thank you. Dattu would love to take you out." An empty string produces "Thank you. I would love to take you out."

`meetingPlace` is the where line. A filled value is shown as "Where: ...". An empty string is shown as "We'll pick a place together."

`meetingTimeLabel` is the when line as plain text, for example `"the weekend"` or `"7:00 PM"`. It is not parsed. A filled value is shown as "When: ...". An empty string is shown as "We'll pick a time together."

`meetingDate` is the countdown target, written `YYYY-MM-DD`. The timer counts down to midnight at the start of that local day. `"2026-10-31"` is the Saturday that starts that weekend. An empty string, or a value that is not a real calendar date, counts down to tomorrow instead. An invalid value is logged as `meeting date invalid`.

`yesScale` starts at `1`. It is not a copy setting. The No button updates it.

`chosenPlan` starts as `""`. It is not a copy setting. A click on Go karting or Wonderla sets it to that label. Any other value is ignored, and the card falls back to `meetingPlace`.

## What changed

The question types in, then the Yes and No buttons appear. If the browser asks for reduced motion, the full question and the buttons show immediately.

No jumps to a random spot on hover, and on the first touch on a phone. Each jump grows Yes by 10 percent, up to twice its starting size. Yes is pulled back to center on the first jump so the empty margin beside No does not leave it shifted.

Yes is one click. It hides Yes and No and asks "Go karting or Wonderla?". She picks one. That label is stored in `chosenPlan` and shown on the card as "Where: Go karting" or "Where: Wonderla". Then the heading becomes "Yay, See you tomorrow!", the gif changes to the dance gif, No hides, confetti runs, and the invitation opens. The thank-you line lives on that card. Closing the card stops the countdown.

The card springs in over about 550ms, with a rose row above the title and four large countdown numbers. Reduced motion shows the card in place with no animation.

Music does not autoplay. "Tap to play the song" stays until playback actually starts. The play and pause icon follows the audio element, including a play that the browser blocks.
