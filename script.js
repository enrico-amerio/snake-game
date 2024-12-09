//audio

const mammamia = new Audio ('audio/mammamia.mp3')
const bite = new Audio ('audio/bite.mp3')

//emoji

const pasta = "🍝";
const pizza ="🍕";
let currentEmoji = pasta;

// Board

const blockSize = 25;
const rows = 20;
const cols = 20;
let board;
let context;
let score = 0;
let lastDirectionChange = 0;

// Snake

let snakeX;
let snakeY;
let velocityX = 0;
let velocityY = 0;

let snakeBody = [];

// Food

let foodX;
let foodY;

// Game Over

let gameOver = false;
const popupContainer = document.querySelector('.popup-container');
const restartButton = document.getElementById('refresh-btn');

window.onload = function(){

  board = document.getElementById("board");
  board.height = rows * blockSize;
  board.width = cols * blockSize;
  context = board.getContext("2d");
  placeFood();
  placeSnake();
  document.addEventListener("keyup", changeDirection)
  setInterval(update, 150);
  scoreCounter = document.getElementById('score');
  scoreCounter.innerHTML = `SCORE: ${score}`;

}

function update(){
   if(gameOver){
     return;
   }
  
  context.fillStyle="black";
  context.fillRect(0, 0, board.width, board.height);

  // Use fillText to draw a larger pizza emoji for the food
  context.font = "20px Arial"; // Adjust font size (slightly smaller than blockSize)
  context.textAlign = "center"; // Center horizontally
  context.textBaseline = "middle"; // Center vertically
  context.clearRect(foodX, foodY, blockSize, blockSize); // Clear the block before drawing the emoji
  context.fillText(currentEmoji, foodX + blockSize / 2, foodY + blockSize / 2); // Draw the pizza emoji in the center

  if(snakeX === foodX && snakeY === foodY){
    snakeBody.push([foodX, foodY]);
    score++;
    scoreCounter.innerHTML = `SCORE: ${score}`;
    bite.play();
    if (currentEmoji === pasta){
      currentEmoji = pizza;
    } else{
      currentEmoji = pasta;

    }
    placeFood();
  }
  for(i=snakeBody.length-1; i > 0 ;i--){
    snakeBody[i] = snakeBody[i-1];
  }
  if(snakeBody.length){
    snakeBody[0] = [snakeX, snakeY];
  }

  context.fillStyle="lime";
  snakeX += velocityX * blockSize;
  snakeY += velocityY * blockSize;
  context.fillRect(snakeX,snakeY, blockSize, blockSize);
  for(i = 0; i < snakeBody.length; i++){
    context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
  }

  if(snakeX < 0 || snakeX + blockSize > cols * blockSize || snakeY < 0 || snakeY + blockSize > rows * blockSize){
    gameOver = true;
    // mammamia.play();
    endGame();
    // return;
  }
  for(i = 0; i < snakeBody.length; i++){
    if(snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]){
      gameOver = true;
      // mammamia.play();
      endGame();
      // return;
    }
  }
}

function placeFood(){
  foodX = Math.floor(Math.random() * cols) * blockSize;
  foodY = Math.floor(Math.random() * rows) * blockSize;
}
function placeSnake(){
  snakeX = Math.floor(Math.random() * cols) * blockSize;
  snakeY = Math.floor(Math.random() * rows) * blockSize;
  
}

function changeDirection(e){
  const currentTime = Date.now();
  // Ignore direction changes if they happen too quickly
  if (currentTime - lastDirectionChange < 100) return; // 100ms delay

  lastDirectionChange = currentTime;
  if(e.code === "ArrowUp" && velocityY != 1){
    velocityX = 0;
    velocityY = -1;
  }else if(e.code === "ArrowDown" && velocityY != -1){
    velocityX = 0;
    velocityY = 1;
  }else if(e.code === "ArrowRight" && velocityX != -1){
    velocityX = 1;
    velocityY = 0;
  }else if(e.code === "ArrowLeft" && velocityX != 1){
    velocityX = -1;
    velocityY = 0;
  }
}
function endGame(){
  mammamia.play();
  popupContainer.classList.remove('d-none');
  popupContainer.classList.add('d-flex');
  return;
}
restartButton.addEventListener('click', function(){
  // Reset snake position
  placeSnake();

  // Clear snake body
  snakeBody = [];

  // Reset velocity
  velocityX = 0;
  velocityY = 0;

  // Reset score
  score = 0;
  scoreCounter.innerHTML = `SCORE: ${score}`;

  // Reset game over state
  gameOver = false;

  // Hide popup
  popupContainer.classList.add('d-none');
  popupContainer.classList.remove('d-flex');

  // Place new food
  placeFood();

  // Clear the board for the new game
  context.fillStyle = "black";
  context.fillRect(0, 0, board.width, board.height);
})
