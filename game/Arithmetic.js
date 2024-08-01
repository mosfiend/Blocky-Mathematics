import { Body } from "./Body";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Manager } from "../manager";

export class Arithmetic {
  constructor(x) {
    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;

    this.sprite = new Container();
    this.sprite.addChild(new Graphics().rect(0, 0, 80, 0).fill());
    this.sprite.x = x;
    this.sprite.y = 80;

    for (let i = 0; i < 10; i++) {
      const sprite = Sprite.from(i === 0 ? "grass" : "ground");
      sprite.x = 0;
      sprite.y = 40 * i;
      sprite.width = 40;
      sprite.height = 40;
      this.sprite.addChild(sprite);
    }

    this.body = new Body(this.sprite.x, this.sprite.y, 40, 40 * 10, {
      isStatic: true,
    });

    this.operators = [...Manager.operators];

    this.values = [];
    this.icons = { plus: "+", minus: "-", times: "×", by: "÷" };
    this.operands = [];
    const lenChoices = 10;
    this.result = 0;
    this.choices = [];
    this.choiceWidth = (this.screenWidth / lenChoices) * 2;
    this.choiceHeight = 30;
    this.sceneWidth = this.choiceWidth * lenChoices;
    this.idx = 0;
    this.sprite.pivot.x = this.choiceWidth * 2;
    this.makeOp();
    console.log(this.values);
  }

  update() {
    this.choices.forEach((choice) => {
      choice.x = (choice.x + 2) % this.sceneWidth;
      if (
        -this.sprite.pivot.x + choice.x > this.screenWidth / 2 - choice.width &&
        -this.sprite.pivot.x + choice.x < this.screenWidth / 2
      ) {
        this.current = choice.val;
      }
    });
    // console.log(this.current);
  }

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
      this.operands[0] +
        " " +
        this.icons[this.operator] +
        " " +
        this.operands[1],
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
    this.values.push(this.result);
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

class Choice extends Container {
  constructor(x, y, width, height, val) {
    super();
    this.x = x;
    this.y = y;
    this.val = val;
    this.text = new Text(this.val, {
      fontWeight: "400",
      fontFamily: "Madimi One",
      letterSpacing: 2,
    });
    this.text.x = width / 2 - this.text.width / 2;
    this.text.y = height / 2 - this.text.height / 2;
    this.sprite = new Graphics().roundRect(0, 0, width, height).fill(0xcccccc);
    this.sprite.eventMode = "static";
    this.sprite.cursor = "pointer";

    this.minWidth = width;
    this.maxWidth = Math.min(this.sprite.width, this.minWidth * 2);
    this.addChild(this.sprite, this.text);
  }

  update() {}
}

//
//
////
//
//
//
//
//
// Constants: block width,
// height
// two windows
