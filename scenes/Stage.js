import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Sound } from "@pixi/sound";
import { Tween } from "tweedle.js";
import { Manager } from "../manager.js";
import { Background } from "../game/Background.js";
import { Hero } from "../game/Hero.js";
import { GameLoop } from "../game/GameLoop.js";
import { Coin } from "../game/Coin.js";
import { GameOver } from "../game/GameOver.js";
import { Sounds } from "../game/Sounds.js";

export class Stage extends Container {
  constructor() {
    super();
    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;
    this.keySet = new Set();
    this.released = true;
    this.lost = false;

    this.pause = Sprite.from("pause");
    this.pause.x = this.screenWidth - 100;
    this.pause.width = 100;
    this.pause.height = 100;
    this.pause.eventMode = "static";
    this.pause.cursor = "pointer";
    this.pause.on("pointerdown", () => {});

    this.sounds = new Sounds();

    this.hero = new Hero();
    this.hasPassed = false;
    this.scoreBoard = new Score();
    this.curOp = new Text("???", {
      fill: 0xd5d5ff,
      fontWeight: "400",
      fontFamily: "Madimi One",
      letterSpacing: 2,
      fontSize: 31,
    });
    this.curOp.x = this.screenWidth / 2 - this.curOp.width / 2;
    this.curOp.y = 10;

    this.bg = new Background();
    this.gameLoop = new GameLoop();
    this.addChild(
      this.bg,
      this.gameLoop,
      this.hero,
      this.scoreBoard,
      this.sounds,
      this.curOp,
    );
    (this.equalizer = new Graphics()
      .rect(this.screenWidth / 2, 0, 4, 1000)
      .fill(0xff0000)),
      // this.addChild(this.equalizer);
      (this.eventMode = "static");
    // make entire screen interactive
    this.on("pointerdown", () => {
      this.hero.startJump();
    });

    this.watch(Manager.app.view);
    // Event handling
  }

  transitionIn() {
    Manager.app.stage.addChild(Manager.currentScene);
  }

  transitionOut() {
    Manager.app.stage.removeChild(Manager.currentScene);
    // Manager.app.stage.off("mousemove") remember to turn off events
  }

  resize(newWidth, newHeight) {
    this.screenWidth = newWidth;
    this.screenHeight = newHeight;
  }

  update(deltaTime) {
    this.collectCoin();
    this.hero.update(deltaTime);
    this.bg.update(deltaTime);
    this.scoreBoard.update();
    this.sounds.update();
    this.handleCollisions();
    if (Manager.curProblem) {
      let tempText = new Text(
        `${Manager.curProblem.operands[0]} ${Manager.curProblem.icons[Manager.curProblem.operator]} ${Manager.curProblem.operands[1]} = ${Manager.curProblem.result}`,
        {
          fill: 0xccccff,
          fontWeight: "400",
          fontFamily: "Madimi One",
          letterSpacing: 2,
          fontSize: 31,
        },
      );
      this.curOp.text = Manager.str || "";
      this.curOp.x =
        Manager.app.stage.pivot.x + this.screenWidth / 2 - tempText.width / 2;
    } else {
      this.curOp.text = Manager.str || "";
      this.curOp.x =
        Manager.app.stage.pivot.x + this.screenWidth / 2 - this.curOp.width / 2;
    }
    if (this.lost) return;

    this.handleEvent();

    const world = Manager.app.stage;
    const DIFF =
      this.hero.mainBody.sprite.x -
      this.screenWidth / 2 +
      this.hero.mainBody.sprite.width;
    // if (DIFF > 100) {
    //
    world.pivot.set(DIFF, 0);

    this.pause.y = Manager.app.stage.pivot.y + 20;
    this.curOp.y = 8;
    // }
    this.gameLoop.update(deltaTime);

    //COLOR SWITCH

    /////
    ////// Arithmetic collision detection
  }

  watch(el) {
    el.addEventListener("keydown", handleKeyPress.bind(this));
    el.addEventListener("keyup", handleRelease.bind(this));
  }

  handleEvent(key) {
    this.hero.handleEvent(key);
  }

  handleRelease(key) {
    this.hero.released = true;
  }

  interact(e) {
    const colliders = [e.pairs[0].bodyA, e.pairs[0].bodyB];
    const hero = colliders.find((body) => body.gameHero);
    const platform = colliders.find((body) => body.platform);
    // if (hero && platform && colliders[0].clr !== colliders[1].clr) {
    // }
  }

  lose() {
    this.hero.die();
    Manager.app.view.removeEventListener("keyup", handleKeyPress.bind(this));
    Manager.app.view.removeEventListener("keydown", handleRelease);
    Manager.sfx.play("death");
    Manager.music.volume = Math.min(Manager.music.volume, 0.03);
    this.lost = true;
    const temp = new Graphics()
      .rect(0, 0, this.screenWidth, this.screenHeight)
      .fill(0x2e3037);
    temp.x = Manager.app.stage.pivot.x;
    temp.alpha = 0;
    this.addChild(temp);
    const tween1 = new Tween(temp).to({ alpha: 0 }, 200);
    const tween2 = new Tween(temp).to({ alpha: 1 }, 500);
    //
    tween1
      .start()
      .onUpdate(() => {
        temp.x = Manager.app.stage.pivot.x;
      })
      .onComplete(() => {
        tween2
          .start()
          .onUpdate(() => {
            temp.x = Manager.app.stage.pivot.x;
          })
          .onComplete(() => {
            Manager.app.stage.pivot.x = 0;
            temp.x = 0;
            const scene = new GameOver(func, this.scoreBoard.score);
            this.addChild(scene);
          });
      });
    function func() {
      Manager.clearPhysics();
      Manager.changeScene(new Stage());
    }
  }

  handleCollisions() {
    const safeSpace = Manager.curProblem?.safeSpace;
    if (safeSpace) {
      let hasPassed = false;
      const hero = Manager.bodies[Manager.bodies.length - 1];
      if (hero.x + hero.width > safeSpace.x && hero.x <= safeSpace.x + 40) {
        if (hero.y + hero.height <= safeSpace.y + 40 && hero.y >= safeSpace.y) {
          hasPassed = true;
          Manager.setOperation(
            `${Manager.curProblem.operands[0]} ${Manager.curProblem.icons[Manager.curProblem.operator]} ${Manager.curProblem.operands[1]} = ${Manager.curProblem.result}`,
          );
          for (let i = 0; i < 5; i++) {
            setTimeout(() => {
              const coin = new Coin(hero.x + 40 + i * 2, 640 - 120 - hero.y);
              this.addChild(coin);
              this.gameLoop.coins.push(coin);
            }, 100 * i);
          }

          Manager.bodies.forEach((body, idx) => {
            if (idx === Manager.bodies.length - 1) return;
            if (body.isHit) return;
            body.x = safeSpace.x - 40;
            body.dx = 0;
            body.isHit = true;
          });
        } else {
          this.lose();
        }
      }

      if (hasPassed) Manager.curProblem = null;
    }

    Manager.bodies.forEach((body, idx) => {
      Manager.obstacles.forEach((obstacle) => {
        const upperLimit = body.y;
        const lowerLimit = body.y + body.height;
        const leftLimit = body.x;
        const rightLimit = body.x + body.width;
        const obstUpperLimit = obstacle.y;
        const obstLowerLimit = obstacle.y + obstacle.height;
        const obstLeftLimit = obstacle.x;
        const obstRightLimit = obstacle.x + obstacle.width;
        if (
          ((upperLimit >= obstUpperLimit && upperLimit <= obstLowerLimit) ||
            (lowerLimit >= obstUpperLimit && lowerLimit <= obstLowerLimit)) &&
          ((leftLimit >= obstLeftLimit && leftLimit <= obstRightLimit) ||
            (rightLimit >= obstLeftLimit && rightLimit <= obstRightLimit))
        ) {
          const overlapX =
            body.x + body.width / 2 < obstacle.x + obstacle.width / 2
              ? body.x + body.width - obstacle.x
              : obstacle.x + obstacle.width - body.x;
          const overlapY =
            body.y + body.height / 2 < obstacle.y + obstacle.width / 2
              ? body.y + body.height - obstacle.y
              : obstacle.y + obstacle.height - body.y;

          if (overlapX < overlapY) {
            if (body.dx > 0) {
              body.x = obstacle.x - body.width;
              if (idx === Manager.bodies.length - 1) this.lose();
              body.isHit = true;
            } else if (body.dx < 0) {
              body.x = obstacle.x + obstacle.width;
            }

            body.dx = 0;
          } else {
            // this.grounded = false;
            if (body.dy > 0) {
              body.y = obstacle.y - body.height;
              // this.grounded = true;
            } else if (body.dy < 0) {
              body.y = obstacle.y + obstacle.height;
            }
            body.dy = 0;
          }
        }
      });

      for (let i = 0; i < Manager.bodies.length; i++) {
        if (i === Manager.bodies.length) return;
        if (
          (Manager.bodies[i].isHit &&
            Manager.bodies[i].x < Manager.app.stage.pivot.x - 41) ||
          Manager.bodies[i].y > Manager.screenHeight - 80
        ) {
          this.hero.removeChild(this.hero.bods[i].sprite);
          Manager.bodies.splice(i, 1);
          this.hero.bods.splice(i, 1);
          i--;
        }
      }

      Manager.bodies.forEach((obstacle, idx) => {
        if (body.id === obstacle.id) {
          return;
        }
        const upperLimit = body.y;
        const lowerLimit = body.y + body.height;
        const leftLimit = body.x;
        const rightLimit = body.x + body.width;
        const obstUpperLimit = obstacle.y;
        const obstLowerLimit = obstacle.y + obstacle.height;
        const obstLeftLimit = obstacle.x;
        const obstRightLimit = obstacle.x + obstacle.width;
        if (
          // (upperLimit >= obstUpperLimit && upperLimit <= obstLowerLimit) ||

          lowerLimit >= obstUpperLimit &&
          lowerLimit <= obstLowerLimit &&
          ((leftLimit >= obstLeftLimit && leftLimit <= obstRightLimit) ||
            (rightLimit >= obstLeftLimit && rightLimit <= obstRightLimit))
        ) {
          body.y = obstacle.y - body.height;
          body.dy = 0;
        }
      });
    });
  }

  collectCoin() {
    const hero = this.hero.bods[this.hero.bods.length - 1];
    this.gameLoop.coins.forEach((coin) => {
      if (
        ((hero.sprite.x <= coin.x + coin.width && hero.sprite.x >= coin.x) ||
          (hero.sprite.x + hero.sprite.width <= coin.x + coin.width &&
            hero.sprite.x + hero.sprite.width >= coin.x)) &&
        ((hero.sprite.y >= coin.y && hero.sprite.y <= coin.y + coin.height) ||
          (hero.sprite.y + hero.sprite.height <= coin.y + coin.height &&
            hero.sprite.y + hero.sprite.height >= coin.y))
      ) {
        if (!coin.collected) {
          this.scoreBoard.increment(coin.collected);
          coin.activate();
          coin.collected = true;
          Manager.sfx.play("collect");
        }
      }
    });
  }
}

class Score extends Container {
  constructor(collected) {
    super();

    this.score = 0;
    this.collected = collected;
    this.y = Manager.height - 80;

    this.bg = new Graphics().rect(0, 0, 700, 40).fill(0x222244);
    this.bg.x = -50;
    this.bg.y = -5;
    this.bg.alpha = 0.3;

    this.sprite = Sprite.from("coin");
    this.sprite.width = 30;
    this.sprite.height = 30;
    this.sprite2 = Sprite.from("crown");
    this.sprite2.width = 30;
    this.sprite2.height = 30;

    this.text = new Text("0", {
      fill: 0xccccff,
      fontWeight: "400",
      fontFamily: "Madimi One",
      fontSize: 30,
      letterSpacing: 2,
    });
    this.text.x = this.sprite.width + 10;
    this.text.y = this.sprite.height / 2 - this.text.height / 2;

    console.log(localStorage.personalBest);
    this.highscore = new Text(
      isNaN(localStorage.personalBest) ? 0 : localStorage.personalBest,
      {
        fill: 0xccccff,
        fontWeight: "400",
        fontFamily: "Madimi One",
        fontSize: 30,
        letterSpacing: 2,
      },
    );
    this.highscore.x = Manager.width - this.highscore.width - 30;
    this.highscore.y = this.sprite.height / 2 - this.highscore.height / 2;
    this.sprite2.x = this.highscore.x - this.sprite2.width - 10;

    this.addChild(
      this.bg,
      this.sprite,
      this.text,
      this.highscore,
      this.sprite2,
    );
  }
  update() {
    this.x = Manager.app.stage.pivot.x + 15;
  }
  increment() {
    this.text.text = ++this.score;
    this.highscore.text = Math.max(
      Number(this.highscore.text),
      Number(this.text.text),
    );
    console.log(this.highscore.text);
    localStorage.setItem("personalBest", String(this.highscore.text));
  }
}

// proposed solutions:
//
//
// Give curProblem a property of "has been passed through"
// When x exceeds curProblem, make curProblem null
function handleKeyPress(e) {
  // console.log(e.target);
  this.keySet.add(e.key);
  if (e.key === " ") this.released = false;
  this.handleEvent(e.key);
}

function handleRelease(e) {
  // console.log("turned off");
  if (e.key === " ") {
    this.handleRelease(e.key);
  }
}
