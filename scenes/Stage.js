import { Container, Graphics, Sprite, Text } from "pixi.js";
import { sound, Sound } from "@pixi/sound";
import { Tween } from "tweedle.js";
import { Manager } from "../manager.js";
import { Background } from "../game/Background.js";
import { Hero } from "../game/Hero.js";
import { GameLoop } from "../game/GameLoop.js";
import { GameOver } from "../game/GameOver.js";
import { StartMenu } from "./StartMenu.js";

export class Stage extends Container {
  constructor() {
    super();
    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;
    this.keySet = new Set();
    this.released = true;
    this.score = 0;
    this.pause = Sprite.from("pause");
    this.pause.x = this.screenWidth - 100;
    this.pause.width = 100;
    this.pause.height = 100;

    this.pause.eventMode = "static";
    this.pause.cursor = "pointer";
    this.pause.on("pointerdown", () => {});
    const sprites = {
      jump: { start: 1.2, end: 2 },
      collect: { start: 2.2, end: 3.5 },
      change: { start: 3.7, end: 4 },
      death: { start: 12, end: 13 },
    };
    this.theme = Sound.from({ url: "sounds/sounds.mp3", sprites: sprites });
    this.theme.volume = 0.05;
    // this.theme.sprites = sprites;
    // this.lost = false;
    // this.theme.play();
    // this.song = sound.add("spice", "/assets/images/ITS.mp3")
    /// ELEMENTS
    //

    this.hero = new Hero(this.theme);
    this.scoreBoard = new Text("0", {
      fill: 0xffffff,
      fontWeight: "400",
      fontFamily: "Madimi One",
      letterSpacing: 2,
    });

    this.curOp = new Text("???", {
      fill: 0xffffff,
      fontWeight: "400",
      fontFamily: "Madimi One",
      letterSpacing: 2,
    });

    this.bg = new Background();
    this.gameLoop = new GameLoop();
    this.addChild(
      this.bg,
      this.gameLoop,
      this.hero,
      this.scoreBoard,
      this.curOp,
    );
    this.eventMode = "static";
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
    this.hero.update(deltaTime);

    const world = Manager.app.stage;
    const DIFF =
      this.hero.mainBody.sprite.x -
      this.screenWidth / 2 +
      this.hero.mainBody.sprite.width;
    // if (DIFF > 100) {
    //
    world.pivot.set(DIFF, 0);
    this.bg.x = world.pivot.x;

    if (this.lost) return;
    this.handleEvent();
    this.handleCollisions();
    this.scoreBoard.text = Math.trunc(this.score);
    this.scoreBoard.x = Manager.app.stage.pivot.x + 15;

    this.curOp.text = Manager.str || "";
    this.curOp.x =
      Manager.app.stage.pivot.x + this.screenWidth - this.curOp.width - 15;

    this.pause.y = Manager.app.stage.pivot.y + 20;
    this.bg.update(deltaTime);
    // }
    this.gameLoop.update(deltaTime);

    //COLOR SWITCH

    /////
    ////// Arithmetic collision detection
  }

  watch(el) {
    el.addEventListener("keydown", (e) => {
      this.keySet.add(e.key);
      if (e.key === " ") this.released = false;
      this.handleEvent(e.key);
    });
    el.addEventListener("keyup", (e) => {
      if (e.key === " ") {
        this.handleRelease(e.key);
      }
    });
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
    //   this.lose();
    // }
  }

  lose() {
    this.hero.die();
    this.lost = true;
    // const temp = new Graphics()
    //   .rect(0, 0, this.screenWidth, this.screenHeight);
    //   .fill(0x2e3037)
    // temp.y = Manager.app.stage.pivot.y;
    // temp.alpha = 0;
    // this.addChild(temp);
    // const tween1 = new Tween(temp).to({ alpha: 0 }, 400);
    // const tween2 = new Tween(temp).to({ alpha: 1 }, 500);
    //
    // tween1.start().onComplete(() => {
    //   tween2.start().onComplete(() => {
    //     const scene = new GameOver(func);
    //     Manager.app.stage.pivot.set(0, 0);
    //     this.addChild(scene);
    //   });
    // });
    // function func() {
    //   Manager.clearPhysics();
    //   Manager.createPhysics();
    //   Manager.changeScene(new Stage());
    // }
  }

  handleCollisions() {
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
}
