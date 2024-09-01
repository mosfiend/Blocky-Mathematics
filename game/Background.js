import {
  Container,
  Graphics,
  Sprite,
  Texture,
  TilingSprite,
  Assets,
} from "pixi.js";
import Matter from "matter-js";
import { Manager } from "../manager";
import { Body } from "./Body";

export class Background extends Container {
  constructor() {
    super();
    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;

    // (this.clouds1 = Sprite.from("clouds1"));
    // this.clouds1.scale.x = 2;
    // this.clouds1.scale.y = 2;

    this.clouds1 = new Clouds("clouds1", 2);
    this.clouds2 = new Clouds("clouds2", 1.3);
    this.trees1 = new Trees("trees1", 0.4);
    // this.trees1.x = -10;
    this.trees1.y = 220;
    this.trees1.alpha = 0.96;
    this.trees2 = new Trees("trees2", 0.4);
    // this.trees2.x = -10;
    this.trees2.y = 300;
    this.filler = new Graphics()
      .rect(0, 0, this.screenWidth + 20, 100)
      .fill(0x11211e);
    this.filler.x = 0;
    this.filler.y = this.screenHeight - 100;
    this.addChild(
      this.clouds1,
      this.clouds2,
      this.trees1,
      this.trees2,
      this.filler,
    );
  }

  update(deltaTime) {
    this.x = Manager.app.stage.pivot.x;
    // this.clouds1.tilePosition.x -= 0.1;
    // this.clouds2.tilePosition.x -= 0.25;
    this.trees1.tilePosition.x -= 0.4;
    this.trees2.tilePosition.x -= 0.8;
    // Matter.Body.rotate(this.roofTile.body, 0.01);
    // // Matter.Body.setAngle(this.roofTile.body, Math.PI / 4);
    // const anga = (this.roofTile.body.angle / Math.PI) * 180;
    // this.roofTile.sprite.angle = anga;
    // this.roofTile.sprite.x = this.roofTile.body.position.x;
    // this.roofTile.sprite.y = this.roofTile.body.position.y;
  }
}

class Clouds extends Container {
  constructor(texture, scale) {
    super();
    // this.texture = Texture.from(texture);
    this.graph = new Graphics()
      .rect(-10, 0, Manager.width + 20, Manager.height)
      .fill(0x50b4d4);
    this.addChild(this.graph);
  }
}

class Trees extends TilingSprite {
  constructor(texture, scale) {
    super();
    this.texture = Texture.from(texture);
    this.scale.x = scale;
    this.scale.y = scale;
    this.width = Manager.width / scale + 20;
    this.height = Manager.height / scale;
  }
}
