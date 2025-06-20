const { startGame, discover, move } = require("../services/gameApi");

class Maze {
  constructor(apiUrl, playerName) {
    this.apiUrl = apiUrl;
    this.playerName = playerName;
    this.position = { x: 0, y: 0 };
    this.discovered = new Map(); // clé "x,y" => type de case
    this.visited = new Set();    // positions visitées "x,y"
    this.dead = false;
    this.win = false;
    this.moveUrl = null;
    this.discoverUrl = null;
  }

  async init() {
    const data = await startGame(this.apiUrl, this.playerName);
    this.position = { x: data.position_x, y: data.position_y };
    this.moveUrl = data.url_move;
    this.discoverUrl = data.url_discover;
    this.dead = data.dead;
    this.win = data.win;
  }

  async explore() {
    const cells = await discover(this.discoverUrl);
    cells.forEach((cell) => {
      const key = `${cell.x},${cell.y}`;
      this.discovered.set(key, cell.value);
    });
    return cells;
  }

  async getAvailableMoves() {
    const cells = await this.explore();
    return cells.filter((cell) =>
      cell.move &&
      cell.value !== "trap" &&
      cell.value !== "wall" &&
      !this.visited.has(`${cell.x},${cell.y}`)
    );
  }

async moveTo(x, y) {
    try {
      const data = await move(this.moveUrl, x, y);
  
      this.position = { x: data.position_x, y: data.position_y };
      this.moveUrl = data.url_move;
      this.discoverUrl = data.url_discover;
      this.dead = data.dead;
      this.win = data.win;
      this.visited.add(`${x},${y}`);
  
      // Découverte des cases adjacentes après le déplacement
      const adjacentCells = await this.explore();
  
      // Prendre une décision sur le prochain déplacement
      const nextMove = this.getNextMove(adjacentCells);
  
      if (nextMove) {
        console.log(`➡️ Déplacement vers (${nextMove.x}, ${nextMove.y})`);
        await this.moveTo(nextMove.x, nextMove.y);
      } else {
        console.log(`[INFO] 🚧 Aucun chemin valide, retour à home.`);
        await this.moveToHome();
      }
  
    } catch (err) {
      console.error(`❌ Erreur dans move vers (${x}, ${y}) :`, err.response?.status, err.response?.data);
    }
  }
  
  async explore() {
    const cells = await discover(this.discoverUrl);
    cells.forEach((cell) => {
      const key = `${cell.x},${cell.y}`;
      this.discovered.set(key, cell.value);
    });
    return cells;
  }
  
  getNextMove(adjacentCells) {
    // Filtrer les cases disponibles qui sont des chemins et non visitées
    const availableMoves = adjacentCells.filter(cell =>
      cell.move && cell.value === 'path' && !this.visited.has(`${cell.x},${cell.y}`)
    );
  
    if (availableMoves.length > 0) {
      // Choisir un chemin non visité en priorité
      const nextMove = availableMoves[0];
      console.log(`[INFO] Choix du prochain mouvement vers (${nextMove.x}, ${nextMove.y})`);
      return nextMove;
    }
  
    // Si aucune case valide n'est trouvée, retourner à "home"
    const homeCell = adjacentCells.find(cell => cell.value === 'home');
    if (homeCell) {
      console.log(`[INFO] Retour vers home (${homeCell.x}, ${homeCell.y})`);
      return homeCell;
    }
  
    return null;
  }
  
  async moveToHome() {
    // Déplacement vers la case "home"
    const homeCell = this.discovered.get("home");
    if (homeCell) {
      await this.moveTo(homeCell.x, homeCell.y);
    } else {
      console.log("[INFO] Home non trouvé.");
    }
  }
  

  async solve() {
    const stack = [];
    const homeKey = `${this.position.x},${this.position.y}`;
    
    // Ensemble des cases totalement explorées (plus rien à découvrir depuis là)
    const explored = new Set();
  
    stack.push(this.position);
    this.visited.add(homeKey);
  
    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const currentKey = `${current.x},${current.y}`;
  
      // Découverte des voisins accessibles
      const neighbors = await this.getAvailableMoves();
  
      // On filtre ceux qui ne sont pas encore explorés
      const unvisitedNeighbors = neighbors.filter(
        (cell) => !explored.has(`${cell.x},${cell.y}`)
      );
  
      if (unvisitedNeighbors.length > 0) {
        // Il reste des chemins non explorés : on en prend un et on avance
        const next = unvisitedNeighbors[0];
  
        console.log(`[MOVE] De (${current.x},${current.y}) vers (${next.x},${next.y})`);
  
        await this.moveTo(next.x, next.y);
  
        if (this.dead) {
          console.log("💀 Mort dans le labyrinthe !");
          break;
        }
        if (this.win) {
          console.log("🏆 Victoire atteinte !");
          break;
        }
  
        this.visited.add(`${next.x},${next.y}`);
        stack.push({ x: next.x, y: next.y });
      } else {
        // Aucun voisin non exploré : on marque la case actuelle comme explorée
        explored.add(currentKey);
  
        if (currentKey === homeKey) {
          // On est à la maison et plus rien à explorer : fin
          console.log("[FIN] Tous les chemins explorés.");
          break;
        }
  
        // Sinon backtrack vers la case précédente
        stack.pop();
        const back = stack[stack.length - 1];
        console.log(`[BACKTRACK] Retour à (${back.x},${back.y})`);
        await this.moveTo(back.x, back.y);
      }
    }
  }
  
}

module.exports = Maze;
