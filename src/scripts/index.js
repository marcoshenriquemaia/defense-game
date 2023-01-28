import { Player } from "./entities/player.js";
import { World } from "./game.js";
import { STAGES } from "./stages/index.js";
import priceTransition from "./utils/priceTransition.js";

const $buttonStage1 = document.querySelector(".stage-button-1");
const $speedButton = document.querySelector(".button-speed");
const $money = document.querySelector(".money");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const getSpeedPrice = (speed) => {
  return Math.pow(speed, 3);
};

const player = new Player({
  context,
});

const world = new World({
  player,
  canvas,
  context,
});

const printStages = () => {
  const $stages = document.querySelector(".stages");
  STAGES.forEach((stage, index) => {
    const $stageButton = document.createElement("button");
    $stageButton.classList.add(`stage-button-${index + 1}`);
    $stageButton.textContent = stage.name;

    $stages.appendChild($stageButton);

    $stageButton.addEventListener("click", () => {
      world.changeStage(index);
    });
  });
};

world.draw();
world.spawnMonsters();
world.update();

$buttonStage1.addEventListener("click", () => {
  world.changeStage(0);
});

$speedButton.addEventListener("click", () => {
  console.log(player, getSpeedPrice(player.attackSpeed));
  if (player.money >= getSpeedPrice(player.attackSpeed)) {
    player.money -= getSpeedPrice(player.attackSpeed);
    player.attackSpeed += 1;
  }

  priceTransition({
    $element: $money,
    newPrice: player.money,
    duration: 300,
  });

  $speedButton.innerHTML = `Speed: ${player.attackSpeed} ${getSpeedPrice(
    player.attackSpeed
  ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
});

$speedButton.innerHTML = `Speed: ${player.attackSpeed} ${getSpeedPrice(
  player.attackSpeed
).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;

printStages();
