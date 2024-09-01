import { Container, Sprite } from "pixi.js";
import { Easing, Tween } from "tweedle.js";
import { Manager } from "../manager";

export class Coin extends Container {
  constructor(x, y) {
    super();
    this.collected = false;

    this.sprite = Sprite.from("coin");
    this.x = x;
    this.y = 640 - 120 - y;
    this.sprite.width = 30;
    this.sprite.height = 30;
    this.sprite.y = 5;

    this.addChild(this.sprite);
  }
  update() {}
  activate() {
    const move = new Tween(this)
      .to(
        {
          x: Manager.app.stage.pivot.x + 50,
          y: 10.5,
          alpha: 0.2,
        },
        300,
      )
      .onComplete(() => {
        this.removeChild(this.sprite);
      })
      .easing(Easing.Quadratic.In)
      .start();
  }
}
