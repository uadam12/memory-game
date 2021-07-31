let cardsChosen, cards;
const blankImgs = [];
const gameInfo = {
    score:0,
    trials:70,
    level:0,
    checking:false
};
const msg = {
    title:$(".message > h3"),
    body:$(".message > p"),
    btn:$(".message > button")
}

const gameBoard = $("#game-board");
const startBtn = $("#start");
const msgBox = $(".overlay");

function showMessage() {
    startBtn.disabled = false;
    msgBox.classList.remove("hide");
}
// Start the game 
function start() {
    startBtn.disabled = true;
    if(gameInfo.level >= 9 || gameInfo.trials <= 0)
    return location.reload();
    
    msgBox.classList.add("hide");
    cards = [];
    cardsChosen = [];
    gameInfo.level++;
    gameInfo.trials += 30;

    generateGameInfo(gameInfo, imagesArray);
    show("score");
    show("trials")
    show("level");
    createBoard();
}

// Check for match
function checkForMatch() {
    const userChoice = cardsChosen[0].name;
    const matchFound = cardsChosen.every(item => item.name === userChoice);

    if(matchFound) {
        if(cardsChosen.length === gameInfo.match) {
            gameInfo.levelScore++;
            gameInfo.score += 5;

            clearChoice(matchFound);
            show("score");
        }

        if(gameInfo.levelScore >= gameInfo.maxScore) {
            
            levelUpMessage(msg, gameInfo.level);
            showMessage();
        }
    } else {
        clearChoice(matchFound);
        
        
        if(--gameInfo.trials <= 0) {
            gameOverMessage(msg, gameInfo.score);
            showMessage();
        }
        show("trials");
    }
}

function clearChoice(matchFound) {
    gameInfo.checking = true;
    doAfter(() => {
        cardsChosen.forEach(item => {
            $(`.card[data-id='${item.id}']`).classList.remove("open");
        });

        gameInfo.checking = false;

        if(matchFound) {
            cardsChosen.forEach(cardData => {
                cards[cardData.id].firstElementChild.innerHTML = "";
            });
        }
        cardsChosen = [];
    }, 1);
}
// choose card 
function chooseCard(e) {
    if(gameInfo.checking) return;

    const blank = e.target;
    const id = blank.dataset.id;
    const card = blank.parentNode.parentNode.parentNode;

    card.classList.add("open");
    cardsChosen.push({
        id:id,
        name:gameInfo.cards[id]
    });
    // Check for match
    if(cardsChosen.length > 1) checkForMatch();
}

startBtn.addEventListener("click", start);