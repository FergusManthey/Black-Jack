// if you press start 

const startButton = document.querySelector('.start'); 
const restartButton = document.querySelector('.restart')

let playerScore = 0;
let dealerScore = 0;

function startYou() {
    let randomNumber = Math.floor(Math.random() * 9) + 2;
    let randomNumber2 = Math.floor(Math.random() * 9) + 2;
    playerScore = playerScore + randomNumber;
    playerScore = playerScore + randomNumber2;
    let paragraph = document.getElementById('you');
    paragraph.innerHTML += randomNumber + "&nbsp;" + "&nbsp;" + "&nbsp;";
    paragraph.innerHTML += randomNumber2 + "&nbsp;" + "&nbsp;" + "&nbsp;";
    showPlayerScore()
};

function startDealer() {
    let randomNumber = Math.floor(Math.random() * 9) + 2;
    let randomNumber2 = Math.floor(Math.random() * 9) + 2;
    dealerScore = dealerScore + randomNumber;
    dealerScore = dealerScore + randomNumber2;
    let paragraph = document.getElementById('dealer');
    paragraph.innerHTML += randomNumber + "&nbsp;" + "&nbsp;" + "&nbsp;";
    paragraph.innerHTML += randomNumber2 + "&nbsp;" + "&nbsp;" + "&nbsp;";
    showDealerScore()
};

function showPlayerScore() {
    let paragraph = document.getElementById('playerScore');
    paragraph.innerHTML ='Deine Punktzahl:' + '&nbsp;' + playerScore + "&nbsp;";
};

function showDealerScore() {
    let paragraph = document.getElementById('dealerScore');
    paragraph.innerHTML ='Dealers Punktzahl ist:' + '&nbsp;' + dealerScore + "&nbsp;";
};

startButton.addEventListener('click', () => {
    if (betAmount === 0) {
    } else {
        startYou();
        startDealer();
    }
});

// if you press Hit

const hitButton = document.querySelector('.hit');

function hitYou() {
    let randomNumber2 = Math.floor(Math.random() * 9) + 2;
    playerScore = randomNumber2 + playerScore;
    let paragraph = document.getElementById('you');
    paragraph.innerHTML += randomNumber2 + "&nbsp;" + "&nbsp;" + "&nbsp;";
    hitscore()

    if (playerScore > 21) {
        console.log(playerScore)
        window.alert("You bust! Dealer wins.")
    }
    if (playerScore === 21) {
        window.alert("You win.")
    }
}

function hitscore() {
    let paragraph = document.getElementById('playerScore');
    paragraph.innerHTML ='Deine Punktzahl:' + '&nbsp;' + playerScore + "&nbsp;";
}

hitButton.addEventListener('click', hitYou);

// if you press stop

const stopButton = document.querySelector('.stop');

function stopYou() {
    let dealerHits = document.getElementById('dealer');
    
    while (dealerScore < 17) { // Dealer zieht Karten, bis mindestens 17 Punkte erreicht sind
        let randomNumber2 = Math.floor(Math.random() * 9) + 2;
        dealerScore += randomNumber2;
        dealerHits.innerHTML += randomNumber2 + "&nbsp;" + "&nbsp;" + "&nbsp;";
    }

    if (dealerScore < playerScore) {
        let randomNumber2 = Math.floor(Math.random() * 9) + 2;
        dealerScore += randomNumber2;
        dealerHits.innerHTML += randomNumber2 + "&nbsp;" + "&nbsp;" + "&nbsp;";
    }

    // Aktuellen Punktestand des Dealers anzeigen
    let paragraph = document.getElementById('dealerScore');
    paragraph.innerHTML = 'Dealers Punktzahl ist:' + '&nbsp;' + dealerScore + "&nbsp;";

    // Ergebnis anzeigen
    if (dealerScore > 21) {
        window.alert("Dealer bust! You win.");
    } else if (dealerScore >= playerScore) {
        window.alert("Dealer wins!");
    } else {
        window.alert("You win!");
    }

    if (dealerScore === playerScore) {
        window.alert("PUSH")
    }
}

stopButton.addEventListener('click', stopYou);

// Wenn der Restart-Button gedrückt wird
function restart() {
    // Punktzahlen zurücksetzen
    playerScore = 0;
    dealerScore = 0;

    // Die HTML-Elemente für Spieler und Dealer zurücksetzen
    document.getElementById('you').innerHTML = '';
    document.getElementById('dealer').innerHTML = '';
    document.getElementById('playerScore').innerHTML = 'Deine Punktzahl: 0';
    document.getElementById('dealerScore').innerHTML = 'Dealers Punktzahl ist: 0';

    // Einsatz zurücksetzen
    betAmount = 0;
    betParagraph.innerHTML = 'Einsatz: $0';

    // Zeige das Guthaben an
    updateMoneyDisplay();
    
    // Eventuelle Benachrichtigungen entfernen
    window.alert("Das Spiel wurde zurückgesetzt. Du kannst einen neuen Einsatz setzen und das Spiel erneut starten.");
}

// Ereignis für den Restart-Button
restartButton.addEventListener('click', restart);


// Startkapital und Einsatz
let playerMoney = 100; // Startguthaben
let betAmount = 0; // Aktueller Einsatz

// HTML-Elemente für Guthaben und Einsatz
const moneyParagraph = document.getElementById('playerMoney');
const betParagraph = document.getElementById('betAmount');
const betButton = document.querySelector('.bet');

// Funktion zum Aktualisieren der Guthabenanzeige
function updateMoneyDisplay() {
    moneyParagraph.innerHTML = `Guthaben: $${playerMoney}`;
    betParagraph.innerHTML = `Einsatz: $${betAmount}`;
}

// Funktion zum Setzen eines Einsatzes
function setBet() {
    if (playerMoney >= 10) { // Mindesteinsatz prüfen
        betAmount += 10;
        playerMoney -= 10;
        updateMoneyDisplay();
    } else {
        window.alert("Nicht genug Guthaben für diesen Einsatz!");
    }
}

// Gewinne oder Verluste verrechnen
function handleResult(result) {
    if (result === "win") {
        playerMoney += betAmount * 2; // Spieler gewinnt das Doppelte seines Einsatzes
        window.alert(`Du hast gewonnen! Dein Gewinn beträgt $${betAmount * 2}`);
    } else if (result === "lose") {
        window.alert(`Du hast verloren! Dein Einsatz von $${betAmount} ist weg.`);
    } else if (result === "push") {
        playerMoney += betAmount; // Einsatz zurück bei Unentschieden
        window.alert("Unentschieden! Einsatz zurückerstattet.");
    }
    betAmount = 0; // Einsatz zurücksetzen
    updateMoneyDisplay();

    if (playerMoney <= 0) {
        window.alert("Spiel vorbei! Du hast kein Geld mehr.");
        restart();
    }
}

// Start-Button erweitern
startButton.addEventListener('click', () => {
    if (betAmount === 0) {
        window.alert("Setze zuerst einen Einsatz, bevor du startest!");
        return;
    }
});


stopButton.addEventListener('click', () => {
    stopYou();
    if (dealerScore > 21 || playerScore > dealerScore) {
        handleResult("win");
    } else if (dealerScore === playerScore) {
        handleResult("push");
    } else {
        handleResult("lose");
    }
});


betButton.addEventListener('click', setBet);


updateMoneyDisplay();
