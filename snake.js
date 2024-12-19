// Get the canvas element and set up the context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define constants
const snakeSize = 20;
const canvasSize = 400;
const directions = {
    UP: { x: 0, y: -snakeSize },
    DOWN: { x: 0, y: snakeSize },
    LEFT: { x: -snakeSize, y: 0 },
    RIGHT: { x: snakeSize, y: 0 }
};

// Initialize game state
let snake = [{ x: 160, y: 160 }];
let direction = directions.RIGHT;
let food = generateFood();
let gameOver = false;
let score = 0;
let paused = false;  // Pause state

// Game loop
function gameLoop() {
    if (gameOver) {
        alert("Game Over! Your score: " + score);
        resetGame();
        return;
    }

    if (!paused) {  // Only move and update the game if it's not paused
        setTimeout(function() {
            clearCanvas();
            moveSnake();
            drawSnake();
            drawFood();
            checkCollisions();
            gameLoop();
        }, 100);
    } else {
        drawPauseScreen();  // Show pause screen
    }
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
}

// Move the snake
function moveSnake() {
    const head = { ...snake[0] };

    head.x += direction.x;
    head.y += direction.y;

    // Add the new head to the front of the snake
    snake.unshift(head);

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFood();
    } else {
        // Remove the last part of the snake (tail)
        snake.pop();
    }
}

// Draw the snake
function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = "green";
        ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
    });
}

// Draw the food
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
}

// Generate a random food position
function generateFood() {
    let x = Math.floor(Math.random() * (canvasSize / snakeSize)) * snakeSize;
    let y = Math.floor(Math.random() * (canvasSize / snakeSize)) * snakeSize;
    return { x: x, y: y };
}

// Draw the pause screen
function drawPauseScreen() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Paused", canvasSize / 4, canvasSize / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Press 'P' to resume", canvasSize / 3, canvasSize / 1.5);
}

// Check for collisions (walls or snake hitting itself)
function checkCollisions() {
    const head = snake[0];

    // Check wall collision
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        gameOver = true;
    }

    // Check self-collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver = true;
        }
    }
}

// Listen for key presses to control the snake
document.addEventListener("keydown", function(event) {
    // If the game is paused, allow 'P' to resume
    if (paused && (event.key === "p" || event.key === "P")) {
        paused = false;
        gameLoop();  // Restart the game loop after resuming
        return;  // Exit to prevent further key events while paused
    }

    // Handle arrow key movement
    if (!paused) { // Only move the snake if the game is not paused
        if (event.key === "ArrowUp" && direction !== directions.DOWN) {
            direction = directions.UP;
        } else if (event.key === "ArrowDown" && direction !== directions.UP) {
            direction = directions.DOWN;
        } else if (event.key === "ArrowLeft" && direction !== directions.RIGHT) {
            direction = directions.LEFT;
        } else if (event.key === "ArrowRight" && direction !== directions.LEFT) {
            direction = directions.RIGHT;
        }
    }

    // Toggle pause when 'P' is pressed
    if (!paused && (event.key === "p" || event.key === "P")) {
        paused = true;
        gameLoop();  // Stop the game loop when paused
    }
});

// Reset the game
function resetGame() {
    snake = [{ x: 160, y: 160 }];
    direction = directions.RIGHT;
    food = generateFood();
    gameOver = false;
    score = 0;
    paused = false;  // Unpause when resetting
    gameLoop();
}

// Start the game
gameLoop();
