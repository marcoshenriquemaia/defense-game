import { max } from "../utils/max.js";

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
        speed: Math.pow(index + 1, 2) / 100 + 1,
        color,
        power: 1 * (index + 1),
        initialLife: Math.log(index + 1) * index + 1,
        life: Math.log(index + 1) * index + 1,
        respawnTime: 1000 / index,
        reward: Math.pow(index + 1, 2) + 1,
      },
    ],
  };
});