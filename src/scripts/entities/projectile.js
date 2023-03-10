import { damage } from "../feedbacks/damage.js";
import { between } from "../utils/between.js";

export class Projectile {
  constructor({ x, y, color, power, speed, target, context }) {
    this.width = 5;
    this.height = 5;
    this.color = color;
    this.x = x;
    this.y = y;
    this.power = power;
    this.speed = speed;
    this.canvas = document.getElementById("canvas");
    this.status = "alive";
    this.target = target;
    this.lifeTime = Date.now() + 5000;
    this.id = Math.random();
    this.context = context;
    this.player = target.player;
  }

  spawn(context) {
    this.draw(context);
  }

  moveToTarget() {
    const diagonal = Math.sqrt(
      Math.pow(this.target.x - this.x, 2) + Math.pow(this.target.y - this.y, 2)
    );

    const x = (this.target.x - this.x + this.target.width / 2) / diagonal;
    const y = (this.target.y - this.y + this.target.height / 2) / diagonal;

    this.x += x * this.speed;
    this.y += y * this.speed;
  }

  draw(context) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
    this.checkCollision(this.target);

    if (this.target.life <= 0) {
      this.status = "dead";
    }
  }

  checkCollision(target) {
    if (
      target.x + target.width >= this.x &&
      target.x <= this.x + this.width &&
      target.y + target.height >= this.y &&
      target.y <= this.y + this.height
    ) {
      target.life -= this.power;
      this.printDamage(this.context);
      this.status = "dead";
      this.player.heal(this.player.power * this.player.lifeSteal);
    }
  }

  printDamage(context) {
    if (this.target.life <= 0) {
      this.target.murdered = true;
      damage(this.target.x, this.target.y, this.power, context, this.target.id);
    }
    if (
      between(
        this.x,
        this.target.x - this.target.width,
        this.target.x + this.target.width
      ) &&
      between(
        this.y,
        this.target.y - this.target.width,
        this.target.y + this.target.width
      )
    ) {
      damage(this.target.x, this.target.y, this.power, context, this.target.id);
    }
  }
}
