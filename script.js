

const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const startStopButton = document.getElementById('start-stop-button');
const resetButton = document.getElementById('reset-button');

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let timer = 0;
let interval;
let gameStarted = false;
let gamePaused = false;

const cardValues = [
    'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D',
    'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'
];

// Generate random colors for each pair
const colors = [];
const darkColors = [];
for (let i = 0; i < cardValues.length / 2; i++) {
    const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 75%)`;
    const darkColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`; // Darker version
    colors.push(color, color);
    darkColors.push(darkColor, darkColor);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    shuffle(cardValues);
    shuffle(colors);
    shuffle(darkColors);
    for (let i = 0; i < cardValues.length; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = cardValues[i];
        card.dataset.color = colors[i];
        card.dataset.darkColor = darkColors[i];
        card.style.backgroundColor = colors[i];
        card.innerHTML = `<span class="hidden">${cardValues[i]}</span>`;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        cards.push(card);
    }
}

function flipCard() {
    if (!gameStarted || gamePaused) return;
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        this.style.backgroundColor = this.dataset.color;
        this.querySelector('span').classList.remove('hidden');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        card1.style.backgroundColor = card1.dataset.darkColor;
        card2.style.backgroundColor = card2.dataset.darkColor;
        setTimeout(() => {
            card1.classList.add('hidden');
            card2.classList.add('hidden');
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.querySelector('span').classList.add('hidden');
            card2.querySelector('span').classList.add('hidden');
        }, 1000); // Highlight for 1 second before hiding

        matchedPairs++;
        score += 10;
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.querySelector('span').classList.add('hidden');
        card2.querySelector('span').classList.add('hidden');
        score = Math.max(0, score - 5); // Deduct 5 points if pairs do not match
    }
    flippedCards = [];
    updateScore();

    if (matchedPairs === cardValues.length / 2) {
        clearInterval(interval);
        setTimeout(() => {
            alert('You win!');
            resetGame();
        }, 500);
    }
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function updateTime() {
    timer++;
    timerElement.textContent = `Time: ${timer}`;
}

function startGame() {
    if (gameStarted && !gamePaused) {
        gamePaused = true;
        clearInterval(interval);
        startStopButton.classList.remove('stop');
        startStopButton.classList.add('start');
        startStopButton.textContent = 'Start';
    } else if (gamePaused) {
        gamePaused = false;
        interval = setInterval(updateTime, 1000);
        startStopButton.classList.remove('start');
        startStopButton.classList.add('stop');
        startStopButton.textContent = 'Stop';
    } else {
        gameStarted = true;
        gamePaused = false;
        createBoard();
        interval = setInterval(updateTime, 1000);
        startStopButton.classList.add('stop');
        startStopButton.textContent = 'Stop';
    }
}

function resetGame() {
    clearInterval(interval);
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    score = 0;
    timer = 0;
    gameStarted = false;
    gamePaused = false;
    timerElement.textContent = `Time: 0`;
    scoreElement.textContent = `Score: 0`;
    startStopButton.classList.remove('stop');
    startStopButton.classList.add('start');
    startStopButton.textContent = 'Start';
}

startStopButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
