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
  }

  changeStage(index) {
    this.stage = STAGES[index];
    this.monsters = [];
    this.spawnMonsters();
    this.draw();
  }

  spawnMonsters() {
    this.stage.monsters.forEach((monster) => {
      for (let i = 0; i < monster.quantity; i++) {
        const newMonster = new Monster({
          x: randomNumber(0, this.canvas.width, -500),
          y: randomNumber(0, this.canvas.height, -500),
          ...monster,
        });

        this.monsters.push(newMonster);
        newMonster.spawn(this.context);
      }
    });
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.draw(this.context);
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
        });

        this.updateMoney(monster.reward);

        this.monsters.splice(this.monsters.indexOf(monster), 1);
        setTimeout(() => {
          this.monsters.push(newMonster);
        }, newMonster.respawnTime);
      }
    });

    const target = this.getCloserMonster();

    this.player.standby = !target;

    this.projectiles.forEach((projectile) => {
      projectile.draw(this.context);
      projectile.moveToTarget(target);
    });

    const shoot = this.player.shoot(target);

    if (shoot) {
      this.projectiles.push(shoot);
    }

    this.projectiles.forEach((projectile) => {
      if (projectile.lifeTime < Date.now() || projectile.status === "dead") {
        this.projectiles.splice(this.projectiles.indexOf(projectile), 1);
      }
    });
  }

  update() {
    this.draw();
    requestAnimationFrame(this.update.bind(this));
  }

  getCloserMonster() {
    const monsters = this.monsters;
    const player = this.player;

    const everyMonsterGonnaDie = monsters.every((monster) =>
      monster.gonnaDie(this.projectiles)
    );

    if (everyMonsterGonnaDie) return undefined;

    const closerMonster = monsters.reduce((prev, current) => {
      if (current.gonnaDie(this.projectiles)) return prev;

      const xPlayerPosition = this.canvas.width / 2 - player.width / 2;

      const yPlayerPosition = this.canvas.height / 2 - player.height / 2;

      const xMonsterPosition = Math.abs(prev.x);
      const yMonsterPosition = Math.abs(prev.y);

      const prevDistance = Math.sqrt(
        Math.pow(xPlayerPosition - xMonsterPosition, 2) +
          Math.pow(yPlayerPosition - yMonsterPosition, 2)
      );

      const xCurrentMonsterPosition = Math.abs(current.x);
      const yCurrentMonsterPosition = Math.abs(current.y);

      const currentDistance = Math.sqrt(
        Math.pow(xPlayerPosition - xCurrentMonsterPosition, 2) +
          Math.pow(yPlayerPosition - yCurrentMonsterPosition, 2)
      );

      return prevDistance > currentDistance ? current : prev;
    }, monsters[0]);

    if (closerMonster.gonnaDie(this.projectiles)) return undefined;

    return closerMonster;
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
}
