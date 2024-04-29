
let dealerSum = 0;
let yourSum = 0;
let aiSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0; 
let aiAceCount = 0;

let hidden;
let deck;

let aiCanHit = true;
let aiWillHit = false;

let lastCards = [0,1]; // Add functionality to previous Cards
let secondToLastCards = [0,1];
let possibleCards = 0;

let closeToScore = 0;
let tempValue = 0;

var network = new brain.NeuralNetwork({ hiddenLayers: [5] }) ;

let canHit = true; //allows the player (you) to draw while yourSum <= 21

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); 
        let temp = deck[i]; // Will select a random card from the deck and will swap
        deck[i] = deck[j]; // based on the for loop's 'i' value
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerSum);
    
        //<img src="./cards/4-C.png">
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    

    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        tempValue = getValue(card);
        yourSum += tempValue;
        if (i == 0) {
            secondToLastCards[1] = tempValue;
        }
        else {
            lastCards[1] = tempValue;
        }
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
        document.getElementById("your-sum").innerText = yourSum;
    }

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        tempValue = getValue(card);
        aiSum += tempValue;
        if (i == 0) {
            secondToLastCards[0] = tempValue;
        }
        else {
            lastCards[0] = tempValue;
        }
        aiAceCount += checkAce(card);
        document.getElementById("ai-cards").append(cardImg);
        document.getElementById("ai-sum").innerText = aiSum;
    }

    console.log(yourSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);

}

function hit() {
    if (!canHit) {
        return;
    }

    if (yourSum > 21) {
        // If player has already busted, do nothing
        return;
    }

    recordPreviousCards();
    console.log(lastCards);
    console.log(secondToLastCards);

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    tempValue = getValue(card);
    yourSum += tempValue;
    lastCards[1] = tempValue;
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
    document.getElementById("your-sum").innerText = yourSum;

    console.log(yourSum);

    
        while (yourSum > 21 && yourAceCount > 0) {
            yourSum = reduceAce(yourSum, yourAceCount);
            yourAceCount -= 1;
            document.getElementById("your-sum").innerText = yourSum;
        }
    
    aiWillHit = aiChoice();
    console.log(aiWillHit);

    if (aiWillHit) {
        aihits();
    }
    else {
        aiCanHit = false;
    }

    if (yourSum >= 21) {
        canHit = false;
        stay();
    }
}

function aihits() {

    if (!aiCanHit) {
        return;
    }

    if (aiSum >= 21) {
        // If player has already busted, do nothing
        aiCanHit = false;
        return;
    }



    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    tempValue = getValue(card);
    aiSum += tempValue;
    lastCards[0] = tempValue;
    aiAceCount += checkAce(card);
    document.getElementById("ai-cards").append(cardImg);
    document.getElementById("ai-sum").innerText = aiSum;

    while (aiSum > 21 && aiAceCount > 0) {
        aiSum = reduceAce(aiSum, aiAceCount);
        aiAceCount -= 1;
        document.getElementById("ai-sum").innerText = aiSum;
    }
}


function stay() {

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    while (dealerSum < 16) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }

    while (aiCanHit) {
        aiWillHit = aiChoice();
        console.log(aiWillHit);

        if (aiWillHit) {
            aihits();
        }
        else {
            aiCanHit = false;
        }
    }
    while (dealerSum > 21 && dealerAceCount > 0) {
        dealerSum = reduceAce(dealerSum, dealerAceCount);
    }
    yourSum = reduceAce(yourSum, yourAceCount);
    aiSum = reduceAce(aiSum, aiAceCount);

    let message = "";
    let aiMessage = "";
    if (yourSum > 21) {
        message = "You Lose!";
    } else if (dealerSum > 21) {
        message = "You win!";
    } else if (yourSum == dealerSum) {
        message = "Tie!";
    } else if (yourSum > dealerSum) {
        message = "You Win!";
    } else if (yourSum < dealerSum) {
        message = "You Lose!";
    }

    if (aiSum > 21) {
        aiMessage = "Ai Loses!";
    } else if (dealerSum > 21) {
        aiMessage = "Ai wins!";
    } else if (aiSum == dealerSum) {
        aiMessage = "Ai Ties!";
    } else if (aiSum > dealerSum) {
        aiMessage = "Ai Wins!";
    } else if (aiSum < dealerSum) {
        aiMessage = "Ai Loses!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("ai-sum").innerText = aiSum;
    document.getElementById("results").innerText = message;
    document.getElementById("ai-results").innerText = aiMessage;
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    if (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

network.train([
    {input: {score: 1, recent_card_ai: 0.909091, second_recent_card_ai: 0.272727, possibleCards: 0}, output: {willHit: 0 }},
    {input: {score: 0.619048, recent_card_ai: 0.272727, second_recent_card_ai: 0.727273, possibleCards: 1}, output: {willHit: 1 }},
    {input: {score: 0.142857, recent_card_ai: 0.909091, second_recent_card_ai: 0.272727, possibleCards: 0.230769}, output: {willHit: 1 }},
    {input: {score: 0.142857, recent_card_ai: 0.727273, second_recent_card_ai: 0.909091, possibleCards: 0.230769}, output: {willHit: 1 }},
    {input: {score: 0.047619, recent_card_ai: 0.454545, second_recent_card_ai: 0.636364, possibleCards: 0.0769231}, output: {willHit: 1 }},
    {input: {score: 0.333333, recent_card_ai: 0.272727, second_recent_card_ai: 0.0909091, possibleCards: 0.538462}, output: {willHit: 1 }},
    {input: {score: 1, recent_card_ai: 0.181818, second_recent_card_ai: 0.272727, possibleCards: 0}, output: {willHit: 0 }},
    {input: {score: 0.047619, recent_card_ai: 0.545455, second_recent_card_ai: 0.181818, possibleCards: 0.0769231}, output: {willHit: 0 }},
    {input: {score: 0, recent_card_ai: 0.818182, second_recent_card_ai: 0.818182, possibleCards: 0}, output: {willHit: 1 }},
    {input: {score: 0.190476, recent_card_ai: 0.909091, second_recent_card_ai: 0.363636, possibleCards: 0.307692}, output: {willHit: 1 }},
    {input: {score: 0.190476, recent_card_ai: 0.909091, second_recent_card_ai: 0.909091, possibleCards: 0.307692}, output: {willHit: 1 }},
    {input: {score: 1, recent_card_ai: 0.0909091, second_recent_card_ai: 0.636364, possibleCards: 0}, output: {willHit: 0 }},
    {input: {score: 0.380952, recent_card_ai: 0.0909091, second_recent_card_ai: 0.909091, possibleCards: 0.615385}, output: {willHit: 1 }},
    {input: {score: 1, recent_card_ai: 0.727273, second_recent_card_ai: 0.0909091, possibleCards: 0}, output: {willHit: 0 }},
    {input: {score: 0.190476, recent_card_ai: 0.909091, second_recent_card_ai: 0.454545, possibleCards: 0.307692}, output: {willHit: 1 }},
    {input: {score: 0.190476, recent_card_ai: 0.454545, second_recent_card_ai: 0.909091, possibleCards: 0.307692}, output: {willHit: 0 }},
    {input: {score: 0.0952381, recent_card_ai: 0.909091, second_recent_card_ai: 0.636364, possibleCards: 0.153846}, output: {willHit: 1 }},
    {input: {score: 0.0952381, recent_card_ai: 0.727273, second_recent_card_ai: 0.909091, possibleCards: 0.153846}, output: {willHit: 0 }},
    {input: {score: 0.190476, recent_card_ai: 0.909091, second_recent_card_ai: 0.909091, possibleCards: 0.307692}, output: {willHit: 1 }},
    {input: {score: 0.190476, recent_card_ai: 0.727273, second_recent_card_ai: 0.909091, possibleCards: 0.307692}, output: {willHit: 0 }},
    {input: {score: 1, recent_card_ai: 0.909091, second_recent_card_ai: 0.818182, possibleCards: 0}, output: {willHit: 0 }},
    {input: {score: 0, recent_card_ai: 0.909091, second_recent_card_ai: 0.636364, possibleCards: 0}, output: {willHit: 1 }},
    {input: {score: 1, recent_card_ai: 0.363636, second_recent_card_ai: 0.272727, possibleCards: 0}, output: {willHit: 0 }},
    {input: {score: 0, recent_card_ai: 0.818182, second_recent_card_ai: 0.272727, possibleCards: 0}, output: {willHit: 1 }},
    {input: {score: 0.142857, recent_card_ai: 0.909091, second_recent_card_ai: 0.909091, possibleCards: 0.230769}, output: {willHit: 1 }},

    
]);

function aiChoice() {
    if (aiSum  >= 21) {
        possibleCards = 0;
    }
    else if (aiSum < 21) {
        possibleCards = ((21.0-aiSum)*4.0)/52.0;
    }

    if (aiSum <= 21) {
        closeToScore = (21.0-aiSum)/21.0;
    }
    else if (aiSum > 21) {
        closeToScore = (21.0-aiSum)/(-21.0);;
    }

    var input = {
        score: closeToScore,
        recent_card_ai: lastCards[0] / 11.0,
        second_recent_card_ai: secondToLastCards[0] / 11.0,
        possibleCards: possibleCards,
    };

    var result = network.run(input);

    console.log(result);

    if (result.willHit > 0.5) {
        return true;
    } else {
        return false;
    }
}

function recordPreviousCards() {
    secondToLastCards[0] = lastCards[0];
    secondToLastCards[1] = lastCards[1];
}