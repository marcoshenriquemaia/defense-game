import { between } from "../utils/between.js";

export class Monster {
  constructor({
    width = 32,
    height = 32,
    color = "green",
    x = 0,
    y = 0,
    power = 1,
    attackSpeed = 1,
    speed = 1,
    life = 100,
    initialLife = 100,
    respawnTime = 1000,
    reward = 10,
    player,
    boss = false,
  }) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.power = power;
    this.attackSpeed = attackSpeed;
    this.speed = speed;
    this.life = life;
    this.canvas = document.getElementById("canvas");
    this.status = "alive";
    this.initialLife = initialLife;
    this.respawnTime = respawnTime;
    this.reward = reward;
    this.murdered = false;
    this.player = player;
    this.boss = boss;
  }

  spawn(context) {
    this.draw(context);
  }

  walkToTheCenter() {
    const diagonal = Math.sqrt(
      Math.pow(this.canvas.width / 2 - this.width / 2 - this.x, 2) +
        Math.pow(this.canvas.height / 2 - this.height / 2 - this.y, 2)
    );

    const x = (this.canvas.width / 2 - this.width / 2 - this.x) / diagonal;
    const y = (this.canvas.height / 2 - this.height / 2 - this.y) / diagonal;

    this.x += x * this.speed;
    this.y += y * this.speed;

    this.checkCollision();
  }

  draw(context) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
    if (this.life <= 0) {
      this.status = "dead";
    }
  }

  explode(player) {
    player.receiveDamage(this.power);
    this.status = "dead";

    this.explosionEffect();
  }

  explosionEffect() {
    this.color = "red";
    setTimeout(() => {
      this.color = "green";
    }, 100);
  }

  checkCollision() {
    const xIsOnCenter = between(
      Math.floor(this.x),
      this.canvas.width / 2 - this.width / 2 - 10,
      this.canvas.width / 2 - this.width / 2 + 10
    );

    const yIsOnCenter = between(
      Math.floor(this.y),
      this.canvas.height / 2 - this.height / 2 - 10,
      this.canvas.height / 2 - this.height / 2 + 10
    );

    if (xIsOnCenter && yIsOnCenter) {
      this.status = "dead";
      this.player.receiveDamage(this.power);
    }
  }

  gonnaDie(projectiles) {
    const projectileComing = projectiles.filter(
      (projectile) => projectile.target === this
    );

    const damage = projectileComing.reduce((acc, projectile) => {
      return acc + projectile.power;
    }, 0);

    if (damage >= this.life) {
      return true;
    }

    return false;
  }
}
