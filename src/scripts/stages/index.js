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
  "deepskyblue",
  "dimgray",
  "dodgerblue",
];

export const STAGES = colorSequence.map((color, index) => {
  return {
    name: `Stage ${index + 1}`,
    bosStage: index % 5 === 0 && !!index,
    active: index < 6,
    bossKilled: false,
    monsters: (index % 5 === 0 && index
      ? [
          {
            quantity: 1,
            width: 500,
            height: 500,
            speed: 0.1,
            color,
            power: 99999999999999999999999999,
            initialLife:
              Math.pow(index + 9, 4 + index * 0.01) +
              Math.pow((index / 5 - 1) * 500, 2),
            life:
              Math.pow(index + 9, 4 + index * 0.01) +
              Math.pow((index / 5 - 1) * 500, 2),
            respawnTime: 10000 / (index + 1),
            reward: Math.pow((index / 5) * 500, 2),
            boss: true,
            x: $canvas.width,
            y: $canvas.height,
          },
        ]
      : [
          {
            quantity: max((index + 1) * 10, 200),
            width: 32,
            height: 32,
            speed: Math.pow(index + 1, 2) / 100 + 1,
            color,
            power: index + 1,
            initialLife:
              (Math.log(index + 1) * index + 1) *
              Math.ceil((index ? index : 1) / 5),
            life:
              (Math.log(index + 1) * index + 1) *
              Math.ceil((index ? index : 1) / 5),
            respawnTime: 1000 / (index + 1),
            reward: Math.pow(index + 1, 1.3) + 1,
          },
          {
            quantity: max((index + 1) * 5, 100),
            width: 50,
            height: 50,
            speed: Math.pow(index + 1, 1.5) / 100 + 1,
            color,
            power: index + 1,
            initialLife:
              Math.log(index + 4) *
              (index + 1) *
              2 *
              Math.ceil((index ? index : 1) / 5),
            life:
              Math.log(index + 4) *
              (index + 1) *
              2 *
              Math.ceil((index ? index : 1) / 5),
            respawnTime: 1000 / (index + 1),
            reward: Math.pow(index + 2, 1.3) + 1,
          },
          index && {
            quantity: Math.ceil(index / 2),
            width: 100,
            height: 100,
            speed: 0.5,
            color,
            power: Math.pow(index + 2, 2),
            initialLife:
              Math.pow(index + 2, 3) * Math.ceil((index ? index : 1) / 5),
            life: Math.pow(index + 2, 3) * Math.ceil((index ? index : 1) / 5),
            respawnTime: 10000 / (index + 1),
            reward: Math.pow(index + 2, 3),
          },
        ]
    ).filter(Boolean),
  };
});

export class Stages {
  constructor() {
    const localStorageStages = JSON.parse(localStorage.getItem("stages"));

    this.stages = localStorageStages || STAGES;
    this.currentStageIndex = 0;
  }

  getStage(index) {
    this.saveStagesOnLocalStorage();
    this.currentStageIndex = index;
    return this.stages[index];
  }

  get all() {
    this.saveStagesOnLocalStorage();
    return this.stages;
  }

  get currentStage() {
    return this.stages[this.currentStageIndex];
  }

  enableNextStagesSinceCurrentBoss() {
    const nextBossStage = this.stages.find(
      (stage) => stage.bosStage && !stage.active
    );
    const nextBossStageIndex = this.stages.indexOf(nextBossStage);

    if (this.currentStage.bossKilled) return;

    this.currentStage.bossKilled = true;

    this.stages.forEach((stage, index) => {
      if (index <= nextBossStageIndex) {
        stage.active = true;
      }
    });
  }

  saveStagesOnLocalStorage() {
    localStorage.setItem("stages", JSON.stringify(this.stages));
  }
}

export const stages = new Stages();

console.log(stages.all);
