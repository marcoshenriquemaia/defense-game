import { Projectile } from "./projectile.js";

export class Player {
  constructor({ context }) {
    this.width = 32;
    this.height = 32;
    this.color = "red";
    this.power = 50;
    this.attackSpeed = 9999999;
    this.canvas = document.getElementById("canvas");
    this.lastShot = Date.now();
    this.standby = false;
    this.context = context;
    this.money = 0;
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

  shoot(target) {
    if (!target) return undefined;

    const projectile = new Projectile({
      x: this.canvas.width / 2 - this.width / 4,
      y: this.canvas.height / 2 - this.height / 4,
      color: this.color,
      power: this.power,
      speed: 5,
      target,
      context: this.context,
    });

    if (Date.now() - this.lastShot < 1000 / this.attackSpeed || this.standby) {
      return undefined;
    }

    this.lastShot = Date.now();

    return projectile;
  }
}
