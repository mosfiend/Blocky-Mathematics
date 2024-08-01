import { Container, Sprite } from "pixi.js";
import { Manager } from "../manager";
import { Arithmetic } from "./Arithmetic";
import { Body } from "./Body";
import { Gap } from "./Obstacles";
export class GameLoop extends Container {
  constructor() {
    super();
    this.curBlock = 1;
    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;
    this.diam = 40;
    this.obstacles = [Gap, Arithmetic];
    this.blocks = [];
    this.platforms = [];
    this.ceilings = [];
    this.step = 1;
    const newBlock = 2;

    const ceiling1 = new Ceiling(
      0,
      2 * Math.ceil(this.screenWidth / this.diam),
    );
    const ceiling2 = new Ceiling(
      this.screenWidth * 2,
      2 * Math.ceil(this.screenWidth / this.diam),
    );
    const firstPlatform = new Platform(
      -40,
      newBlock,
      Math.ceil(this.screenWidth / this.diam),
    );

    this.curBlock = newBlock;
    this.addChild(firstPlatform.sprite);
    this.addChild(ceiling1.sprite, ceiling2.sprite);
    this.platforms.push(firstPlatform);
    this.ceilings.push(ceiling1, ceiling2);
  }

  update(deltaTime) {
    const x1 = this.ceilings[0].sprite.x;
    const x2 = this.ceilings[1].sprite.x;
    if (x1 < x2) {
      if (x1 - Manager.app.stage.pivot.x < -800) {
        this.ceilings[0].sprite.x =
          this.ceilings[1].sprite.x + this.screenWidth * 2;
      }
    } else {
      if (x2 - Manager.app.stage.pivot.x < -800) {
        this.ceilings[1].sprite.x =
          this.ceilings[0].sprite.x + this.screenWidth * 2;
      }
    }

    this.platforms.forEach((platform) => {
      platform.update(deltaTime);
    });

    const lastPlatform = this.platforms[this.platforms.length - 1].sprite;
    // console.log(lastPlatform.x, Manager.app.stage.pivot.x);
    if (lastPlatform.x < Manager.app.stage.pivot.x + Manager.width) {
      if (this.step !== 3) {
        let newBlock =
          this.curBlock +
          Math.trunc(Math.random() * 3) *
            [-1, 1][Math.trunc(Math.random() * 2)];
        if (newBlock < 1) newBlock = 1;
        if (newBlock > 6) newBlock = 6;
        if (this.step === 4) newBlock = this.curBlock;
        this.createPlatform(lastPlatform, newBlock);
      } else {
        this.createObstacle(lastPlatform, this.curBlock);
      }
    }
  }
  createPlatform(lastPlatform, newBlock) {
    const platform = [
      new Platform(
        lastPlatform.x + lastPlatform.width,
        newBlock,
        3 + Math.trunc(Math.random() * 5),
      ),
      // new Arithmetic(lastPlatform.x + 40, newBlock),
    ][Math.trunc(Math.random() * 1)];
    this.curBlock = newBlock;
    this.addChild(platform.sprite);
    this.platforms.push(platform);
    this.step = (this.step + 1) % 5;
  }

  createObstacle(lastPlatform, newBlock) {
    console.log(this.obstacles);
    const Nap =
      this.obstacles[Math.trunc(Math.random() * this.obstacles.length)];

    const platform = [
      new Gap(
        lastPlatform.x + lastPlatform.width,
        newBlock,
        3 + Math.trunc(Math.random() * 5),
      ),
      // new Arithmetic(lastPlatform.x + 40, newBlock),
    ][Math.trunc(Math.random() * 1)];
    this.curBlock = newBlock;
    this.addChild(platform.sprite);
    this.platforms.push(platform);
    this.step = (this.step + 1) % 5;
  }

  createArithmeticBlock() {
    const block = new Arithmetic(
      this.blocks[this.blocks.length - 1].y - this.screenHeight * 0.75,
    );

    this.step = (this.step + 1) % 5;
    this.blocks.push(block);
    this.addChild(block);
    this.addChild(star);
  }
}

class Platform {
  constructor(x, blocksY, blocksX) {
    // this.sprite = new Graphics().beginFill(0x00ff00).drawRect(0, 0, 40 * 5, 40);
    this.sprite = new Container();
    this.sprite.x = x;
    this.sprite.y = 640 - 80 - 40 * blocksY;
    // console.log(sprite.y);
    let num = (Manager.height - this.sprite.y) / 40;

    for (let i = 0; i < blocksX; i++) {
      for (let j = 0; j < num; j++) {
        const sprite = Sprite.from(j === 0 ? "grass" : "ground");
        sprite.x = 40 * i;
        sprite.y = 40 * j;
        sprite.width = 40;
        sprite.height = 40;
        this.sprite.addChild(sprite);
      }
    }

    this.body = new Body(this.sprite.x, this.sprite.y, 40 * blocksX, 40 * num, {
      isStatic: true,
    });
  }
  update() {
    this.body.setVelocity(-2, 0);
    this.sprite.x = this.body.position.x;
    this.sprite.y = this.body.position.y;
  }
}

class Ceiling {
  constructor(x, blocksX) {
    // this.sprite = new Graphics().beginFill(0x00ff00).drawRect(0, 0, 40 * 5, 40);
    this.sprite = new Container();
    this.sprite.x = x;
    this.sprite.y = 0;
    // console.log(sprite.y);

    for (let i = 0; i < blocksX; i++) {
      for (let j = 0; j < 2; j++) {
        const sprite = Sprite.from(j === 0 ? "grass" : "ground");
        sprite.angle = 180;
        sprite.x = 40 * i;
        sprite.y = 80 + -40 * j;
        sprite.width = 40;
        sprite.height = 40;
        this.sprite.addChild(sprite);
      }
    }

    // console.log(this.sprite.height);
    // this.sprite.y -560 +80= 560 - 40 * blocksY;

    this.body = new Body(
      this.sprite.x,
      this.sprite.y - 40,
      40 * blocksX,
      40 * 2,
      {
        isStatic: true,
      },
    );
  }
  update() {
    this.body.setVelocity(-2, 0);
    this.sprite.x = this.body.position.x;
    this.sprite.y = this.body.position.y;
  }
}
// class Tile extends Sprite {
//   constructor() {
//     Tile.texture = "grass_tile";
//   }
// }
