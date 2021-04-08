const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const tileCount = 20;
let canvasFrames = 7,
  score = 0;

class SnakePart {
  constructor(x, y) {
    const thisSnakePart = this;
    thisSnakePart.x = x;
    thisSnakePart.y = y;
  }
}

const tile = {
  tileSize: canvas.width / tileCount - 2,
};

const snake = {
  headX: 10,
  headY: 10,
  snakeColor: '#9ACA10',
  xVelocity: 0,
  yVelocity: 0,
  snakePart: [],
  tailLenght: 2,
  bodyColor: '#10CACA',
};

const bug = {
  bugX: 5,
  bugY: 5,
  bugColor: '#C710CA',
};

function updateAll() {
  changeSnakePosition();
  let result = isGameOver();
  if (result === true) {
    return;
  }

  drawCanvas();

  checkBugCollision();
  drawBug();
  drawSnake();
  drawScore();

  if (score > 2) {
    canvasFrames = 10;
  }

  setTimeout(updateAll, 1000 / canvasFrames);
}

/* draw canvas */
function drawCanvas() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
}

/* game over function */
isGameOver = () => {
  let gameOver = false;

  if (snake.xVelocity === 0 && snake.yVelocity === 0) {
    return false;
  }

  //wals
  if (snake.headX < 0) {
    gameOver = true;
  } else if (snake.headX === tileCount) {
    gameOver = true;
  } else if (snake.headY < 0) {
    gameOver = true;
  } else if (snake.headY === tileCount) {
    gameOver = true;
  }

  // body checks
  for (let i = 0; i < snake.snakePart.length; i++) {
    let part = snake.snakePart[i];
    if (part.x === snake.headX && part.y === snake.headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    gameOverText();
  }

  return gameOver;
};

/* draw score */
drawScore = () => {
  context.fillStyle = '#fff';
  context.font = '10px sans-serif';
  context.fillText('Score' + score, canvas.width - 50, 10);
};

/* game over text */
gameOverText = () => {
  context.fillStyle = '#fff';
  context.font = '50px sans-serif';

  context.fillText('Game Over', canvas.width / 6.5, canvas.height / 2);
};

/* draw snake */
drawSnake = () => {
  /* draw body */
  context.fillStyle = snake.bodyColor;
  /* loop over snakePart array */
  for (let i = 0; i < snake.snakePart.length; i++) {
    let part = snake.snakePart[i];
    context.fillRect(
      part.x * tileCount,
      part.y * tileCount,
      tile.tileSize,
      tile.tileSize
    );
  }
  snake.snakePart.push(new SnakePart(snake.headX, snake.headY)); //add item to the end of the body list
  while (snake.snakePart.length > snake.tailLenght) {
    snake.snakePart.shift(); //remove furthest item from snake parts
  }

  /*draw head */
  context.fillStyle = snake.snakeColor;
  context.fillRect(
    snake.headX * tileCount,
    snake.headY * tileCount,
    tile.tileSize,
    tile.tileSize
  );
};

/* draw bug */
drawBug = () => {
  context.fillStyle = bug.bugColor;
  context.fillRect(
    bug.bugX * tileCount,
    bug.bugY * tileCount,
    tile.tileSize,
    tile.tileSize
  );
};

/* check snake and bug collision */
checkBugCollision = () => {
  if (bug.bugX === snake.headX && bug.bugY === snake.headY) {
    bug.bugX = Math.floor(Math.random() * tileCount);
    bug.bugY = Math.floor(Math.random() * tileCount);
    snake.tailLenght++;
    score++;
  }
};

/* snake movement */

changeSnakePosition = () => {
  snake.headX = snake.headX + snake.xVelocity;
  snake.headY = snake.headY + snake.yVelocity;
};

/* key binding */

keyDown = (e) => {
  e.preventDefault();
  switch (e.keyCode) {
    // left
    case 37:
      //disalow to move right
      if (snake.xVelocity === 1) return;
      snake.yVelocity = 0;
      snake.xVelocity = -1;
      break;

    //up
    case 38:
      if (snake.yVelocity === 1) return;
      snake.yVelocity = -1;
      snake.xVelocity = 0;
      break;

    // right
    case 39:
      if (snake.xVelocity === -1) return;
      snake.yVelocity = 0;
      snake.xVelocity = 1;
      break;

    //down
    case 40:
      if (snake.yVelocity === -1) return;
      snake.yVelocity = 1;
      snake.xVelocity = 0;
      break;

    default:
      break;
  }
};

// keyDown = (e) => {
//   //up
//   if (e.keyCode === 38) {
//     snake.yVelocity = -1;
//     snake.xVelocity = 0;
//   }
// };

document.body.addEventListener('keydown', keyDown);

updateAll();
