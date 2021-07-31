const $ = $ => document.querySelector($);
const random = max => Math.floor(Math.random() * max);
const imagesArray = ["circle", "down-arrow", "heart", "hexagon", "home", "left-arrow", "lighting", "oval-callout", "pentagon", "rectangle", "rhombus", "right-arrow", "rounded-rectangle", "rounded-square", "square", "star", "triangle", "up-arrow"];

function show(id){
    const text = $("#"+id);
    const para = text.parentNode;
    para.classList.add("hide");

    doAfter(() => {
        para.classList.remove("hide");
        text.innerHTML = gameInfo[id];
    }, 0.7);
}


function makeElement(element, classes, attributes, text) {
    element = document.createElement(element);

    if(classes) {
        classes = classes.split(" ");
        classes.forEach(className => {
            element.classList.add(className);
        });
    }
    if(attributes) {
        for(let attribute in attributes) {
            element.setAttribute(attribute, attributes[attribute]);
        }
    }

    if(text) element.innerHTML = text;

    return element;
}

function getUnique(arr, no) {
    const cards = arr.map(i => i);

    cards.sort(() => Math.random() - 0.5);
    cards.length = no;

    return cards;
}

function generateGameInfo(game) {
    switch(game.level) {
        case 1:
            game.side = 4;
            game.match  = 2;
        break;

        case 2:
            game.side = 6;
            game.match  = 2;
        break;

        case 3:
            game.side = 3;
            game.match  = 3;
        break;

        case 4:
            game.side = 4;
            game.match  = 4;
        break;

        case 5:
            game.side = 6;
            game.match  = 3;
        break;

        case 6:
            game.side = 6;
            game.match  = 4;
        break;

        case 7:
            game.side = 5;
            game.match  = 5;
        break;

        case 8:
            game.side = 6;
            game.match  = 6;
        break;

        case 9:
            game.side = 7;
            game.match  = 7;
        break;
    }

    const itemsNo = game.side*game.side;
    const imgNo = itemsNo/game.match;
    game.cards = [];

    while(game.cards.length < itemsNo) {
        const uniqueItems = getUnique(imagesArray, imgNo);

        for(let i=0; i<itemsNo/imgNo; i++) {
            game.cards.push(...uniqueItems);
        }
    }
    game.levelScore = 0;
    game.maxScore = imgNo;
    game.cards.sort(() => Math.random() - 0.5);
} 

function loadImg(box, img) {
    const loader = makeElement("div", "loader");

    box.appendChild(loader);

    img.onload = function() {
        box.replaceChild(this, loader);
    }
}

function levelUpMessage(msg, level) {
    let title = "Level Completed";
    let text = `You have successfully completed level ${level}, press the button below to start level ${level+1}.`;
    let btn = "Start level "+(level+1);

    if(level === 9) {
        title = "Congratulation";
        text = "You have successfully completed all levels.";
        btn = "Play Again";
    }
    
    msg.title.innerHTML = title;
    msg.body.innerHTML = text;
    msg.btn.innerHTML = btn;
}
function gameOverMessage(msg, score) {
    msg.title.innerHTML = "Game Over";
    msg.body.innerHTML = `You have lost all your trials, with ${score} score. Press the button below to try again.`;
    msg.btn.innerHTML = "Try Again.";
}

function createBoard() {
    const cardArray = gameInfo.cards;
    
    gameBoard.className = `_${gameInfo.side}_by_${gameInfo.side}`;
    gameBoard.innerHTML = "";

    for(let i=0; i<cardArray.length; i++) {
        const card = makeElement("div", "card open", {"data-id":i});
        const content = makeElement("div", "content");
        const front = makeElement("div", "front");
        const back = makeElement("div", "back");
        const blankImg = makeElement("img", "card-img", {
            "src":`images/blank.png`,
            "alt": cardArray[i],
            "data-id":i
        });
        const cardImg = makeElement("img", "card-img", {
            "src":`images/${cardArray[i]}.png`,
            "alt": cardArray[i]
        });

        // Append images and event listener
        blankImg.addEventListener("click", chooseCard);
        loadImg(front, blankImg);
        loadImg(back, cardImg);


        content.appendChild(front);
        content.appendChild(back);
        card.appendChild(content);
        gameBoard.appendChild(card);
        blankImgs.push(blankImg);
        cards.push(card);
        doAfter(() => {
            card.classList.remove("open");
        }, gameInfo.match);
    }
}

function doAfter(func, sec, ...arg) {
    const delay = setTimeout(() => {
        func(...arg);
        clearTimeout(delay);
    }, sec*1000);
}