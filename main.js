import { drawMaze, walls, goal } from './maze.js';
import { Player } from './player.js';
import { detectHand } from './tf-handler.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const player = new Player();
let gameStarted = false;
let gameWon = false;

async function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Update player position
  player.update();
  
  // Check collisions
  if (player.checkCollision(walls)) {
    // Reset player to start if hits wall
    player.targetX = 50;
    player.targetY = 50;
    player.lives--;
    
    if (player.lives <= 0) {
      resetGame();
    }
  }
  
  // Check if reached goal
  if (player.checkGoal(goal)) {
    gameWon = true;
  }
  
  // Draw game elements
  drawMaze(ctx);
  player.draw(ctx);
  
  // Draw game state
  if (gameWon) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('You Win!', canvas.width/2, canvas.height/2);
    ctx.font = '18px Arial';
    ctx.fillText('Refresh the page to play again', canvas.width/2, canvas.height/2 + 40);
  } else if (!gameStarted) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Loading Hand Detection...', canvas.width/2, canvas.height/2);
  }
  
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  player.x = 50;
  player.y = 50;
  player.targetX = 50;
  player.targetY = 50;
  player.lives = 3;
}

async function startGame() {
  try {
    // Show loading state
    gameLoop();
    
    // Initialize hand detection
    await detectHand(player);
    
    // Start game
    gameStarted = true;
  } catch (error) {
    console.error("Failed to start game:", error);
    ctx.fillStyle = 'red';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Error loading hand detection. Check console.', canvas.width/2, canvas.height/2 + 30);
  }
}

startGame();