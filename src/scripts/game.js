import { Monster } from "./entities/monster.js";
import { STAGES } from "./stages/index.js";
import priceTransition from "./utils/priceTransition.js";
import { randomNumber } from "./utils/randomNumber.js";

export class World {
  constructor({ player, canvas, context }) {
    this.canvas = canvas;
    this.context = context;
    this.player = player;
    this.monsters = [];
    this.projectiles = [];
    this.stage = STAGES[0];

    this.updateInfo();
  }

  changeStage(index, notDraw) {
    this.stage = STAGES[index];
    this.monsters = [];
    this.spawnMonsters();
    !notDraw && this.draw(this.stage.name);
    this.updateInfo();
  }

  spawnMonsters() {
    this.stage.monsters.forEach((monster) => {
      for (let i = 0; i < monster.quantity; i++) {
        const newMonster = new Monster({
          x: randomNumber(0, this.canvas.width, -500),
          y: randomNumber(0, this.canvas.height, -500),
          ...monster,
          player: this.player,
        });

        this.monsters.push(newMonster);
        newMonster.spawn(this.context);
      }
    });
  }

  draw(stageName) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.draw(this.context);
    if (this.player.status === "dead") {
      this.changeStage(0, true);
      this.player.alive();
    }
    this.monsters.forEach((monster) => {
      monster.walkToTheCenter();
      monster.draw(this.context);

      if (
        monster.x === this.canvas.width / 2 - monster.width / 2 &&
        monster.y === this.canvas.height / 2 - monster.height / 2
      ) {
        monster.explode(this.player);
      }

      if (monster.status === "dead") {
        const newMonster = new Monster({
          ...monster,
          status: "alive",
          life: monster.initialLife,
          x: randomNumber(0, this.canvas.width, -500),
          y: randomNumber(0, this.canvas.height, -500),
          player: this.player,
        });

        if (monster.murdered) this.updateMoney(monster.reward);

        this.monsters.splice(this.monsters.indexOf(monster), 1);
        setTimeout(() => {
          if (stageName !== this.stage.name) return;

          this.monsters.push(newMonster);
        }, newMonster.respawnTime);
      }
    });

    const target = this.getCloserMonster();

    this.player.standby = !target[0];

    this.projectiles.forEach((projectile) => {
      projectile.draw(this.context);
      projectile.moveToTarget(target);
    });

    const shoot = this.player.shoot(target);

    if (shoot) {
      shoot.forEach((projectile) => {
        if (!projectile) return;
        this.projectiles.push(projectile);
      });
    }

    this.projectiles.forEach((projectile) => {
      if (projectile.lifeTime < Date.now() || projectile.status === "dead") {
        this.projectiles.splice(this.projectiles.indexOf(projectile), 1);
      }
    });
  }

  update() {
    this.draw(this.stage.name);
    requestAnimationFrame(this.update.bind(this));
  }

  getCloserMonster() {
    const monsters = this.monsters;

    const everyMonsterGonnaDie = monsters.every((monster) =>
      monster.gonnaDie(this.projectiles)
    );

    if (everyMonsterGonnaDie) return [];

    const closerMonsters = monsters
      .sort((a, b) => {
        const aDistance = Math.sqrt(
          Math.pow(a.x - this.canvas.width / 2, 2) +
            Math.pow(a.y - this.canvas.height / 2, 2)
        );
        const bDistance = Math.sqrt(
          Math.pow(b.x - this.canvas.width / 2, 2) +
            Math.pow(b.y - this.canvas.height / 2, 2)
        );

        if (aDistance < bDistance) return 1;
        if (aDistance > bDistance) return -1;

        return 0;
      })
      .filter((monster) => !monster.gonnaDie(this.projectiles))
      .reverse();

    return closerMonsters;
  }

  updateMoney(money) {
    const $money = document.querySelector(".money");

    this.player.money += money;
    priceTransition({
      $element: $money,
      newPrice: this.player.money,
      duration: 300,
    });
  }

  updateInfo() {
    const $life = document.querySelector(".info-life");
    const $attack = document.querySelector(".info-attack");
    const $speed = document.querySelector(".info-speed");
    const $reward = document.querySelector(".info-reward");
    const $name = document.querySelector(".info-name");

    $life.textContent = "Life:" + Math.ceil(this.stage.monsters[0].life);
    $attack.textContent = "Attack:" + this.stage.monsters[0].power;
    $speed.textContent = "Speed:" + this.stage.monsters[0].speed.toFixed(2);
    $reward.textContent =
      "Reward:" +
      this.stage.monsters[0].reward.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    $name.textContent = "Name:" + this.stage.name;
  }
}