import Matter from "matter-js";
import { Container, Graphics } from "pixi.js";
import { Manager } from "../manager";
import { ColorChanger, Star } from "./Items";
import { Arithmetic } from "./Arithmetic";
import { Body } from "./Body";
export class GameLoop extends Container {
  constructor() {
    super();
    this.curBlock = 1;
    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;
    this.blocks = [];
    this.obstacles = [];

    const newBlock = 1;
    const firstObstacle = new Obstacle(0, newBlock);
    this.curBlock = newBlock;

    this.addChild(firstObstacle.sprite);
    this.obstacles.push(firstObstacle);
  }

  update(deltaTime) {
    this.obstacles.forEach((obstacle) => {
      obstacle.update(deltaTime);
    });

    const lastObstacle = this.obstacles[this.obstacles.length - 1].sprite;
    console.log(lastObstacle.x, Manager.app.stage.pivot.x);
    if (lastObstacle.x > Manager.app.stage.pivot.x) {
      let newBlock = this.curBlock + [-1, 1][Math.trunc(Math.random() * 2)];
      if (newBlock < 0) newBlock = 0;
      if (newBlock > 10) newBlock = 10;
      const obstacle = new Obstacle(lastObstacle.x + 200, newBlock);
      this.curBlock = newBlock;
      this.addChild(obstacle.sprite);
      this.obstacles.push(obstacle);
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
  constructor(blocksX, blocksY) {
    console.log(blocksX, blocksY);
    this.sprite = new Graphics().beginFill(0x00ff00).drawRect(0, 0, 40 * 5, 40);
    this.sprite.x = blocksX;
    this.sprite.y = 600 - 40 * blocksY - 40;
    this.body = new Body(
      this.sprite.x,
      this.sprite.y,
      this.sprite.width,
      this.sprite.height,
      { isStatic: true },
    );
    // this.addChild(this.sprite);
  }
  update() {
    this.body.setVelocity(-2, 0);
    console.log(this.body.position);
    this.sprite.x = this.body.position.x;
    this.sprite.y = this.body.position.y;
  }
}
