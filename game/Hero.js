import { Graphics, Container, Sprite } from "pixi.js";
import Matter from "matter-js";
import { Manager } from "../manager";
import { Tween } from "tweedle.js";
import { Body } from "./Body";
export class Hero extends Container {
  constructor(sound) {
    super();
    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;
    this.started = false;
    this.imploded = false;
    this.released = true;
    this.clr = Manager.colors[Math.trunc(Math.random() * 4)];
    this.diam = 40;
    this.sound = sound;
    // graphics
    this.mainBody = {};
    this.mainBody.sprite = Sprite.from("hero");
    this.mainBody.sprite.width = this.diam;
    this.mainBody.sprite.height = this.diam;
    this.mainBody.sprite.x = this.screenWidth / 2;
    this.mainBody.sprite.y = 600 - 300;
    this.transSprite = new Graphics();
    this.addChild(this.transSprite, this.mainBody.sprite);
    // physics
    //

    this.mainBody.body = new Body(
      this.mainBody.sprite.x,
      this.mainBody.sprite.y,
      this.mainBody.sprite.width,
      this.mainBody.sprite.height,
    );

    this.mainBody.body.gamemainBody = true; // why am i using this
    this.dy = 15;
    this.dx = 0;
    this.maxJumps = 2;
    this.jumpIndex = 0;
    this.maxSpeed = 5;

    this.bods = [this.mainBody];
  }

  update(deltaTime) {
    // console.log(
    //   this.bods.map((bod) => {
    //     return bod.sprite.y;
    //   }),
    // );
    this.bods.forEach((bod) => {
      bod.sprite.x = bod.body.x;
      bod.sprite.y = bod.body.y;
    });
    if (this.imploded) return;
  }

  interact(e) {
    const colliders = [e.pairs[0].bodyA, e.pairs[0].bodyB];
    const mainBody = colliders.find((body) => body.gamemainBody);
    const platform = colliders.find((body) => body.ground);
  }

  die() {
    // Manager.bodies.unshift(); // might need this if I set the minimum width of a tile to 40*3 (>100),
    // so I will no longer need to worry about it colliding with the previous tile because it's too narrow
    const hero = this.bods[this.bods.length - 1];
    const changes = { x: hero.body.x - 100 };
    hero.body.dy = -5;
    hero.body.y = hero.body.y - 10;
    const jumpBack = new Tween(hero.body)
      .to(changes, 300)
      .onUpdate(() => {})
      .start();
    Manager.bodies.forEach((body) => {
      body.dx = 0;
    });
  }

  startJump() {
    // if (this.bods.length > 10) return;
    //flip pointer between this .body and bods[bods.length-1]

    const isBelowCeiling = Manager.obstacles.filter((obst) => {
      const hero = this.bods[this.bods.length - 1];
      if (obst.y > hero.sprite.y) return false;
      return hero.body.y - (obst.y + obst.height) <= 40 && obst.y < 200;
    });

    const checkCeiling = Manager.obstacles.map((obst) => {
      const hero = this.bods[this.bods.length - 1];
      return obst.y + obst.height;
    });

    if (isBelowCeiling.length >= 1) return;
    const lastBody = this.bods.pop();
    this.removeChild(lastBody.sprite);
    const newBlock = lastBody;
    const spriteTemp = lastBody.sprite;
    newBlock.sprite = new Graphics()
      // .lineStyle(2, 0xd09080)
      .roundRect(0, 0, this.diam, this.diam, 5)
      .fill(0xf7b3a2);
    // this.addChild(newBlock)
    newBlock.sprite.position.set(spriteTemp.x, spriteTemp.y);
    newBlock.body.gameHero = false;

    this.bods.push(newBlock);
    this.addChild(newBlock.sprite);

    this.mainBody = null;
    this.mainBody = {};
    this.mainBody.sprite = Sprite.from("hero");
    const SCALE = this.diam / this.mainBody.sprite.width;
    this.mainBody.sprite.scale.x = SCALE;
    this.mainBody.sprite.scale.y = SCALE;
    this.mainBody.body = new Body(
      lastBody.body.position.x,
      lastBody.body.position.y - this.diam,
      lastBody.sprite.width,
      lastBody.sprite.height,
    );
    newBlock.body.gameHero = false;
    this.bods.push(this.mainBody);
    this.addChild(this.mainBody.sprite);
  }

  handleEvent(key) {
    if (key === " " && this.released) {
      this.startJump();
      this.released = false;
    }
  }
}
// figure out the reason behind the y difference being 35 instead of 40, possible reasons?
