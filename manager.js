import { Application, Ticker } from "pixi.js";
import { Stage } from "./scenes/Stage";
import { Group } from "tweedle.js";
import { bodies } from "./game/Body";

export class Manager {
  constructor() {}
  static currentScene;
  static x;
  static y;

  // With getters but not setters, these variables become read-only
  static get width() {
    return 400;
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0,
    );
  }
  static get height() {
    return 640;
    return Math.max(
      document.documentElement.clientHeight,
      window.innerHidth || 0,
    );
  }

  // Use this function ONCE to start the entire machinery
  static async initialize(width, height, background, lang) {
    // store our width and height
    Manager._width = width;
    Manager._height = height;
    Manager.lang = lang;
    Manager.curProblem = null;

    Manager.colors = [0x5f8cff, 0xff675e, 0x9dff5a, 0xffe84f];
    Manager.operators = ["plus", "minus", "times", "by"];
    Manager.usedOps = new Set();
    Manager.arithmetic = {
      plus: true,
      minus: false,
      times: false,
      by: false,
    };

    // Create our pixi app
    Manager.app = new Application();

    await Manager.app.init({
      view: document.getElementById("pixi-canvas"),
      resizeTo: document.getElementById("parent-div"), // This line here handles the actual resize!
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true,
      backgroundColor: background,
    });
    // Manager.app.ticker.add(Manager.update);
    Ticker.shared.add(Manager.update);

    window.addEventListener("resize", Manager.resize);
    globalThis.__PIXI_APP__ = Manager.app;
  }

  static resize() {
    const parent = Manager.app.view.parentNode;
    Manager.app.renderer.resize(parent.clientWidth, parent.clientHeight);
    if (Manager.currentScene) {
      Manager.currentScene.resize(Manager.width, Manager.height);
    }
  }

  static changeScene(newScene) {
    if (Manager.currentScene != undefined) Manager.currentScene.transitionOut();
    Manager.currentScene = newScene;
    Manager.currentScene.transitionIn();
  }

  static createPhysics() {
    Manager.bodies = [];
    Manager.obstacles = [];
  }
  static clearPhysics() {
    Manager.bodies = [];
    Manager.obstacles = [];
  }

  static update(ticker) {
    Group.shared.update();
    Manager.bodies.forEach((body) => {
      body.update();
    });

    if (Manager.currentScene != undefined) {
      Manager.currentScene.update(ticker);
    }
  }

  static gameOver() {
    if (Manager.currentScene != undefined) Manager.currentScene.transitionOut();
    Manager.currentScene = new Stage();
    Manager.currentScene.transitionIn();
  }

  static setOperation(str) {
    Manager.str = str;
  }
}
