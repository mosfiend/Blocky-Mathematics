import { v4 as uuidv4 } from "uuid";
import { Manager } from "../manager";

export const bodies = [];

export class Body {
  constructor(x, y, width, height, properties) {
    this.x = x;
    this.y = y;

    this.prevX = 0;
    this.prevY = 0;
    this.width = width;
    this.height = height;
    this.id = uuidv4();
    this.dx = 2;
    this.dy = 0;
    this.gravity = 5;
    this.isStatic = properties?.isStatic || false;
    this.grounded = false;
    if (this.isStatic) {
      Manager.obstacles.push(this);
    } else {
      Manager.bodies.push(this);
    }

    this.position = {
      x: this.x,
      y: this.y,
    };
  }

  setVelocity(x, y) {
    this.dx = x || this.dx;
    this.dy = y || this.dy;
  }

  update() {
    if (this.isStatic) return;
    this.prevX = this.x;
    this.prevY = this.y;
    this.x += this.dx;
    this.y += this.dy;
    this.position.x = this.x;
    this.position.y = this.y;
    this.gravity = this.grounded ? 0 : 5;
    this.dy = Math.min(this.gravity, this.dy + 0.5);
  }
}
