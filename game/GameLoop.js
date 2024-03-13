import Matter from "matter-js";
import { Container, Graphics } from "pixi.js";
import { Manager } from "../manager";
import { Circle, DoubleCircle, Plus, Square, Triangle } from "./Platforms";
import { ColorChanger, Star } from "./Items";
import { Arithmetic } from "./Arithmetic";

export class GameLoop extends Container {
  constructor() {
    super();
    this.height;
    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;
    this.blocks = [];
    this.obstacles = [];

    // this.obstacles[
    // Math.trunc(Math.random() * this.obstacles.length)
    // ](Manager.app.stage.pivot.y);
  }

  update(deltaTime) {
    this.obstacles.forEach((obstacle) => {
      obstacle.update(deltaTime);
    });
    if (
      Manager.app.stage.pivot.x % 400 > -5 &&
      Manager.app.stage.pivot.x % 400 < 5
    ) {
      const obstacle = new Obstacle(Math.trunc(Math.random() * 3));
      this.addChild(obstacle.sprite);
    }
  }
  createBlock() {
    const block = new this.obstacles[
      Math.trunc(Math.random() * this.obstacles.length)
    ](this.blocks[this.blocks.length - 1].y - 200);
    const star = new Star(block.y);

    this.stars.push(star);
    this.blocks.push(block);
    this.step = (this.step + 1) % 5;
    this.addChild(block);
    this.addChild(star);
  }
  createArithmeticBlock() {
    const block = new Arithmetic(
      this.blocks[this.blocks.length - 1].y - this.screenHeight * 0.75,
    );
    const star = new Star(
      this.blocks[this.blocks.length - 1].y - this.screenHeight * 0.82,
    );

    this.stars.push(star);
    this.step = (this.step + 1) % 5;
    this.blocks.push(block);
    this.addChild(block);
    this.addChild(star);
  }

  changeColor() {
    this.step = (this.step + 1) % 5;
    const ball = new ColorChanger(
      this.blocks[this.blocks.length - 1].y - this.screenHeight * 0.7,
    );

    this.changers.push(ball);
    this.blocks.push(ball);
    this.addChild(ball);
  }
}

class Obstacle {
  constructor(blocks) {
    this.sprite = new Graphics()
      .beginFill(0x00ff00)
      .drawRect(0, 0, 40 * 5, 40);
    this.sprite.x = Manager.app.stage.pivot.x + 300;
    this.sprite.y = 600 - 40 * blocks;
    this.body = Matter.Bodies.rectangle(
      this.sprite.x + this.sprite.width / 2,
      this.sprite.y + this.sprite.height / 2,
      this.sprite.width,
      this.sprite.height,
      { friction: 0, isStatic: true },
    );
    Matter.World.add(Manager.physics.world, this.body);
    // this.addChild(this.sprite);
  }
  update() {}
}
