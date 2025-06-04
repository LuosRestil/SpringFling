import { Vec2 } from "bz-game-utils";
import { Player } from "./player";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const bg = "dodgerblue";
ctx.fillStyle = "dodgerblue";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const arrowheadAngle = Math.PI / 6;
const arrowColor = "red";

const player = new Player(new Vec2(canvas.width / 2, canvas.height / 2));
const mouse = new Vec2(0, 0);
let dragging = false;
let power = new Vec2(0, 0);

requestAnimationFrame(loop);

function loop(_: number): void {
  // TODO handle large timestep from tabbing away
  requestAnimationFrame(loop);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  update();
  draw(ctx);
  ctx.fillStyle = "white";
  ctx.font = "18px monospace";
  ctx.fillText(`(${power.x}, ${power.y})`, 350, 50);
}

function update() {
  player.update();
}

function draw(ctx: CanvasRenderingContext2D) {
  player.draw(ctx);
  if (dragging && power.mag()) {
    drawArrow();
  }
}

canvas.addEventListener("mousedown", handleMousedown);
canvas.addEventListener("touchstart", handleTouchstart);
canvas.addEventListener("mousemove", handleMousemove);
canvas.addEventListener("touchmove", handleTouchmove);
canvas.addEventListener("mouseup", handleRelease);
canvas.addEventListener("touchend", handleRelease);

function handleMousedown(evt: MouseEvent) {
  handleClickTouch(evt.clientX, evt.clientY);
}

function handleTouchstart(evt: TouchEvent) {
  // what happens if the user touches with a second finger?
  handleClickTouch(evt.touches[0].clientX, evt.touches[0].clientY);
}

function handleClickTouch(x: number, y: number) {
  setMousePos(x, y);
  if (colliding(mouse, player)) {
    dragging = true;
  }
}

function setMousePos(x: number, y: number): void {
  mouse.x = x;
  mouse.y = y;
}

function handleMousemove(evt: MouseEvent) {
  handleMove(evt.clientX, evt.clientY);
}

function handleTouchmove(evt: TouchEvent) {
  handleMove(evt.touches[0].clientX, evt.touches[0].clientY);
}

function handleMove(x: number, y: number) {
  setMousePos(x, y);
  if (dragging) {
    setPower(mouse, player);
  }
}

function setPower(mouse: Vec2, player: Player) {
  power = Vec2.subtract(player.pos, mouse);
}

function colliding(mouse: Vec2, player: Player): boolean {
  const dist = Vec2.dist(mouse, player.pos);
  return dist <= player.clickRadius;
}

function handleRelease() {
  // what happens if the user presses with one finger
  // then presses with another finger
  // then lifts the first finger?

  player.launch(Vec2.scale(power, 0.2));
  power.x = 0;
  power.y = 0;
  dragging = false;
}

function drawLine(src: Vec2, dest: Vec2, width: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(src.x, src.y);
  ctx.lineTo(dest.x, dest.y);
  ctx.stroke();
}

function drawArrow() {
  const angle = angleBetween(mouse, player.pos);
  const powerMag = power.mag();
  const lineWidth = powerMag * 0.1;

  ctx.fillStyle = "white";
  ctx.fillText(powerMag.toString(), 600, 50);

  drawLine(
    player.pos,
    Vec2.add(player.pos, vecFromAngle(angle, powerMag)),
    lineWidth,
    arrowColor
  );
  drawLine(
    player.pos,
    Vec2.add(player.pos, vecFromAngle(angle + arrowheadAngle, powerMag * 0.25)),
    lineWidth,
    arrowColor
  );
  drawLine(
    player.pos,
    Vec2.add(player.pos, vecFromAngle(angle - arrowheadAngle, powerMag * 0.25)),
    lineWidth,
    arrowColor
  );
}

function vecFromAngle(angle: number, length: number) {
  return new Vec2(Math.sin(angle), Math.cos(angle)).scale(length);
}

function angleBetween(a: Vec2, b: Vec2): number {
  return Math.atan2(a.x - b.x, a.y - b.y);
}
