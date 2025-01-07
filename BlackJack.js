// Zugriff auf die Buttons und Anzeige-Elemente
const startButton = document.querySelector('.start'); 
const restartButton = document.querySelector('.restart');
const hitButton = document.querySelector('.hit');
const stopButton = document.querySelector('.stop');
const betButton = document.querySelector('.bet');

let playerScore = 0;
let dealerScore = 0;
let playerMoney = 100; 
let betAmount = 0;

const moneyParagraph = document.getElementById('playerMoney');
const betParagraph = document.getElementById('betAmount');

// Funktion zur Aktualisierung der Anzeige von Guthaben und Einsatz
function updateMoneyDisplay() {
    moneyParagraph.innerHTML = `Guthaben: $${playerMoney}`;
    betParagraph.innerHTML = `Einsatz: $${betAmount}`;
}

// Funktion, um Karten für den Spieler zu ziehen
function startYou() {
    let randomNumber = Math.floor(Math.random() * 9) + 2;
    let randomNumber2 = Math.floor(Math.random() * 9) + 2;
    playerScore = randomNumber + randomNumber2;

    let paragraph = document.getElementById('you');
    paragraph.innerHTML = `You: ${randomNumber} ${randomNumber2} `; 

    showPlayerScore();
}

// Funktion, um Karten für den Dealer zu ziehen
function startDealer() {
    let randomNumber = Math.floor(Math.random() * 9) + 2;
    let randomNumber2 = Math.floor(Math.random() * 9) + 2;
    dealerScore = randomNumber + randomNumber2;

    let paragraph = document.getElementById('dealer');
    paragraph.innerHTML = `Dealer: ${randomNumber} ${randomNumber2} `; 

    showDealerScore();
}

// Funktion zur Anzeige der Punktzahl des Spielers
function showPlayerScore() {
    let paragraph = document.getElementById('playerScore');
    paragraph.innerHTML = `Deine Punktzahl: ${playerScore}`;
}

// Funktion zur Anzeige der Punktzahl des Dealers
function showDealerScore() {
    let paragraph = document.getElementById('dealerScore');
    paragraph.innerHTML = `Dealers Punktzahl ist: ${dealerScore}`;
}

// EventListener für den Start-Button
startButton.addEventListener('click', () => {
    if (betAmount === 0) {
        window.alert("Setze zuerst einen Einsatz, bevor du startest!");
    } else {
        // Deaktiviere den Start-Button, damit er nicht mehr gedrückt werden kann
        startButton.disabled = true;

        startYou();
        startDealer();
    }
});

// EventListener für den Hit-Button (Spieler zieht Karte)
hitButton.addEventListener('click', () => {
    let randomNumber = Math.floor(Math.random() * 9) + 2;
    playerScore += randomNumber;

    let paragraph = document.getElementById('you');
    paragraph.innerHTML += `${randomNumber} `; 

    // Überprüfe, ob der Spieler mehr als 21 Punkte hat
    if (playerScore > 21) {
        handleResult("lose");
        window.alert(`Du hast verloren! Deine Punktzahl ist über 21! Dein Einsatz von $${betAmount} ist weg.`);
    } else {
        showPlayerScore();
    }
});

// EventListener für den Stop-Button (Spieler stoppt)
stopButton.addEventListener('click', stopYou);

function stopYou() {
    let dealerHits = document.getElementById('dealer');

    // Dealer zieht Karten bis seine Punktzahl 17 oder mehr erreicht
    while (dealerScore < 17) {
        let randomNumber = Math.floor(Math.random() * 9) + 2;
        dealerScore += randomNumber;
        dealerHits.innerHTML += `${randomNumber} `;
    }

    // Dealer's Endpunktzahl anzeigen
    showDealerScore();

    // Überprüfe, ob der Dealer mehr als 21 hat
    if (dealerScore > 21) {
        handleResult("win");
        window.alert(`Dealer hat über 21! Du hast gewonnen! Dein Gewinn beträgt $${betAmount * 2}`);
    } else {
        // Wenn der Dealer nicht mehr als 21 hat, vergleiche die Punktzahlen und bestimme den Gewinner
        determineWinner();
    }
}

// Funktion zur Bestimmung des Gewinners
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

    window.alert(resultMessage);
}

// Funktion zur Handhabung des Spielergebnisses (Gewinn/Verlust/Unentschieden)
function handleResult(result) {
    if (result === "win") {
        playerMoney += betAmount * 2;  // Spieler gewinnt
    } else if (result === "lose") {
        // Spieler verliert, nichts ändern
    } else if (result === "push") {
        playerMoney += betAmount; // Unentschieden, Einsatz zurück
    }

    betAmount = 0;
    updateMoneyDisplay();

    if (playerMoney <= 0) {
        window.alert("Spiel vorbei! Du hast kein Geld mehr.");
        restart();
    }
}

// Funktion zum Neustart des Spiels
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

    // Aktiviert den Start-Button wieder
    startButton.disabled = false;
}

// EventListener für den Restart-Button
restartButton.addEventListener('click', restart);

// Funktion zum Setzen des Einsatzes
function setBet() {
    if (playerMoney >= 10) {
        betAmount += 10;  // Erhöhe den Einsatz um 10
        playerMoney -= 10;  // Reduziere das Guthaben um den Betrag des Einsatzes
        updateMoneyDisplay();  // Aktualisiere die Anzeige für Guthaben und Einsatz
    } else {
        window.alert("Nicht genug Guthaben für diesen Einsatz!");
    }
}

// EventListener für den Setzen des Einsatzes
betButton.addEventListener('click', setBet);

// Initialisiere die Anzeige
updateMoneyDisplay();
