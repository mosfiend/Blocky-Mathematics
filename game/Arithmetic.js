import { Body } from "./Body";
import { Container, Graphics, Sprite, Text, warn } from "pixi.js";
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
      Math.floor(availableBlocks / 4) +
      Math.floor((availableBlocks / 4) * Math.random());
    // );
    const idx2 = Math.max(
      idx1 + Math.floor((availableBlocks / 2 - 1) * Math.random()),
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

    for (let i = -1; i < idx1; i++) {
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
      const sprite = Sprite.from(
        idx2 === idx1 + 2
          ? "center"
          : i === idx1 + 1
            ? "corner"
            : i === idx2 - 1
              ? "bottom"
              : "ground",
      );
      sprite.width = 40;
      sprite.height = 40;
      sprite.x = 0;
      sprite.y = 80 + 40 * i;
      this.sprite.addChild(sprite);
    }
    for (let i = idx2 + 1; i < availableBlocks + 10; i++) {
      const sprite = Sprite.from(i === idx2 + 1 ? "corner" : "ground");
      sprite.width = 40;
      sprite.height = 40;
      sprite.x = 0;
      sprite.y = 80 + 40 * i;
      this.sprite.addChild(sprite);
    }

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
    value1.x = 20 - value1.width / 2;
    value1.y = 80 + [idx1, idx2][possibilities] * 40;
    value2.x = 20 - value2.width / 2;
    value2.y = 80 + [idx1, idx2][(possibilities + 1) % 2] * 40;
    this.safeSpace = {
      x: value2.x + this.sprite.x,
      y: value2.y + this.sprite.y,
    };

    this.body = new Body(this.safeSpace.x, this.safeSpace.y + 41, 40, 40, {
      isStatic: true,
    });
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
          this.operands[0] +
            this.operands[1] +
            this.operands[1] * (1 + Math.trunc(Math.random() * 3)),
        );

        this.values.push(
          this.operands[1] +
            this.operands[1] +
            this.operands[0] * (1 + Math.trunc(Math.random() * 3)),
        );
        this.values.push(
          Math.max(this.operands[1], this.operands[0]) -
            Math.max(this.operands[1], this.operands[0]),
        );
        break;
      case "minus":
        this.result = this.operands[0] - this.operands[1];
        let val = Math.abs(this.operands[1] - this.operands[0]);
        if (val === this.result)
          val += this.operands[Math.trunc(Math.random() * 2)];
        this.values.push(val);
        break;
      case "times":
        this.result = this.operands[0] * this.operands[1];
        let val2 = this.operands[1] * (this.operands[0] + 1);
        if (val2 === this.result)
          val2 += this.operands[Math.trunc(Math.random() * 2)];
        this.values.push(val2);
        break;
      case "by":
        this.result = this.operands[0] / this.operands[1];
        this.values.push(this.result + this.operands[1]);
        break;
    }

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
