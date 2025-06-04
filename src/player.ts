import { Vec2 } from "bz-game-utils";

export class Player {
  pos: Vec2;
  vel: Vec2;
  size: number = 20;
  clickRadius: number = 40;

  constructor(pos: Vec2) {
    this.pos = pos;
    this.vel = new Vec2(0, 0);
  }

  update() {
    this.pos.add(this.vel);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.clickRadius, 0, Math.PI * 2);
    ctx.stroke();
  }

  launch(power: Vec2) {
    this.vel.x = power.x;
    this.vel.y = power.y;
  }
}
