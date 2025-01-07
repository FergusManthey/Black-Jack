const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');

let playerScore = 0;
let dealerScore = 0;
let playerMoney = 100;
let betAmount = 0;

const moneyParagraph = document.getElementById('playerMoney');
const betParagraph = document.getElementById('betAmount');
const betButton = document.querySelector('.bet');

function updateMoneyDisplay() {
    moneyParagraph.innerHTML = `Guthaben: $${playerMoney}`;
    betParagraph.innerHTML = `Einsatz: $${betAmount}`;
}

function startYou() {
    // Startkarten für den Spieler ziehen
    let randomNumber1 = Math.floor(Math.random() * 9) + 2;
    let randomNumber2 = Math.floor(Math.random() * 9) + 2;
    playerScore = randomNumber1 + randomNumber2;
    
    // Karten werden dem bestehenden Inhalt hinzugefügt
    let paragraph = document.getElementById('you');
    paragraph.innerHTML = `${randomNumber1} &nbsp;&nbsp;&nbsp; ${randomNumber2} &nbsp;&nbsp;&nbsp;`;

    showPlayerScore();
};

function startDealer() {
    // Startkarten für den Dealer ziehen
    let randomNumber1 = Math.floor(Math.random() * 9) + 2;
    let randomNumber2 = Math.floor(Math.random() * 9) + 2;
    dealerScore = randomNumber1 + randomNumber2;
    
    // Karten werden dem bestehenden Inhalt hinzugefügt
    let paragraph = document.getElementById('dealer');
    paragraph.innerHTML = `${randomNumber1} &nbsp;&nbsp;&nbsp; ${randomNumber2} &nbsp;&nbsp;&nbsp;`;

    showDealerScore();
};

function showPlayerScore() {
    let paragraph = document.getElementById('playerScore');
    paragraph.innerHTML = `Deine Punktzahl: ${playerScore} &nbsp;`;
};

function showDealerScore() {
    let paragraph = document.getElementById('dealerScore');
    paragraph.innerHTML = `Dealers Punktzahl ist: ${dealerScore} &nbsp;`;
};

startButton.addEventListener('click', () => {
    if (betAmount === 0) {
        window.alert("Setze zuerst einen Einsatz, bevor du startest!");
    } else {
        startYou();
        startDealer();
    }
});

const hitButton = document.querySelector('.hit');

function hitYou() {
    let randomNumber = Math.floor(Math.random() * 9) + 2;
    playerScore += randomNumber;

    let paragraph = document.getElementById('you');
    paragraph.innerHTML += `${randomNumber} &nbsp;&nbsp;&nbsp;`;

    hitscore();
}

function hitscore() {
    let paragraph = document.getElementById('playerScore');
    paragraph.innerHTML = `Deine Punktzahl: ${playerScore} &nbsp;`;
}

hitButton.addEventListener('click', hitYou);

const stopButton = document.querySelector('.stop');

stopButton.addEventListener('click', () => {
    if (playerScore <= 21) {
        stopYou();  // Wenn der Spieler nicht über 21 ist, kann er stoppen
    } else {
        window.alert("Du hast bereits über 21 Punkte! Das Spiel ist vorbei.");
    }
});

// Wenn du auf "Stop" drückst, wird der Dealer seinen Zug machen.
function stopYou() {
    let dealerHits = document.getElementById('dealer');
    
    // Dealer zieht Karten, bis mindestens 17 Punkte erreicht sind.
    while (dealerScore < 17) {
        let randomNumber = Math.floor(Math.random() * 9) + 2;
        dealerScore += randomNumber;
        dealerHits.innerHTML += `${randomNumber} &nbsp;&nbsp;&nbsp;`;
    }

    // Zeige die endgültige Punktzahl des Dealers an.
    let paragraph = document.getElementById('dealerScore');
    paragraph.innerHTML = `Dealers Punktzahl ist: ${dealerScore} &nbsp;`;

    // Überprüfe, ob der Dealer mehr als 21 Punkte hat
    if (dealerScore > 21) {
        let resultMessage = `Dealer hat über 21! Du hast gewonnen! Dein Gewinn beträgt $${betAmount * 2}`;
        handleResult("win");
        window.alert(resultMessage);
    } else {
        // Wenn der Dealer weniger als 21 Punkte hat, überprüfe die Spielergebnisse
        determineWinner();
    }
}

// Diese Funktion entscheidet den Gewinner basierend auf den Punktzahlen.
function determineWinner() {
    let resultMessage = '';

    if (playerScore > 21) {
        resultMessage = `Du hast verloren! Deine Punktzahl ist über 21! Dein Einsatz von $${betAmount} ist weg.`;
        handleResult("lose");
    } else if (dealerScore > playerScore) {
        resultMessage = `Dealer gewinnt mit ${dealerScore} Punkten! Dein Einsatz von $${betAmount} ist weg.`;
        handleResult("lose");
    } else if (dealerScore === playerScore) {
        resultMessage = "Unentschieden! Dein Einsatz wird zurückerstattet.";
        handleResult("push");
    } else {
        resultMessage = `Du hast gewonnen mit ${playerScore} Punkten! Dein Gewinn beträgt $${betAmount * 2}`;
        handleResult("win");
    }

    // Zeige die resultierende Nachricht an
    window.alert(resultMessage);
}

// Wenn der Spieler das Spiel gewonnen hat, wird das Guthaben angepasst
function handleResult(result) {
    if (result === "win") {
        playerMoney += betAmount * 2;  // Spieler gewinnt
    } else if (result === "lose") {
        // Spieler verliert, nichts ändern
    } else if (result === "push") {
        playerMoney += betAmount; // Unentschieden, Einsatz zurück
    }

    betAmount = 0;  // Einsatz zurücksetzen
    updateMoneyDisplay();  // Guthaben und Einsatz aktualisieren

    // Wenn der Spieler kein Geld mehr hat
    if (playerMoney <= 0) {
        window.alert("Spiel vorbei! Du hast kein Geld mehr.");
        restart();
    }
}

function restart() {
    playerScore = 0;
    dealerScore = 0;
    document.getElementById('you').innerHTML = '';
    document.getElementById('dealer').innerHTML = '';
    document.getElementById('playerScore').innerHTML = 'Deine Punktzahl: 0';
    document.getElementById('dealerScore').innerHTML = 'Dealers Punktzahl ist: 0';
    betAmount = 0;
    betParagraph.innerHTML = 'Einsatz: $0';
    updateMoneyDisplay();
}

restartButton.addEventListener('click', restart);

function setBet() {
    if (playerMoney >= 10) {
        betAmount += 10;
        playerMoney -= 10;
        updateMoneyDisplay();
    } else {
        window.alert("Nicht genug Guthaben für diesen Einsatz!");
    }
}

betButton.addEventListener('click', setBet);

updateMoneyDisplay();
