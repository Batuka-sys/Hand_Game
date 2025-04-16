// Define wall and goal objects for collision detection
export const walls = [
    { x: 100, y: 100, width: 200, height: 20 },  // Wall 1
    { x: 300, y: 100, width: 20, height: 200 },  // Wall 2
    { x: 150, y: 250, width: 150, height: 20 },  // Wall 3
    { x: 250, y: 150, width: 20, height: 100 },
  ];
  
  export const goal = { x: 400, y: 300, width: 30, height: 30 };
  
  export function drawMaze(ctx) {
    // Draw walls
    ctx.fillStyle = '#000';
    for (const wall of walls) {
      ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }
  
    // Draw goal
    ctx.fillStyle = 'green';
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
    
    // Draw start point indicator
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(50, 50, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw instructions
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText('Move your hand to guide the red ball to the green square', 150, 30);
  }