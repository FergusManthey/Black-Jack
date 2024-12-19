// if you press start 

const startButton = document.querySelector('.start'); 

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

startButton.addEventListener('click', startYou);

startButton.addEventListener('click', startDealer);

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

//if you press restart

const restartButton = document.querySelector('.restart');

// reload the current page
function restart() {
    window.location.reload();
}

restartButton.addEventListener('click', restart);
