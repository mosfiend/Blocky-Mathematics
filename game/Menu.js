import { Container, Graphics } from "pixi.js";
import { Manager } from "../manager";

export class Menu extends Container {
  constructor() {
    super();

    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;

    this.bg = new Graphics()
      .rect(0, 0, this.screenWidth, this.screenHeight)
      .fill(0x2e3037);
    this.addChild(this.bg);
  }
  update() {}
}
