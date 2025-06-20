z# Maze Solver

[![Node.js](https://img.shields.io/badge/node.js-%3E%3D14-brightgreen)](https://nodejs.org/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Description

**Maze Solver** est une application Node.js conçue pour résoudre automatiquement un labyrinthe via une API REST.  
Le programme contrôle un joueur qui explore le labyrinthe, évite les pièges et murs, visite tous les chemins accessibles en profondeur avant de revenir en arrière, jusqu’à atteindre la sortie ou la case "home".

Le solver utilise une stratégie de parcours en profondeur avec backtracking, garantissant l’exploration complète des chemins.

---

## Fonctionnalités

- Initialisation du jeu via API (démarrage et récupération de position)
- Exploration dynamique du labyrinthe (découverte des cases adjacentes)
- Représentation interne du labyrinthe sous forme de grille avec types de cases (`path`, `wall`, `trap`, `home`)
- Algorithme DFS avec backtracking pour explorer tous les chemins accessibles
- Évitement automatique des pièges et murs
- Gestion automatique des états du joueur : mort (`dead`), victoire (`win`)
- Journalisation des mouvements, découvertes et décisions prises

---

## Installation

Cloner le dépôt et installer les dépendances :

```bash
git clone https://github.com/ton-utilisateur/maze-solver.git
cd maze-solver
npm install


## Utilisation

Lancer la résolution du labyrinthe avec la commande suivante :

node index.js
