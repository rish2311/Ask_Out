window.proposalApp = window.proposalApp || {};

const CONFETTI_COLORS = ["#ff4d6d", "#ff8fab", "#ffd166", "#ffffff", "#c9184a"];
const CONFETTI_COUNT = 110;
const CONFETTI_FRAMES = 90;

// Runs a short burst without a library so the page still works offline.
function burstConfetti() {
    try {
        const canvas = createConfettiCanvas();
        const pieces = createConfettiPieces(canvas);
        drawConfetti(canvas, pieces);
    } catch (error) {
        console.error("confetti burst failed", { message: error && error.message });
    }
}

function createConfettiCanvas() {
    const canvas = document.createElement("canvas");
    canvas.className = "confetti-layer";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    return canvas;
}

function createConfettiPieces(canvas) {
    const pieces = [];
    let index = 0;
    while (index < CONFETTI_COUNT) {
        pieces.push({
            x: canvas.width * 0.5,
            y: canvas.height * 0.35,
            vx: (Math.random() - 0.5) * 14,
            vy: Math.random() * -12 - 4,
            size: 6 + Math.random() * 6,
            color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
            rotation: Math.random() * 6
        });
        index += 1;
    }
    return pieces;
}

function drawConfetti(canvas, pieces) {
    const context = canvas.getContext("2d");
    let framesLeft = CONFETTI_FRAMES;

    function paint() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        stepPieces(context, pieces);
        framesLeft -= 1;
        if (framesLeft <= 0) {
            canvas.remove();
            return;
        }
        window.requestAnimationFrame(paint);
    }

    window.requestAnimationFrame(paint);
}

function stepPieces(context, pieces) {
    pieces.forEach(function (piece) {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vy += 0.28;
        piece.rotation += 0.15;
        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.rotation);
        context.fillStyle = piece.color;
        context.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
        context.restore();
    });
}

window.proposalApp.burstConfetti = burstConfetti;
