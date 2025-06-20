const logger = require("../utils/logger");

async function solve(maze) {
  await maze.init();
  await maze.explore();

  while (!maze.dead && !maze.win) {
    logger.info(`📍 Position : (${maze.position.x}, ${maze.position.y})`);

    const nextMoves = await maze.getAvailableMoves();

    if (nextMoves.length === 0) {
      logger.warn("🚧 Aucune direction disponible.");
      break;
    }

    const next = nextMoves[0]; // version naïve
    logger.info(`➡️  Je me déplace vers (${next.x}, ${next.y})`);
    await maze.moveTo(next.x, next.y);
  }

  if (maze.win) logger.success("🎉 Gagné !");
  else if (maze.dead) logger.error("💥 Piège ! Game Over.");
}

module.exports = solve;
