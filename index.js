const { API_URL, PLAYER_NAME } = require("./config");
const Maze = require("./core/maze");
const solve = require("./core/solver");

(async () => {
  const maze = new Maze(API_URL, PLAYER_NAME);
  await solve(maze);
})();
