import { Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import { Manager } from "../manager.js";

export class Sounds extends Container {
  constructor() {
    super();
    this.x = 15;
    this.y = 10;

    this.bg = new Graphics().rect(0, 0, 700, 45).fill(0x222244);
    this.bg.x = -50;
    this.bg.y = -5;
    this.bg.alpha = 0.3;

    this.music = new Icon("music");
    this.music.x = 0;

    this.sfx = new Icon("sfx");
    this.sfx.x = Manager.width - this.sfx.width - 25;

    this.addChild(this.bg, this.music, this.sfx);
  }
  update(deltaTime) {
    this.x = Manager.app.stage.pivot.x + 15;
  }
}

class Icon extends Container {
  constructor(texture) {
    super();
    this.soundType = texture;
    this.selected = Manager.soundSettings[this.soundType];

    this.sprite = Sprite.from(texture);
    const SCALE = 35 / this.sprite.height;
    this.sprite.scale.x = SCALE;
    this.sprite.scale.y = SCALE;
    this.sprite.tint = 0xccccff;
    this.alpha = this.selected ? 1 : 0.6;
    Manager[this.soundType].volume = this.selected
      ? this.soundType === "sfx"
        ? 0.05
        : 0.11
      : 0;
    this.addChild(this.sprite);
    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerdown", this.toggle);
  }
  toggle(e) {
    e.stopPropagation();
    if (!this.selected) {
      this.alpha = 1;
      Manager[this.soundType].volume = 0.05;
      //enable music
      // this.teme.volume = 1
    } else {
      this.alpha = 0.6;
      Manager[this.soundType].volume = 0;
    }

    localStorage.setItem(
      "soundSettings",
      JSON.stringify(Manager.soundSettings),
    );
    this.selected = !this.selected;
  }
}
