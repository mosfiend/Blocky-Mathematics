import Matter from "matter-js";
import { Container, Graphics, Sprite } from "pixi.js";
import { Manager } from "../manager";
import { Tween } from "tweedle.js";
export class ColorChanger extends Container {
  constructor(y) {
    super();
    this.x = Manager.width / 2;
    this.y = y;
    this.collected = false;
    this.clr = Manager.colors;
    this.diam = 27;
    this.mainClr = Manager.colors[Math.trunc(Math.random() * 4)];
    this.shape = new Graphics()
      .lineTo(0, 0)
      .beginFill(this.clr[0])
      .arc(0, 0, this.diam, 0, Math.PI / 2)
      .lineTo(0, 0)
      .beginFill(this.clr[2])
      .arc(0, 0, this.diam, Math.PI / 2, Math.PI)
      .lineTo(0, 0)
      .beginFill(this.clr[1])
      .arc(0, 0, this.diam, Math.PI, (Math.PI * 3) / 2)
      .lineTo(0, 0)
      .beginFill(this.clr[3])
      .arc(0, 0, this.diam, (Math.PI * 3) / 2, Math.PI * 2);
    this.addChild(this.shape);
    this.shape.pivot.set(1, 1);
    Manager.app.stage.on("pointermove", () => {
      this.activate();
    });
  }

  update() {
    this.shape.angle += 22.5;
  }
}

export class Star extends Container {
  constructor(y) {
    super();
    this.x = Manager.width / 2;
    this.y = y;
    this.clr = Manager.colors;
    this.sprite = Sprite.from("star");
    this.sprite.anchor.set(0.5, 0.5);
    const SCALE = 30 / this.sprite.width;
    this.sprite.scale.set(SCALE, SCALE);
    this.addChild(this.sprite);
    this.frags = [];

    this.sprite.eventMode = "static";
    this.sprite.on("pointerdown", () => {
      this.activate();
    });
  }

  update() {
    this.frags.forEach((frag) => {
      frag.x = frag.body.position.x;
      frag.y = frag.body.position.y;
    });
  }

  activate() {
    if (this.imploded) return;
    this.imploded = true;
    this.sprite.alpha = 0;
    for (let i = 0; i < Math.random() * 10 + 20; i++) {
      const frag = this.makeFragment();
      this.frags.push(frag);
      this.addChild(frag);

      new Tween(frag)
        .to({ alpha: 0 }, 750)
        .onComplete(() => {
          Matter.World.remove(Manager.physics.world, frag.body);
        })
        .start();
    }
    // this.imploded = true;
  }
  makeFragment() {
    const dim = (1 / Math.sqrt(2)) * this.diam;
    const fragment = Sprite.from("star");
    fragment.x = this.sprite.x / 2 - 30 + 2 * Math.random() * 30;
    fragment.y = this.sprite.y - 25 + 2 * Math.random() * 25;
    const size = 9;
    fragment.width = size;
    fragment.height = size;
    // Math.random() * 4 + 4,
    fragment.body = Matter.Bodies.circle(
      fragment.x + fragment.width / 2,
      fragment.y + fragment.height / 2,
      fragment.width / 2,
      { friction: 0, isSensor: true },
    );
    Matter.World.add(Manager.physics.world, fragment.body);
    return fragment;
  }
}

export class Sign extends Container {
  constructor(y, sign) {
    super();
    this.x = Manager.width / 2;
    this.y = y;
    this.clr = Manager.colors;
    this.shape = Sprite.from(sign);
    const SCALE = 54 / this.shape.width;
    this.shape.scale.set(SCALE, SCALE);
    this.addChild(this.shape);
  }

  update() {}
}
