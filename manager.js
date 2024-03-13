import * as PIXI from "pixi.js";
import Matter from "matter-js";
import { Stage } from "./scenes/Stage";
import { Group } from "tweedle.js";

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
  static initialize(width, height, background, lang) {
    // store our width and height
    Manager._width = width;
    Manager._height = height;
    Manager.lang = lang;

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
    Manager.app = new PIXI.Application({
      view: document.getElementById("pixi-canvas"),
      resizeTo: document.getElementById("parent-div"), // This line here handles the actual resize!
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true,
      backgroundColor: background,
    });
    Manager.app.ticker.add(Manager.update);
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
    Manager.physics = Matter.Engine.create();
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, Manager.physics);
  }
  static clearPhysics() {
    Matter.World.clear(Manager.physics.world);
    Matter.Engine.clear(Manager.physics);
    Manager.physics = null;
    // Notice how runner may still be running the old physics instance
  }

  static update(deltaTime) {
    Group.shared.update();
    if (Manager.currentScene != undefined) {
      Manager.currentScene.update(deltaTime);
    }
  }

  static gameOver() {
    if (Manager.currentScene != undefined) Manager.currentScene.transitionOut();
    Manager.currentScene = new Stage();
    Manager.currentScene.transitionIn();
  }
}
