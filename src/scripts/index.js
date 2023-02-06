import { Player } from "./entities/player.js";
import { World } from "./game.js";
import { STAGES } from "./stages/index.js";
import priceTransition from "./utils/priceTransition.js";

const $speedButton = document.querySelector(".button-speed");
const $powerButton = document.querySelector(".button-power");
const $gunButton = document.querySelector(".button-gun");
const $money = document.querySelector(".money");
const $lifeStealButton = document.querySelector(".button-life-steal");
const $lifeButton = document.querySelector(".button-life");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = window.outerWidth;
canvas.height =
  window.outerWidth > 1024 ? window.innerHeight - 100 : window.outerHeight;

const getSpeedPrice = (speed) => {
  return Math.pow(speed * SPEED_PRICE, 2);
};

const userStorage = localStorage.getItem("user");

const player = new Player(
  userStorage
    ? JSON.parse(userStorage)
    : {
        context,
      }
);

const world = new World({
  player,
  canvas,
  context,
});

const GUN_PRICE = 50000;
const POWER_PRICE = 100;
const SPEED_PRICE = 3;
const LIFE_STEAL_VALUE = Number((player.lifeSteal * 100 * 200).toFixed(2));
const LIFE_PRICE = 10;

const printStages = () => {
  const $stages = document.querySelector(".stages");

  STAGES.forEach((stage, index) => {
    const $stageButton = document.createElement("button");
    $stageButton.classList.add(`stage-button-${index + 1}`);
    $stageButton.classList.add("stage-button");
    $stageButton.textContent = stage.name;

    $stages.appendChild($stageButton);

    $stageButton.addEventListener("click", () => {
      world.changeStage(index);

      [...document.querySelectorAll(".stage-button")].forEach(($button) => {
        $button.classList.remove("active");
      });

      $stageButton.classList.add("active");
    });
  });
};

world.draw();
world.spawnMonsters();
world.update();

$speedButton.addEventListener("click", () => {
  if (player.money >= getSpeedPrice(player.attackSpeed)) {
    player.money -= getSpeedPrice(player.attackSpeed);
    player.attackSpeed = Number((player.attackSpeed + 0.1).toFixed(1));
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

$powerButton.addEventListener("click", () => {
  if (player.money >= Math.pow(player.power * POWER_PRICE, 1.2)) {
    player.money -= Math.pow(player.power * POWER_PRICE, 1.2);
    player.power += 1;
  }

  priceTransition({
    $element: $money,
    newPrice: player.money,
    duration: 300,
  });

  $powerButton.innerHTML = `Power: ${player.power} ${Math.pow(
    player.power * POWER_PRICE,
    1.2
  ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
});

$gunButton.addEventListener("click", () => {
  if (player.money >= GUN_PRICE * player.gunsQuantity) {
    player.money -= GUN_PRICE * player.gunsQuantity;
    player.gunsQuantity += 1;
  }

  priceTransition({
    $element: $money,
    newPrice: player.money,
    duration: 300,
  });

  $gunButton.innerHTML = `Guns: ${player.gunsQuantity} ${(
    GUN_PRICE * player.gunsQuantity
  ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
});

$lifeStealButton.addEventListener("click", () => {
  if (player.money >= LIFE_STEAL_VALUE) {
    player.money -= LIFE_STEAL_VALUE;
    player.lifeSteal += 0.1;
  }

  priceTransition({
    $element: $money,
    newPrice: player.money,
    duration: 300,
  });

  $lifeStealButton.innerHTML = `Life Steal: ${
    player.lifeSteal
  } ${LIFE_STEAL_VALUE.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}`;
});

$lifeButton.addEventListener("click", () => {
  if (player.money >= LIFE_PRICE * player.fullLife) {
    player.money -= LIFE_PRICE * player.fullLife;
    player.fullLife += 1;
  }

  priceTransition({
    $element: $money,
    newPrice: player.money,
    duration: 300,
  });

  $lifeButton.innerHTML = `Life: ${player.fullLife} ${(
    LIFE_PRICE * player.fullLife
  ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
});

$speedButton.innerHTML = `Speed: ${player.attackSpeed} ${getSpeedPrice(
  player.attackSpeed
).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;

$powerButton.innerHTML = `Power: ${player.power} ${Math.pow(
  player.power * POWER_PRICE,
  1.2
).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;

$gunButton.innerHTML = `Guns: ${player.gunsQuantity} ${(
  GUN_PRICE * player.gunsQuantity
).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;

$money.innerHTML = player.money.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL",
});

$lifeStealButton.innerHTML = `LifeSteal: ${player.lifeSteal.toFixed(
  1
)} ${LIFE_STEAL_VALUE.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL",
})}`;

$lifeButton.innerHTML = `Life: ${player.life} ${(
  LIFE_PRICE * player.life
).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;

printStages();
