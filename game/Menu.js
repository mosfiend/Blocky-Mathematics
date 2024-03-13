import { Container, Graphics } from "pixi.js";
import { Manager } from "../manager";

export class Menu extends Container {
  constructor() {
    super();

    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;

    this.bg = new Graphics()
      .beginFill(0x2e3037)
      .drawRect(0, 0, this.screenWidth, this.screenHeight);
    this.addChild(this.bg);
  }
  update() {}
}
