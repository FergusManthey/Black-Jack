// if you press start
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
    let randomNumber = Math.floor(Math.random() * 9) + 2;
    let randomNumber2 = Math.floor(Math.random() * 9) + 2;
    playerScore = playerScore + randomNumber + randomNumber2;
    
    let paragraph = document.getElementById('you');
    paragraph.innerHTML += randomNumber + "&nbsp;" + "&nbsp;" + "&nbsp;";
    paragraph.innerHTML += randomNumber2 + "&nbsp;" + "&nbsp;" + "&nbsp;";
    
    showPlayerScore();
};

function startDealer() {
    let randomNumber = Math.floor(Math.random() * 9) + 2;
    let randomNumber2 = Math.floor(Math.random() * 9) + 2;
    dealerScore = dealerScore + randomNumber + randomNumber2;
    
    let paragraph = document.getElementById('dealer');
    paragraph.innerHTML += randomNumber + "&nbsp;" + "&nbsp;" + "&nbsp;";
    paragraph.innerHTML += randomNumber2 + "&nbsp;" + "&nbsp;" + "&nbsp;";
    
    showDealerScore();
};

function showPlayerScore() {
    let paragraph = document.getElementById('playerScore');
    paragraph.innerHTML = 'Deine Punktzahl:' + '&nbsp;' + playerScore + "&nbsp;";
};

function showDealerScore() {
    let paragraph = document.getElementById('dealerScore');
    paragraph.innerHTML = 'Dealers Punktzahl ist:' + '&nbsp;' + dealerScore + "&nbsp;";
};

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

// Verhindern, dass der Start-Button erneut gedrückt werden kann, bis das Spiel zurückgesetzt wird

const hitButton = document.querySelector('.hit');

function hitYou() {
    let randomNumber2 = Math.floor(Math.random() * 9) + 2;
    playerScore = randomNumber2 + playerScore;
    
    let paragraph = document.getElementById('you');
    paragraph.innerHTML += randomNumber2 + "&nbsp;" + "&nbsp;" + "&nbsp;";
    
    // Überprüfe, ob der Spieler mehr als 21 Punkte hat
    if (playerScore > 21) {
        let resultMessage = `Du hast verloren! Deine Punktzahl ist über 21! Dein Einsatz von $${betAmount} ist weg.`;
        handleResult("lose");
        window.alert(resultMessage); // Anzeige der Nachricht, dass der Spieler verloren hat
    }

    hitscore();  // Aktualisiere die Anzeige der Punktzahl
}

function hitscore() {
    let paragraph = document.getElementById('playerScore');
    paragraph.innerHTML = 'Deine Punktzahl:' + '&nbsp;' + playerScore + "&nbsp;";
}

hitButton.addEventListener('click', hitYou);

const stopButton = document.querySelector('.stop');

function stopYou() {
    let dealerHits = document.getElementById('dealer');
    
    while (dealerScore < 17) {
        let randomNumber = Math.floor(Math.random() * 9) + 2;
        dealerScore += randomNumber;
        dealerHits.innerHTML += `${randomNumber} &nbsp;&nbsp;&nbsp;`;
    }

    let paragraph = document.getElementById('dealerScore');
    paragraph.innerHTML = `Dealers Punktzahl ist: ${dealerScore} &nbsp;`;

    if (dealerScore > 21) {
        let resultMessage = `Dealer hat über 21! Du hast gewonnen! Dein Gewinn beträgt $${betAmount * 2}`;
        handleResult("win");
        window.alert(resultMessage);
    } else {
        determineWinner();
    }
}

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
