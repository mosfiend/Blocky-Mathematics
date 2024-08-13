import { Graphics, Container, RoundedRectangle } from "pixi.js";
import Matter from "matter-js";
import { Manager } from "../manager";

export class Gap {
  constructor(x, blocksY) {
    // this.sprite = new Graphics().beginFill(0x00ff00).drawRect(0, 0, 40 * 5, 40);
    this.sprite = new Container();
    this.sprite.addChild(new Graphics().rect(0, 0, 80, 0).fill());
    this.sprite.x = x;
    this.sprite.y = 560 - 40 * blocksY;
    this.sprite.width = 40 * 2;
  }
  update() {}
}

// How to handle the game loop
//
// How to implement the "gap element"
// Define an obstacle element that contains nothing but a width of 80
//
// //
