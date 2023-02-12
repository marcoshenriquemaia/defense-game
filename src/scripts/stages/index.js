import { max } from "../utils/max.js";
const $canvas = document.getElementById("canvas");

const colorSequence = [
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "white",
  "gray",
  "cyan",
  "magenta",
  "lime",
  "maroon",
  "navy",
  "olive",
  "teal",
  "aqua",
  "fuchsia",
  "silver",
  "gold",
  "indigo",
  "violet",
  "coral",
  "crimson",
  "turquoise",
  "limegreen",
  "darkgreen",
  "darkblue",
  "darkred",
  "darkorange",
  "darkgray",
  "darkcyan",
  "darkmagenta",
  "darkolivegreen",
  "darkslateblue",
  "darkslategray",
  "darkturquoise",
  "deeppink",
];

export const STAGES = colorSequence.map((color, index) => {
  return {
    name: `Stage ${index + 1}`,
    monsters: [
      {
        quantity: max((index + 1) * 3, 100),
        width: 32,
        height: 32,
        speed: Math.pow(index + 1, 2.5) / 100 + 1,
        color,
        power: index + 1,
        initialLife: Math.log(index + 1) * index + 1,
        life: Math.log(index + 1) * index + 1,
        respawnTime: 1000 / (index + 1),
        reward: Math.pow(index + 1, 1.3) + 1,
      },
      {
        quantity: max((index + 1) * 1.5, 20),
        width: 50,
        height: 50,
        speed: Math.pow(index + 1, 1.5) / 100 + 1,
        color,
        power: index + 1,
        initialLife: Math.log(index + 4) * (index + 1) * 2,
        life: Math.log(index + 4) * (index + 1) * 2,
        respawnTime: 1000 / (index + 1),
        reward: Math.pow(index + 2, 1.3) + 1,
      },
      {
        quantity: 2,
        width: 100,
        height: 100,
        speed: 0.5,
        color,
        power: Math.pow(index + 2, 2),
        initialLife: Math.pow(index + 2, 3),
        life: Math.pow(index + 2, 3),
        respawnTime: 10000 / (index + 1),
        reward: Math.pow(index + 2, 3),
        boss: true,
      },
    ].filter(Boolean),
  };
});

console.log("STAGES", STAGES);
