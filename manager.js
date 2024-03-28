import * as PIXI from "pixi.js";
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
    Manager.bodies = [];
    Manager.obstacles = [];
  }
  static clearPhysics() {
    Manager.bodies = [];
    Manager.obstacles = [];
  }

  static update(deltaTime) {
    Manager.bodies.forEach((body) => {
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
          body.y = obstacle.y - body.height;
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
        }
      });
    });

    Group.shared.update();
    Manager.bodies.forEach((body) => {
      body.update();
    });

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

function isHorizontallyBound(body1, body2) {
  const leftLimit = body.x;
  const rightLimit = body.x + body.width;
  const obstLeftLimit = obstacle.x;
  const obstRightLimit = obstacle.x + obstacle.width;
  if (
    (leftLimit >= obstLeftLimit && leftLimit <= obstRightLimit) ||
    (rightLimit >= obstLeftLimit && rightLimit <= obstRightLimit)
  ) {
    return true;
  } else {
    return false;
  }
}

function isVerticallyBound(body1, body2) {
  const upperLimit = body.y;
  const lowerLimit = body.y + body.height;
  const obstUpperLimit = obstacle.y;
  const obstLowerLimit = obstacle.y + obstacle.height;
  if (upperLimit >= obstUpperLimit && upperLimit <= obstLowerLimit) {
    return "up";
  } else if (lowerLimit >= obstUpperLimit && lowerLimit <= obstLowerLimit) {
    return "down";
  } else {
    return false;
  }
}
