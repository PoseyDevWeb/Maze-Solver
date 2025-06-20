const axios = require("axios");
const qs = require('qs'); // 👈 Nécessaire pour encoder en x-www-form-urlencoded

// async function startGame(apiUrl, playerName) {
//   const res = await axios.post(`${apiUrl}/start-game/`, {
//     player: playerName,
//   });
//   return res.data;
// }

// async function startGame(apiUrl, playerName) {
//     try {
//         const res = await axios.post(`${apiUrl}/start-game/`, {
//             player: playerName,
//       }, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//       console.log("PLAYER =", playerName);
//       console.log(res.data);
//     } catch (err) {
//       console.error("Erreur :", err.response?.status, err.response?.data || err.message);
//     }
//   }

async function startGame(apiUrl, playerName) {
  try {
    console.log("Nom du joueur envoyé :", playerName);

    const res = await axios.post(
      `${apiUrl}/start-game/`,
      qs.stringify({ player: playerName }), // 👈 Encodage formulaire
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // 👈 Header correct
        },
      }
    );

    console.log("✅ Réponse OK :", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Erreur du serveur :", err.response?.status, err.response?.data);
    return null;
  }
}


async function discover(url) {
  try {
    const res = await axios.get(url);
    console.log("✅ Découverte :", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Erreur dans discover :", err.response?.status, err.response?.data || err.message);
    return null;
  }
}

async function move(url, x, y) {
    try {
      const data = qs.stringify({
        position_x: x,
        position_y: y,
      });
  
      const res = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      console.log(`✅ Move vers (${x}, ${y}) :`, res.data);
      return res.data;
    } catch (err) {
      console.error(`❌ Erreur dans move vers (${x}, ${y}) :`, err.response?.status, err.response?.data || err.message);
      return null;
    }
  }
  


module.exports = {
  startGame,
  discover,
  move,
};
