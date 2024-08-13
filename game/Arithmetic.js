import { Body } from "./Body";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Manager } from "../manager";

export class Arithmetic {
  constructor(x, blocksY) {
    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;

    this.sprite = new Container();
    this.sprite.x = x;
    this.sprite.y = 0;
    const availableBlocks = (640 - 80 - blocksY * 40 - 80) / 40;
    // divide into two segments
    const idx1 =
      // Math.max(
      Math.ceil(Math.random() * Math.ceil(availableBlocks / 2));
    // );
    const idx2 = Math.max(
      idx1 + Math.ceil(Math.random() * Math.ceil(availableBlocks / 2)),
      idx1 + 2,
    );

    for (let j = 0; j < availableBlocks; j++) {
      const sprite = Sprite.from("ground");
      sprite.x = 0;
      sprite.y = 640 - 80 - blocksY * 40 + j * 40;
      sprite.width = 40;
      sprite.height = 40;
      this.sprite.addChild(sprite);
    }

    for (let i = 0; i < idx1; i++) {
      const sprite = Sprite.from(
        i === Math.ceil(availableBlocks / 2) - 1 || i === idx1 - 1
          ? "corner"
          : "ground",
      );
      sprite.width = 40;
      sprite.height = 40;
      sprite.x = 40;
      sprite.y = 80 + 40 + 40 * i;
      sprite.angle = 180;
      this.sprite.addChild(sprite);
    }

    for (let i = idx1 + 1; i < idx2; i++) {
      const sprite = Sprite.from(i === idx1 + 1 ? "corner" : "ground");
      sprite.width = 40;
      sprite.height = 40;
      sprite.x = 0;
      sprite.y = 80 + 40 * i;
      this.sprite.addChild(sprite);
    }
    console.log(idx1, idx2);
    for (let i = idx2 + 1; i < availableBlocks; i++) {
      const sprite = Sprite.from(i === idx2 + 1 ? "corner" : "ground");
      sprite.width = 40;
      sprite.height = 40;
      sprite.x = 0;
      sprite.y = 80 + 40 * i;
      this.sprite.addChild(sprite);
    }
    const body1 = new Body(this.sprite.x, this.sprite.y, 40, 40 + idx1 * 40, {
      isStatic: true,
    });

    // const body3 = new Body(
    //   this.sprite.x,
    //   this.sprite.y,
    //   this.sprite.width,
    //   idx1 * 40,
    //   {
    //     isStatic: true,
    //   },
    // );

    // this.bodies = [body1, body2, body3];

    this.operators = [...Manager.operators];

    this.values = [];
    this.icons = { plus: "+", minus: "-", times: "×", by: "÷" };
    this.operands = [];
    const lenChoices = 10;
    this.result = 0;
    this.choiceWidth = (this.screenWidth / lenChoices) * 2;
    this.choiceHeight = 30;
    this.sceneWidth = this.choiceWidth * lenChoices;
    this.idx = 0;
    this.makeOp();
    console.log(this.values);
    const value1 = new Text(
      this.values[Math.trunc(this.values.length * Math.random())],
      {
        fontSize: 30,
        fill: 0xffffff,
        align: "center",
        fontWeight: "bolder",
        fontFamily: "Madimi One",
        letterSpacing: 2,
      },
    );

    const value2 = new Text(this.result, {
      fontSize: 30,
      fill: 0xffffff,
      align: "center",
      fontWeight: "bolder",
      fontFamily: "Madimi One",
      letterSpacing: 2,
    });
    const possibilities = Math.trunc(Math.random() * 2);
    this.sprite.addChild(value1, value2);
    console.log(possibilities, (possibilities + 1) % 2);
    value1.x = 20 - value1.width / 2;
    value1.y = 80 + [idx1, idx2][possibilities] * 40;
    value2.x = 20 - value2.width / 2;
    value2.y = 80 + [idx1, idx2][(possibilities + 1) % 2] * 40;
  }

  update() {}

  makeOp() {
    this.operator =
      this.operators[Math.trunc(Math.random() * this.operators.length)];
    const ceil1 =
      this.operator === "minus" || this.operator === "plus" ? 20 : 10;
    this.operands[0] = Math.trunc(Math.random() * ceil1) + 1;
    const ceil2 =
      this.operator === "minus"
        ? this.operands[0]
        : this.operator === "plus"
          ? 20
          : 10;
    this.operands[1] = Math.trunc(Math.random() * ceil2) + 1;
    if (this.operator === "by") {
      this.operands[0] = this.operands[0] * this.operands[1];
    }
    while (Manager.usedOps.has(this.operands[0] + "+" + this.operands[1])) {
      this.operator =
        this.operators[Math.trunc(Math.random() * this.operators.length)];
      this.operands[0] = Math.trunc(Math.random() * ceil1) + 1;
      this.operands[1] = Math.trunc(Math.random() * ceil2) + 1;
      if (this.operator === "by")
        this.operands[0] = this.operands[0] * this.operands[1];
    }

    Manager.setOperation(
      `${this.operands[0]} ${this.icons[this.operator]} ${this.operands[1]} =   
        `,
    );

    switch (this.operator) {
      case "plus":
        this.result = this.operands[0] + this.operands[1];
        this.values.push(
          this.operands[0] + this.operands[1] + this.operands[1],
        );
        break;
      case "minus":
        this.result = this.operands[0] - this.operands[1];
        this.values.push(Math.abs(this.operands[1] - this.operands[0]));
        break;
      case "times":
        this.result = this.operands[0] * this.operands[1];
        this.values.push(this.operands[1] * (this.operands[0] + 1));
        break;
      case "by":
        this.result = this.operands[0] / this.operands[1];
        this.values.push(this.result + this.operands[1]);
        break;
    }
    if (String(this.result).length === 1) {
      this.values.push(
        Number(String(this.result) * Math.trunc(Math.random() * 3)),
      );
    } else {
      this.values.push(
        Number(String(this.result).split("").reverse().join("")),
      );
    }
    this.values.push(this.result + Math.trunc(Math.random() * 10) + 1);
    this.values.push(this.result + Math.trunc(Math.random() * 20) + 1);
    for (let i = 0, l = this.values.length; i < l; i++) {
      this.values.push(this.values[i]);
    }
    Manager.usedOps.add(this.operands[0] + "+" + this.operands[1]);
  }
}

//Thank you, and goodbye!
//
//The latter half of the tiles
//
//
//
//
//
//
//
//
//
// An easier way to do all of this:
// draw draw draw, leave a gap
// draw draw draw, leave another gap
