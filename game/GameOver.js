import axios from "axios";
import * as profane from "badwords";
import { Tween } from "tweedle.js";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Menu } from "./Menu";
import { Selection } from "./Buttons";
import { Manager } from "../manager";
import { Input } from "@pixi/ui";
const profanity = profane;
export class GameOver extends Container {
  constructor(cb, score) {
    super();

    this.score = score;
    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;
    this.yourScore = new Text(
      `${Manager.lang === "english" ? "Your Score" : "Jouw Score"}: ${score}`,
      {
        fontSize: 24,
        // fill: 0xffffff,
        align: "center",
        // fontWeight: "bolder",
        fontFamily: "Madimi One",
        letterSpacing: 1,
      },
    );
    this.yourScore.anchor.set(0.5, 0);
    this.yourScore.x = this.screenWidth / 2;
    this.yourScore.y = 25;

    this.name = new Input({
      bg: new Graphics()
        .rect(0, 0, 180, 35)
        .fill(0xffffff)
        .rect(2, 2, 176, 31)
        .stroke({ width: 3, color: 0xcfc5b3 }),
      textStyle: {
        // fill: 0x2c5645,
        fontSize: 20,
        align: "center",
        fontWeight: "100",
        fontFamily: "Madimi One",
        letterSpacing: 1,
      },
      // placeholder: "name",
      value: "",
      padding: {
        left: 10,
      },
    });

    this.submit = new Submit(this.organize.bind(this), this.name, this.score);

    this.name.x = (this.screenWidth - this.name.width - this.submit.width) / 2;
    this.name.y = 60;
    this.submit.x = this.name.x + this.name.width + 10;
    this.submit.y = 60;

    this.submit.x =
      (this.screenWidth - this.name.width - this.submit.width) / 2 +
      10 +
      this.name.width;
    this.topScores = new Text(
      `${
        Manager.lang === "english"
          ? "Top scores this week"
          : "Toppers van de week"
      }`,
      {
        fontSize: 22,
        // fill: 0xffffff,
        align: "center",
        // fontWeight: "bolder",
        fontFamily: "Madimi One",
        letterSpacing: 1,
      },
    );
    this.topScores.anchor.set(0.5, 0);
    this.topScores.x = this.screenWidth / 2;
    this.topScores.y = 100;

    this.bg = new Graphics()
      .rect(0, 0, this.screenWidth, this.screenHeight)
      .fill(0xcee7e1);
    this.addChild(this.bg);
    this.selection = new Selection();
    this.selection.x = this.screenWidth / 2 - this.selection.width / 2;
    this.selection.y = 400;
    this.again = Sprite.from("again");
    const AGAIN_SCALE = 80 / this.again.width;
    this.again.scale.x = AGAIN_SCALE;
    this.again.scale.y = AGAIN_SCALE;
    this.again.x = this.screenWidth / 2;
    this.again.y = 600 - 20 - this.again.height / 2;
    this.again.anchor.set(0.5, 0.5);
    this.again.eventMode = "static";
    this.again.cursor = "pointer";
    this.again.tint = 0x000000;
    this.again.on("pointerdown", () => {
      const operators = [];
      for (let operator in Manager.arithmetic) {
        if (Manager.arithmetic[operator]) {
          operators.push(operator);
        } else {
        }
      }
      Manager.operators = operators;
      cb();
    });

    this.addChild(
      this.yourScore,
      this.name,
      this.submit,
      this.topScores,
      this.selection,
      this.again,
    );

    this.organize();
    const BIG_SCALE = this.again.scale.x + 0.05;
    new Tween(this.again.scale)
      .to({ x: BIG_SCALE, y: BIG_SCALE }, 750)
      .repeat(Infinity)
      .start()
      .yoyo(true);
  }

  async organize() {
    const data = await this.getScores();
    if (this.allScores) this.removeChild(this.allScores);
    this.allScores = new Container();
    this.addChild(this.allScores);
    if (!data) return;
    // if (!localStorage["highScores"]) return;
    // const scores = localStorage.highScores
    //   .split("||")

    const scores = data
      // .map((a, i) => {
      //   let output;
      //   if (a) output = JSON.parse(a);
      //   return output;
      // })
      .sort((a, b) => {
        return Number(b.score) - Number(a.score);
      });

    for (let i = 0; i < 5; i++) {
      if (scores[i] === undefined) break;
      const score = new Score(140 + 45 * i, scores[i].name, scores[i].score);
      this.allScores.addChild(score);
    }
  }
  // Read
  // var stored = localStorage['myKey'];
  // if (stored) myVar = JSON.parse(stored);
  // else myVar = {a:'test', b: [1, 2, 3]};
  // name:this.name.value
  // Writing :
  //
  // localStorage['myKey'] = JSON.stringify(myVar);
  //
  async getScores() {
    const API_URL =
      "https://math-world-highscores.onrender.com/api/blockyScores";
    const response = await axios.get(API_URL, {});
    return response.data;
  }
}

class Score extends Container {
  constructor(y, name, score) {
    super();
    this.y = y;
    this.star = Sprite.from("star-icon");
    this.name = new Text(name, {
      fontSize: 18,
      // fill: 0xffffff,
      align: "center",
      // fontWeight: "bolder",
      fontFamily: "Madimi One",
      letterSpacing: 1,
    });
    this.score = new Text(`3208 punten`, {
      fontSize: 18,
      // fill: 0xffffff,
      align: "center",
      // fontWeight: "bolder",
      fontFamily: "Madimi One",
      letterSpacing: 1,
    });
    this.score.text = `${score || 0} ${
      Manager.lang === "english" ? "points" : "punten"
    }`;
    const SCALE = 35 / this.star.width;
    this.star.scale.x = SCALE;
    this.star.scale.y = SCALE;

    this.star.x = 50;
    this.name.x = this.star.x + this.star.width + 10;
    this.score.x = 400 - this.score.width - 50;

    this.addChild(this.star, this.name, this.score);
  }
}

class Submit extends Container {
  constructor(cb, name, score) {
    super();
    this.score = score;
    this.name = name;
    this.cb = cb;
    this.submitted = false;
    this.submitting = false;
    this.validated = false;
    this.border = new Graphics().roundRect(0, 0, 80, 35, 6).fill(0x4eac8e);
    this.transBorder = new Graphics().roundRect(0, 0, 80, 35, 6).fill(0x2e9c6e);
    this.transBorder.alpha = 0;
    this.text = new Text(Manager.lang === "english" ? "Submit" : "Indienen", {
      fill: 0xffffff,
      fontFamily: "Madimi One",
      fontSize: 20,
      fontWeight: "1000",
    });
    this.text.x = this.border.width / 2 - this.text.width / 2;
    this.text.y = this.border.height / 2 - this.text.height / 2;
    this.addChild(this.transBorder);
    this.border.addChild(this.text);
    this.addChild(this.border);
    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerdown", () => {
      this.submit();

      this.on("pointerover", () => {
        new Tween(this.transBorder).to({ alpha: 1 }, 300).start();
      });
    });
    this.on("pointerout", () => {
      new Tween(this.transBorder).to({ alpha: 0 }, 300).start();
    });
  }

  async submit() {
    let hasProfanity = false;
    if (this.submitted) return;
    this.animation();

    const name = this.name.value;
    for (let i = 0; i < name.length; i++) {
      for (let j = 0; j < profanity.length; j++) {
        const length = profanity[j].length;
        const sub = name.substring(i, i + length);
        if (sub === profanity[j]) {
          hasProfanity = true;
          break;
        }
      }
    }

    if (!hasProfanity) {
      this.validated = true;
      const passed = await this.createScore(this.name.value, this.score);
    }
    this.submitted = true;
    this.submitting = false;

    // if (localStorage["highScores"]) {
    // localStorage["highScores"] =
    //   localStorage["highScores"] +
    //   "||" +
    //   JSON.stringify({ name: this.name.value, score: this.score });
    // } else {
    //   localStorage["highScores"] = JSON.stringify({
    //     name: this.name.value,
    //     score: this.score,
    //   });
    // }
    this.cb();
  }

  animation() {
    if (this.submitting) return;
    if (this.submitted) return;

    this.tick = Sprite.from("tick");
    const TICK_SCALE = 30 / this.tick.width;
    this.tick.scale.x = TICK_SCALE;
    this.tick.scale.y = TICK_SCALE;
    // this.tick.anchor.set(0.5, 0.5);
    this.rect = new Graphics().rect(0, 0, 40, 200).fill(0xff0000);
    this.rect.x = -40;
    this.tick.mask = this.rect;
    this.addChild(this.rect, this.tick);

    const prop = { roundness: 6, width: 80 };
    let startPart2 = false;
    let startPart3 = false;
    const round = new Tween(prop)
      .to({ roundness: 50 }, 200)
      .onUpdate(() => {
        this.border
          .clear()
          .roundRect(0, 0, 80, 35, prop.roundness)
          .fill(0x4eac8e);
        this.transBorder
          .clear()
          .roundRect(0, 0, 80, 35, prop.roundness)
          .beginFill(0x2e9c6e);
        this.text.alpha = 1 - prop.roundness / 50;
        if (!startPart2 && this.text.alpha < 0.7) {
          startPart2 = true;
          shrink.start();
        }
      })
      .start();

    const shrink = new Tween(prop)
      .to({ width: 35 }, 300)
      .onUpdate(() => {
        this.border
          .clear()
          .roundRect(0, 0, prop.width, 35, prop.roundness)
          .fill(0x4eac8e);
        this.transBorder
          .clear()
          .roundRect(0, 0, prop.width, 35, prop.roundness)
          .fill(0x2e9c6e);

        this.border.x = 40 - prop.width / 2;
        this.transBorder.x = 40 - prop.width / 2;

        if (!startPart3 && prop.width < 60) {
          this.tick.x = 22.5 + 5;
          if (this.validated) {
            startPart3 = true;
            this.successAnimation();
          }
        }
      })
      .onComplete(() => {
        if (!this.validated) this.failAnimation();
      });
  }

  successAnimation() {
    const showTick = new Tween(this.rect)
      .to({ x: this.transBorder.x + 17 }, 450)
      .onComplete(() => {
        this.cursor = "";
      })
      .start();

    return showTick;
    this.submitting = true;
  }

  failAnimation() {
    const prop = { roundness: 50, width: 80 };
    const round = new Tween(prop)
      .to({ roundness: 6 }, 200)
      .onUpdate(() => {
        this.border
          .clear()
          .roundRect(0, 0, 80, 35, prop.roundness)
          .fill(0x4eac8e);
        this.transBorder
          .clear()
          .roundRect(0, 0, 80, 35, prop.roundness)
          .fill(0x2e9c6e);
        this.text.alpha = (50 - prop.roundness) / 6;
      })
      .start();
    this.border.x = 0;
    this.transBorder.x = 0;
    // new Tween(this.border)
    //   .to({ x: 0 }, 200)
    //   .onUpdate(() => {
    //     // this.transBorder.x = this.border.x;
    //   })
    //   .start();
    this.submitted = false;
  }

  async createScore(namae, score) {
    const API_URL =
      "https://math-world-highscores.onrender.com/api/blockyScores";
    const response = await axios.post(API_URL, {
      name: namae,
      score: score,
    });
    return response.data;
  }
}
