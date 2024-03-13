import { Graphics, Container, Sprite } from "pixi.js";
import Matter from "matter-js";
import { Manager } from "../manager";
import { Tween } from "tweedle.js";
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
    this.mainBody.sprite.border = new Graphics()
      .beginFill(0xf7b3a2)
      .drawRoundedRect(0, 0, this.diam, this.diam, 5);
    console.log(this.mainBody.sprite.width, this.mainBody.sprite.height);
    const SCALE = this.diam / this.mainBody.sprite.width;
    this.mainBody.sprite.scale.x = SCALE;
    this.mainBody.sprite.scale.y = SCALE;
    // drawRoundedRect(0, 0, this.diam, this.diam, 5);
    // this.mainBody.sprite.x = this.screenWidth / 2 + this.screenWidth / 8 - 5;
    this.mainBody.sprite.x = this.screenWidth / 2;
    this.mainBody.sprite.y = 600 - 50;
    this.transSprite = new Graphics();
    this.addChild(
      this.transSprite,
      this.mainBody.sprite.border,
      this.mainBody.sprite,
    );
    // physics
    //
    console.log(this.mainBody.sprite.width, this.mainBody.sprite.height);
    this.mainBody.body = Matter.Bodies.rectangle(
      this.mainBody.sprite.x + this.mainBody.sprite.width / 2,
      this.mainBody.sprite.y + this.mainBody.sprite.height / 2,
      this.mainBody.sprite.width,
      this.mainBody.sprite.height,
      { friction: 0 },
    );

    this.mainBody.body.gamemainBody = true; // why am i using this
    Matter.World.add(Manager.physics.world, this.mainBody.body);
    this.dy = 15;
    this.dx = 0;
    this.maxJumps = 2;
    this.jumpIndex = 0;
    this.maxSpeed = 5;

    this.bods = [this.mainBody];
  }

  update(deltaTime) {
    this.bods.forEach((bod) => {
      bod.sprite.x = bod.body.position.x - this.diam / 2;
      bod.sprite.y = bod.body.position.y - this.diam / 2;
      Matter.Body.setVelocity(bod.body, { x: 2, y: bod.body.velocity.y });
      // Matter.Body.setAngle(bod.body, 0);
    });
    if (this.imploded) return;
    // Matter.Body.setAngle(this.mainBody.body, 0);
    // Matter.Body.setVelocity(this.mainBody.body, { x: 2, y: this.mainBody.body.velocity.y });
    // this.mainBody.sprite.x = this.mainBody.body.position.x - this.mainBody.sprite.width / 2;
    // this.mainBody.sprite.y = this.mainBody.body.position.y - this.mainBody.sprite.height / 2;
    // this.mainBody.sprite.border.x = this.mainBody.body.position.x - this.mainBody.sprite.width / 2;
    // this.mainBody.sprite.border.y = this.mainBody.body.position.y - this.mainBody.sprite.height / 2;
  }

  interact(e) {
    const colliders = [e.pairs[0].bodyA, e.pairs[0].bodyB];
    const mainBody = colliders.find((body) => body.gamemainBody);
    const platform = colliders.find((body) => body.ground);
  }

  startJump() {
    if (this.bods.length > 10) return;
    //flip pointer between this .body and bods[bods.length-1]
    const lastBody = this.bods.pop();
    this.removeChild(lastBody.sprite);
    const newBlock = lastBody;
    const spriteTemp = lastBody.sprite;
    newBlock.sprite = new Graphics()
      .beginFill(0xf7b3a2)
      .lineStyle(2, 0xd09080)
      .drawRoundedRect(0, 0, this.diam, this.diam, 5);
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
    this.mainBody.body = Matter.Bodies.rectangle(
      lastBody.body.position.x,
      lastBody.body.position.y - this.diam,
      lastBody.sprite.width,
      lastBody.sprite.height,
      { friction: 0 },
    );
    Matter.World.add(Manager.physics.world, this.mainBody.body);
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

  implode() {
    if (this.imploded) return;
    this.mainBody.sprite.clear();
    this.transSprite.clear();
    this.mainBody.sprite.alpha = 0;
    for (let i = 0; i < Math.random() * 10 + 10; i++) {
      const frag = this.makeFragment();
      this.fragments.push(frag);
      this.addChild(frag);
      this.sound.play("death");

      Matter.Body.setVelocity(frag.body, {
        x: 5 - Math.random() * 10,
        y: 10 - Math.random() * 20,
      });
    }
    this.imploded = true;
  }

  makeFragment() {
    const clr = [...Manager.colors];
    clr.push(0xcccccc);
    const dim = (1 / Math.sqrt(2)) * this.diam;
    const fragment = new Graphics()
      .beginFill(clr[Math.trunc(Math.random() * 5)])
      .drawCircle(
        this.x + this.mainBody.sprite.x - dim + 2 * Math.random() * dim,
        this.y + this.mainBody.sprite.y - dim + 2 * Math.random() * dim,
        Math.random() * 4 + 4,
      );

    fragment.body = Matter.Bodies.circle(
      fragment.x + fragment.width / 2,
      fragment.y + fragment.height / 2,
      fragment.width / 2,
      { friction: 0 },
    );
    Matter.World.add(Manager.physics.world, fragment.body);
    return fragment;
  }
}
