import { Projectile } from "./projectile.js";

const projectileColorSequence = [
  "red",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "white",
];

export class Player {
  constructor({
    context,
    money = 0,
    width = 32,
    height = 32,
    color = "red",
    power = 1,
    attackSpeed = 1,
    gunsQuantity = 1,
    life = 100,
    fullLife = 100,
  }) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.power = power;
    this.attackSpeed = attackSpeed;
    this.canvas = document.getElementById("canvas");
    this.lastShot = Date.now();
    this.standby = false;
    this.context = context;
    this.money = money;
    this.gunsQuantity = gunsQuantity;
    this.life = life;
    this.fullLife = fullLife;
    this.lifeSteal = 0.2;
    this.status = "alive";

    this.updateLife(this.life);

    this.saveStorage();
  }

  draw(context) {
    context.fillStyle = this.color;
    context.fillRect(
      this.canvas.width / 2 - this.width / 2,
      this.canvas.height / 2 - this.height / 2,
      this.width,
      this.height
    );
  }

  heal(value) {
    if (this.life + value > this.fullLife) {
      return this.updateLife(this.fullLife);
    }
    this.updateLife(this.life + value);
  }

  updateLife(value) {
    const formattedValue = Number(value.toFixed(2));
    const $lifeBar = document.querySelector(".life-bar");
    const $lifeBarValue = document.querySelector(".life-quantity");

    $lifeBarValue.textContent = `${formattedValue}/${this.fullLife}`;
    $lifeBar.style.width = `${(formattedValue / this.fullLife) * 100}%`;

    this.life = formattedValue;
  }

  receiveDamage(damage) {
    this.updateLife(this.life - damage);

    if (this.life <= 0) {
      this.die();
    }
  }

  die() {
    this.money = 0;
    this.updateLife(this.fullLife);
    this.status = "dead";
  }

  alive() {
    this.status = "alive";
  }

  saveStorage() {
    localStorage.setItem("user", JSON.stringify(this));

    setTimeout(() => {
      this.saveStorage();
    }, 1000);
  }

  shoot(target) {
    if (!target[0]) return [];

    if (Date.now() - this.lastShot < 1000 / this.attackSpeed || this.standby) {
      return undefined;
    }

    return [...new Array(this.gunsQuantity)]
      .map((_, index) => {
        if (!target[index]) return undefined;

        const projectile = new Projectile({
          x: this.canvas.width / 2 - this.width / 4,
          y: this.canvas.height / 2 - this.height / 4,
          color:
            projectileColorSequence[index % projectileColorSequence.length],
          power: this.power,
          speed: 5,
          target: target[index],
          context: this.context,
        });

        this.lastShot = Date.now();

        return projectile;
      })
      .filter(Boolean);
  }
}
