import { Player } from "./entities/player.js";
import { World } from "./game.js";
import { stages } from "./stages/index.js";
import { isDev } from "./utils/isDev.js";
import priceTransition from "./utils/priceTransition.js";

const $speedButton = document.querySelector(".button-speed");
const $powerButton = document.querySelector(".button-power");
const $gunButton = document.querySelector(".button-gun");
const $money = document.querySelector(".money");
const $lifeButton = document.querySelector(".button-life");
const $infoButton = document.querySelector(".info-button");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = window.outerWidth - 50;
canvas.height =
  window.outerWidth > 1024 ? window.innerHeight - 100 : window.outerHeight;

const getSpeedPrice = (speed) => {
  return Math.pow(speed * SPEED_PRICE, 2);
};

const userStorage = localStorage.getItem("user");

const devPlayer = new Player({
  context,
  power: 50,
  money: 100000000,
  life: 100000000,
  attackSpeed: 20,
  speed: 0.1,
  gunsQuantity: 1,
});

const player = isDev()
  ? devPlayer
  : new Player(
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

const GUN_PRICE = 20000;
const POWER_PRICE = 100;
const SPEED_PRICE = 3;
const LIFE_PRICE = 10;

export const printStages = () => {
  const $stages = document.querySelector(".stages");

  $stages.innerHTML = "";

  stages.all.forEach((currentStage, index) => {
    const $stageButton = document.createElement("button");
    $stageButton.classList.add(`stage-button-${index + 1}`);
    $stageButton.classList.add("stage-button");
    !currentStage.active && $stageButton.classList.add("disabled");
    currentStage.bosStage && $stageButton.classList.add("boss");
    currentStage.bossKilled && $stageButton.classList.add("killed");
    stages.currentStageIndex === index && $stageButton.classList.add("active");
    $stageButton.textContent = currentStage.bosStage
      ? "Boss"
      : currentStage.name;

    $stages.appendChild($stageButton);

    $stageButton.addEventListener("click", () => {
      if ($stageButton.classList.contains("active")) return;
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
  if (player.money >= Math.pow(GUN_PRICE * player.gunsQuantity, 1.2)) {
    player.money -= Math.pow(GUN_PRICE * player.gunsQuantity, 1.2);
    player.gunsQuantity += 1;
  }

  priceTransition({
    $element: $money,
    newPrice: player.money,
    duration: 300,
  });

  $gunButton.innerHTML = `Guns: ${player.gunsQuantity} ${Math.pow(
    GUN_PRICE * player.gunsQuantity,
    1.2
  ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
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

$infoButton.addEventListener("click", () => {
  const $info = document.querySelector(".info-modal");
  $info.classList.toggle("active");
});

$speedButton.innerHTML = `Speed: ${player.attackSpeed} ${getSpeedPrice(
  player.attackSpeed
).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;

$powerButton.innerHTML = `Power: ${player.power} ${Math.pow(
  player.power * POWER_PRICE,
  1.2
).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;

$gunButton.innerHTML = `Guns: ${player.gunsQuantity} ${Math.pow(
  GUN_PRICE * player.gunsQuantity,
  1.2
).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;

$money.innerHTML = player.money.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL",
});

$lifeButton.innerHTML = `Life: ${player.fullLife} ${(
  LIFE_PRICE * player.fullLife
).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;

printStages();

const $buttonList = document.querySelectorAll(".button");

$buttonList.forEach(($button) => {
  $button.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const scrollClick = e.which == 2;

    if (!scrollClick) return;

    if ($button.classList.contains("active-buy")) {
      $button.classList.remove("active-buy");
      return;
    }

    $buttonList.forEach(($button) => {
      $button.classList.remove("active-buy");
    });

    $button.classList.add("active-buy");
  });
});

const autoBuy = () => {
  const $button = document.querySelector(".active-buy");

  if ($button) {
    $button.click();
  }

  setTimeout(autoBuy, 100);
};

autoBuy();
