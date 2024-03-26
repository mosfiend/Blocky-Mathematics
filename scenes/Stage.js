import { Container, Graphics, Sprite, Text } from "pixi.js";
import { sound, Sound } from "@pixi/sound";
import { Tween } from "tweedle.js";
import { Manager } from "../manager.js";
import { Background } from "../game/Background.js";
import { Hero } from "../game/Hero.js";
import { GameLoop } from "../game/GameLoop.js";
import { Square } from "../game/Platforms.js";
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

    this.scoreBoard.x = 15 + this.scoreBoard.width;
    this.scoreBoard.y = Manager.app.stage.pivot.y + 15;
    this.bg = new Background();
    this.gameLoop = new GameLoop();
    this.addChild(this.bg, this.gameLoop, this.hero, this.scoreBoard);
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
    if (this.lost) return;
    this.handleEvent();
    this.scoreBoard.text = Math.trunc(this.score);
    this.scoreBoard.y = Manager.app.stage.pivot.y + 15;
    this.pause.y = Manager.app.stage.pivot.y + 20;
    this.bg.update(deltaTime);
    const world = Manager.app.stage;
    const DIFF =
      this.hero.mainBody.sprite.x - (this.screenWidth / 2 )-this.hero.mainBody.sprite.width/2;
    // if (DIFF > 100) {
    world.pivot.set(DIFF, 0);
    this.bg.x = world.pivot.x;
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
    // console.log(
    //   "Collision happened",
    //   colliders[0].position.y,
    //   colliders[1].position.y,
    // );
    const platform = colliders.find((body) => body.platform);
    // if (hero && platform && colliders[0].clr !== colliders[1].clr) {
    //   this.lose();
    // }
  }

  lose() {
    this.hero.implode();
    this.lost = true;
    const temp = new Graphics()
      .beginFill(0x2e3037)
      .drawRect(0, 0, this.screenWidth, this.screenHeight);
    temp.y = Manager.app.stage.pivot.y;
    temp.alpha = 0;
    this.addChild(temp);
    const tween1 = new Tween(temp).to({ alpha: 0 }, 400);
    const tween2 = new Tween(temp).to({ alpha: 1 }, 500);

    tween1.start().onComplete(() => {
      tween2.start().onComplete(() => {
        const scene = new GameOver(func);
        Manager.app.stage.pivot.set(0, 0);
        this.addChild(scene);
      });
    });
    function func() {
      Manager.clearPhysics();
      Manager.createPhysics();
      Manager.changeScene(new Stage());
    }
  }
}
