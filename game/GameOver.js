import { Tween } from "tweedle.js";
import { Container,Graphics, Sprite } from "pixi.js";
import { Menu } from "./Menu";
import { Selection } from "./Buttons";
import { Manager } from "../manager";

export class GameOver extends Container {
  constructor(cb) {
    super();
    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;
    // this.bg = new Graphics()
    //   .beginFill(0x2e3037)
    //   .drawRect(0, 0, this.screenWidth, this.screenHeight);
    this.y = this.screenHeight / 3;
    this.selection = new Selection();
    this.selection.x = this.screenWidth / 2 - this.selection.width / 2;
    this.selection.y = 10;
    this.border = new Graphics()
      .beginFill(0xcee7e1)
      .drawRect(0, 0, this.screenWidth, 78);
    this.again = Sprite.from("again");
    this.again.width = 80;
    this.again.height = 80;
    this.again.x = this.screenWidth / 2 - this.again.width / 2;
    this.again.y = 150;

    this.again.eventMode = "static";
    this.again.cursor = "pointer";
    this.again.on("pointerdown", () => {
      const operators = [];
      for (let operator in Manager.arithmetic) {
        if (Manager.arithmetic[operator]) {
          operators.push(operator);
        } else {
        }
      }
      Manager.operators = operators;
      cb();
    });
    this.bg = new Graphics()
      .beginFill(0x2e3037)
      .drawRect(0, 0, this.screenWidth, this.screenHeight);
    this.addChild(this.bg, this.border, this.selection, this.again);

    new Tween(this.again)
      .to({ width: 90, height: 90 }, 750)
      .repeat(Infinity)
      .start()
      .yoyo(true);
  }
}
