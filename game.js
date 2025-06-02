const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const dpr = window.devicePixelRatio || 1;
const width = canvas.clientWidth;
const height = canvas.clientHeight;

canvas.width = width * dpr;
canvas.height = height * dpr;
canvas.style.width = width + "px";
canvas.style.height = height + "px";

ctx.setTransform(1, 0, 0, 1, 0, 0);
ctx.scale(dpr, dpr);

let currentMoney = 100;
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let cardAnimations = [];

let deck = [];
let gameStarted = false;
let uiVisible = false;
let revealDealerCard = false;
let gameMessage = "";
let blackjackFlyX = null;
let showBlackjackAnimation = false;
let roundOver = false;
let betStepOptions = [1, 5, 10, 25, 50]; // mögliche Schrittgrößen
let currentBetStepIndex = 2; // standardmäßig 10

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const uiElements = {
  buttons: [
    { name: "hit", targetX: 100, y: 400, width: 64, height: 32, x: -100 },
    { name: "std", targetX: 200, y: 400, width: 64, height: 32, x: -100 },
    { name: "res", targetX: 300, y: 400, width: 64, height: 32, x: -100 },
    { name: "plus", targetX: 400, y: 400, width: 64, height: 32, x: -100 },
    { name: "minus", targetX: 500, y: 400, width: 64, height: 32, x: -100 },
  ],
  cards: {
    targetXStart: 50,
    currentXStart: -200,
  }
};

let playerHand = [];
let dealerHand = [];

const assets = { ui: {} };
const cardImages = {};
let cardBack = null;

let mouseX = 0;
let mouseY = 0;
let mouseDown = false;

let currentBet = 10;
const minBet = 0;
const maxBet = 1000;

let animationProgress = 0;
let globalOpacity = 0;

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;

  if (!gameStarted) {
    const startX = width / 2;
    const startY = height / 2;
    const startWidth = 200;
    const startHeight = 80;
    if (
      mouseX >= startX - startWidth / 2 &&
      mouseX <= startX + startWidth / 2 &&
      mouseY >= startY - startHeight / 2 &&
      mouseY <= startY + startHeight / 2
    ) {
      canvas.style.cursor = "pointer";
    } else {
      canvas.style.cursor = "default";
    }
  } else {
    let hoveringButton = false;
    uiElements.buttons.forEach(button => {
      if (
        mouseX >= button.x &&
        mouseX <= button.x + button.width &&
        mouseY >= button.y &&
        mouseY <= button.y + button.height
      ) {
        hoveringButton = true;
      }
    });
    canvas.style.cursor = hoveringButton ? "pointer" : "default";
  }
});

canvas.addEventListener("mousedown", () => {
  mouseDown = true;
});

canvas.addEventListener("mouseup", () => {
  mouseDown = false;

  if (!gameStarted) return;

  // Prüfe erst die Auswahl der Schrittgröße
  const baseX = 400;
  const baseY = 440;
  const stepWidth = 40;
  const stepHeight = 30;
  const gap = 10;

  for (let i = 0; i < betStepOptions.length; i++) {
    const x = baseX + i * (stepWidth + gap);
    if (
      mouseX >= x &&
      mouseX <= x + stepWidth &&
      mouseY >= baseY &&
      mouseY <= baseY + stepHeight
    ) {
      currentBetStepIndex = i;
      return; // Auswahl getroffen, Event beenden
    }
  }

  // Buttons abfragen
  uiElements.buttons.forEach(button => {
    if (
      mouseX >= button.x &&
      mouseX <= button.x + button.width &&
      mouseY >= button.y &&
      mouseY <= button.y + button.height
    ) {
      switch (button.name) {
        case "plus":
          increaseBet(betStepOptions[currentBetStepIndex]);
          break;
        case "minus":
          decreaseBet(betStepOptions[currentBetStepIndex]);
          break;
        case "hit":
          hit();
          if (calculateHandValue(playerHand) > 21) {
            gameMessage = "YOU LOSE";
            revealDealerCard = true;
            roundOver = true;  // Runde ist vorbei, wenn Player bustet
          }
          break;
        case "std":
          dealerTurn();
          break;
        case "res":
          if (roundOver) {  // Nur wenn Runde vorbei
            startRound();
          }
          break;
      }
    }
  });
});

canvas.addEventListener("click", () => {
  if (!gameStarted) {
    const startX = width / 2;
    const startY = height / 2;
    const startWidth = 200;
    const startHeight = 80;
    if (
      mouseX >= startX - startWidth / 2 &&
      mouseX <= startX + startWidth / 2 &&
      mouseY >= startY - startHeight / 2 &&
      mouseY <= startY + startHeight / 2
    ) {
      gameStarted = true;
      uiVisible = false;
      animationProgress = 0;
      startRound();
    }
  }
});

function drawStartButton() {
  ctx.font = "48px 'Press Start 2P'";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("START", width / 2, height / 2);
}

function drawBetStepSelector() {
  const baseX = 375; // unter plus-Button (plus Button targetX)
  const baseY = 475; // etwas unter den Buttons
  const stepWidth = 40;
  const stepHeight = 30;
  const gap = 10;

  betStepOptions.forEach((step, i) => {
    const x = baseX + i * (stepWidth + gap);
    const isSelected = i === currentBetStepIndex;

    ctx.fillStyle = isSelected ? "#FFD700" : "#555";
    ctx.fillRect(x, baseY, stepWidth, stepHeight);

    ctx.fillStyle = "white";
    ctx.font = "16px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(step, x + stepWidth / 2, baseY + stepHeight / 2);
  });
}

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function drawCard() {
  if (deck.length === 0) {
    createDeck();
    shuffleDeck();
  }
  return deck.pop();
}

function increaseBet(amount) {
  if (!gameStarted) return;
  if (currentBet + amount <= currentMoney && currentBet + amount <= maxBet) {
    currentBet += amount;
  }
}

function decreaseBet(amount) {
  if (!gameStarted) return;
  currentBet -= amount;
  if (currentBet < minBet) currentBet = minBet;
}

function startRound() {
  roundOver = false;
  showBlackjackAnimation = false;
  blackjackFlyX = null;
  gameMessage = "";
  createDeck();
  shuffleDeck();
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  currentBet = Math.max(currentBet, 10);
  cardAnimations = [];
  revealDealerCard = false;

  if (!uiVisible) {
    animationProgress = 0;
    uiVisible = false; // kannst weglassen, da uiVisible schon false ist
  }

  if (calculateHandValue(playerHand) === 21 && playerHand.length === 2) {
    showBlackjackAnimation = true;
    blackjackFlyX = -300;
    currentMoney += Math.floor(currentBet * 1.5);
    roundOver = true;
  }
}

function calculateHandValue(hand) {
  let value = 0;
  let aceCount = 0;
  for (const card of hand) {
    if (["J", "Q", "K"].includes(card.value)) {
      value += 10;
    } else if (card.value === "A") {
      aceCount++;
      value += 11;
    } else {
      value += parseInt(card.value);
    }
  }
  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }
  return value;
}

function drawButton(name, x, y, width, height) {
  let state = "normal";
  if (
    mouseX >= x &&
    mouseX <= x + width &&
    mouseY >= y &&
    mouseY <= y + height
  ) {
    state = mouseDown ? "click" : "hover";
  }
  const key = `${name}-${state}`;
  const img = assets.ui[key];
  if (img) {
    ctx.drawImage(img, x, y + (state === "click" ? 9 : 0));
  } else {
    ctx.fillStyle = state === "hover" ? "#666" : "#333";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "white";
    ctx.font = "14px PressStart2P";
    ctx.textAlign = "center";
    ctx.fillText(name.toUpperCase(), x + width / 2, y + height / 2 + 5);
  }
}

function animateUI() {
  if (animationProgress < 1) {
    animationProgress += 0.03;

    uiElements.buttons.forEach(button => {
      button.x += (button.targetX - button.x) * 0.1;
    });

    uiElements.buttons.forEach(button => {
      drawButton(button.name, button.x, button.y, button.width, button.height);
    });
    
    drawBetStepSelector();

    uiElements.cards.currentXStart += (uiElements.cards.targetXStart - uiElements.cards.currentXStart) * 0.1;

    globalOpacity = animationProgress;

    if (animationProgress > 0.99) {
      animationProgress = 1;
      uiVisible = true;
    }
  }
}

function hit() {
  if (roundOver) return;  // keine weiteren Karten ziehen wenn Runde vorbei
  const card = drawCard();
  const startX = 300;
  const cardSpacing = 70;
  cardAnimations.push({
    card,
    currentX: -100,
    targetX: startX + playerHand.length * cardSpacing,
    y: 250,
    width: 64,
    height: 96,
  });
  playerHand.push(card);

  if (calculateHandValue(playerHand) > 21) {
    gameMessage = "YOU LOSE";
    revealDealerCard = true;
    roundOver = true;  // Runde ist vorbei, Spieler hat verloren
  }
}
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameStarted) {
    drawStartButton();
    requestAnimationFrame(render);
    return;
  }

  if (!uiVisible) {
    animateUI();
  }
  
  ctx.globalAlpha = globalOpacity;

  uiElements.buttons.forEach(button => {
    drawButton(button.name, button.x, button.y, button.width, button.height);
  });
  
  drawBetStepSelector();
  
  ctx.globalAlpha = 1; // zurücksetzen

  uiElements.buttons.forEach(button => {
    drawButton(button.name, button.x, button.y, button.width, button.height);
  });

  // Spieler-Karten zeichnen (ohne animierte)
  let staticCardsCount = playerHand.length - cardAnimations.length;
  let startX = 300; // Startposition X der Karten, weiter rechts z.B. 100
  let cardSpacing = 70; // Abstand zwischen den Karten, z.B. 60 Pixel enger als 70
  for (let i = 0; i < staticCardsCount; i++) {
    const card = playerHand[i];
    const key = `${card.suit}_${card.value}`;
    const img = cardImages[key];
    if (img) {
      ctx.drawImage(img, startX + i * cardSpacing, 250, 64, 96); // Y auf 130 geändert
    } else {
      ctx.fillStyle = "white";
      ctx.fillRect(startX + i * cardSpacing, 130, 64, 96);
    }
  }

  // Animierte Karten zeichnen & Position aktualisieren
  for (let i = 0; i < cardAnimations.length; i++) {
    const anim = cardAnimations[i];
    const speed = 10; // Geschwindigkeit in Pixel pro Frame

    if (anim.currentX < anim.targetX) {
      anim.currentX += speed;
      if (anim.currentX > anim.targetX) anim.currentX = anim.targetX;
    }

    const key = `${anim.card.suit}_${anim.card.value}`;
    const img = cardImages[key];
    if (img) {
      ctx.drawImage(img, anim.currentX, anim.y, anim.width, anim.height);
    } else {
      ctx.fillStyle = "white";
      ctx.fillRect(anim.currentX, anim.y, anim.width, anim.height);
    }

    // Wenn Animation fertig, aus Array entfernen
    if (anim.currentX === anim.targetX) {
      cardAnimations.splice(i, 1);
      i--;
    }
  }

  const dealerStartX = 300;
  const dealerY = 90;
for (let i = 0; i < dealerHand.length; i++) {
  const card = dealerHand[i];
  // Beispiel: Erste Karte offen, zweite Karte verdeckt
  if (i === 1 && !revealDealerCard) {
    // Zweite Karte verdeckt (Kartenrücken)
    if (cardBack) {
      ctx.drawImage(cardBack, dealerStartX + i * 70, dealerY, 64, 96);
    } else {
      ctx.fillStyle = "gray";
      ctx.fillRect(dealerStartX + i * 70, dealerY, 64, 96);
    }
  } else {
    const key = `${card.suit}_${card.value}`;
    const img = cardImages[key];
    if (img) {
      ctx.drawImage(img, dealerStartX + i * 70, dealerY, 64, 96);
    } else {
      ctx.fillStyle = "white";
      ctx.fillRect(dealerStartX + i * 70, dealerY, 64, 96);
    }
  }
}

if (gameMessage) {
  ctx.font = "48px 'Press Start 2P'";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText(gameMessage, width / 2, height / 2 - 100);
}

  ctx.globalAlpha = 1;
  ctx.font = "16px 'Press Start 2P'";
  ctx.fillStyle = "white";
  ctx.fillText(`EINSATZ: $${currentBet}`, 150, 50);
  ctx.fillText(`GELD: $${currentMoney}`, 650, 50);
  if (showBlackjackAnimation) {
    blackjackFlyX += 8; // Geschwindigkeit der Animation
    ctx.font = "36px 'Press Start 2P'";
    ctx.fillStyle = "#FFD700"; // Goldgelb
    ctx.textAlign = "left";
    ctx.fillText("BLACKJACK!", blackjackFlyX, height / 2 - 150);
  
    if (blackjackFlyX > width + 300) {
      showBlackjackAnimation = false;
    }
  }

  requestAnimationFrame(render);
}

async function loadCardImages() {
  for (let suit of suits) {
    for (let value of values) {
      const key = `${suit}_${value}`;
      cardImages[key] = await loadImage(`assets/cards/${key}.png`);
    }
  }
  cardBack = await loadImage('assets/cards/back.png');
}

async function loadAssets() {
  const buttonNames = ["hit", "std", "res", "plus", "minus"];
  const states = ["normal", "hover", "click"];

  for (let name of buttonNames) {
    for (let state of states) {
      const key = `${name}-${state}`;
      try {
        assets.ui[key] = await loadImage(`assets/ui/${key}.png`)
      } catch {
        console.warn(`Fehlendes Asset: ${key}`);
      }
    }
  }
  await loadCardImages();
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

(async () => {
  await loadAssets();
  render();
})();

async function dealerTurn() {
  if (roundOver) return;  // Wenn Runde vorbei, nicht nochmal ausführen
  revealDealerCard = true;
  await sleep(500);

  while (calculateHandValue(dealerHand) < 17) {
    dealerHand.push(drawCard());
    await sleep(500);
  }

  const dealerValue = calculateHandValue(dealerHand);
  const playerValue = calculateHandValue(playerHand);

  if (dealerValue > 21 || dealerValue < playerValue) {
    gameMessage = "YOU WIN";
    currentMoney += currentBet;
  } else if (dealerValue > playerValue) {
    gameMessage = "YOU LOSE";
    currentMoney -= currentBet;
  } else {
    gameMessage = "PUSH";
  }
  roundOver = true;  // Runde ist jetzt vorbei
}



function animateUI() {
  if (animationProgress < 1) {
    animationProgress += 0.03;
    uiElements.buttons.forEach(button => {
      button.x += (button.targetX - button.x) * 0.1;
    });
    uiElements.cards.currentXStart += (uiElements.cards.targetXStart - uiElements.cards.currentXStart) * 0.1;
    globalOpacity = animationProgress;

    if (animationProgress > 0.99) {
      animationProgress = 1;
      uiVisible = true;
      console.log("UI visible now!");
    }
  }
}