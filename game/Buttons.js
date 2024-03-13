import { Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import { Manager } from "../manager.js";

export class Selection extends Container {
  constructor() {
    super();
    this.plus = new Icon("plus");
    this.minus = new Icon("minus");
    this.times = new Icon("times");
    this.by = new Icon("by");
    this.HEIGHT = 60;
    this.minus.x = this.plus.width + 10;
    this.times.x = this.minus.width + this.minus.x + 10;
    this.by.x = this.times.width + this.times.x + 10;
    this.addChild(this.plus, this.minus, this.times, this.by);
    // this.scale.set(0.3, 0.3);
  }
}

export class Icon extends Container {
  constructor(texture) {
    super();
    this.operator = texture;
    this.selected = Manager.arithmetic[texture];
    this.icons = { plus: "+", minus: "-", times: "×", by: "÷" };

    this.border = new Graphics()
      .beginFill(0x4eac8e)
      .drawRoundedRect(0, 0, 68, 60, 20);
    this.text = new Text(this.icons[texture], {
      fill: 0xffffff,
      fontFamily: "Madimi One",
      fontSize: 36,
      fontWeight: "1000",
    });
    this.text.x = this.border.width / 2 - this.text.width / 2;
    this.text.y = this.border.height / 2 - this.text.height / 2;
    this.border.addChild(this.text);
    this.addChild(this.border);
    this.eventMode = "static";
    this.cursor = "pointer";

    this.alpha = Manager.arithmetic[this.operator] ? 1 : 0.6;
    this.on("pointerdown", () => {
      console.log("selection");
      this.select();
    });
  }
  select() {
    if (!this.selected) {
      this.alpha = 1;
      Manager.arithmetic[this.operator] = true;
    } else {
      if (this.checkFalsehood() === 1) return;
      this.alpha = 0.6;
      Manager.arithmetic[this.operator] = false;
    }

    this.selected = !this.selected;
  }
  checkFalsehood() {
    let output = 0;
    for (let operator in Manager.arithmetic) {
      if (Manager.arithmetic[operator]) output++;
    }
    return output;
  }
}
