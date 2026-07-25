const rollButton = document.getElementById("rollButton");
const gameMessage = document.getElementById("gameMessage");
const diceOne = document.getElementById("diceOne");
const diceTwo = document.getElementById("diceTwo");
const scoreOne = document.getElementById("scoreOne");
const scoreTwo = document.getElementById("scoreTwo");
const playerOne = document.getElementById("playerOne");
const playerTwo = document.getElementById("playerTwo");

function getRandomDiceNumber() {
  return Math.floor(Math.random() * 6) + 1;
}

function updateDice(dice, score, value, playerName) {
  dice.dataset.value = value;
  dice.setAttribute("aria-label", `${playerName} rolled ${value}`);
  score.textContent = value;
}

function rollDice() {
  const playerOneRoll = getRandomDiceNumber();
  const playerTwoRoll = getRandomDiceNumber();

  updateDice(diceOne, scoreOne, playerOneRoll, "Player 1");
  updateDice(diceTwo, scoreTwo, playerTwoRoll, "Player 2");
  playerOne.classList.remove("winner");
  playerTwo.classList.remove("winner");

  if (playerOneRoll > playerTwoRoll) {
    gameMessage.textContent = "Player 1 wins this round!";
    playerOne.classList.add("winner");
  } else if (playerTwoRoll > playerOneRoll) {
    gameMessage.textContent = "Player 2 wins this round!";
    playerTwo.classList.add("winner");
  } else {
    gameMessage.textContent = "It is a draw — roll again!";
  }

  rollButton.textContent = "Roll Again";
}

rollButton.addEventListener("click", rollDice);

diceOne.dataset.value = 1;
diceTwo.dataset.value = 1;
