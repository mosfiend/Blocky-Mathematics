import { Graphics, Container, RoundedRectangle } from "pixi.js";
import Matter from "matter-js";
import { Manager } from "../manager";

export class Square extends Container {
  // The physics is implemented into the graphics object
  constructor(y) {
    super();
    //graphics
    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;
    this.x = this.screenWidth / 2;
    this.y = y;
    this.clr = Manager.colors;
    const HEIGHT = 20;
    const WIDTH = 150 + HEIGHT;
    this.W = WIDTH;
    this.diam = HEIGHT;
        this.space = Math.sqrt(2)*(WIDTH +HEIGHT*2)
    this.y -= this.space;
    this.shape1 = new Graphics()
      .beginFill(this.clr[0])
      .drawRoundedRect(0, 0, WIDTH + HEIGHT, HEIGHT, 15);
    this.shape2 = new Graphics()
      .beginFill(this.clr[1])
      .drawRoundedRect(0, 0, HEIGHT, WIDTH + HEIGHT, 15);
    this.shape2.x = this.shape1.width - HEIGHT;
    this.shape3 = new Graphics()
      .beginFill(this.clr[2])
      .drawRoundedRect(0, 0, WIDTH + HEIGHT, HEIGHT, 15);
    this.shape3.y = this.shape2.height - HEIGHT;
    this.shape4 = new Graphics()
      .beginFill(this.clr[3])
      .drawRoundedRect(0, 0, HEIGHT, WIDTH + HEIGHT, 15);

    this.shape1Bis = new Graphics()
      .beginFill(this.clr[0])
      .drawRoundedRect(0, 0, WIDTH / 2 + HEIGHT, HEIGHT, 15);
    this.addChild(
      this.shape1,
      this.shape2,
      this.shape3,
      this.shape4,
      this.shape1Bis,
    );
    this.pivot.set(WIDTH / 2 + HEIGHT / 2, WIDTH / 2 + HEIGHT / 2);

    this.body = Matter.Composite.create();
    this.bod1 = Matter.Bodies.rectangle(
      this.shape1.x + this.x - this.pivot.x + this.shape1.width / 2,
      this.shape1.y + this.y - this.pivot.y + this.shape1.height / 2,
      this.shape1.width,
      this.shape1.height,
      { friction: 0, isStatic: true, isSensor: true },
    );
    this.bod2 = Matter.Bodies.rectangle(
      this.shape2.x + this.x - this.pivot.x + this.shape2.width / 2,
      this.shape2.y + this.y - this.pivot.y + this.shape2.height / 2,
      this.shape2.width,
      this.shape2.height,
      { friction: 0, isStatic: true, isSensor: true },
    );
    this.bod3 = Matter.Bodies.rectangle(
      this.shape3.x + this.x - this.pivot.x + this.shape3.width / 2,
      this.shape3.y + this.y - this.pivot.y + this.shape3.height / 2,
      this.shape3.width,
      this.shape3.height,
      { friction: 0, isStatic: true, isSensor: true },
    );
    this.bod4 = Matter.Bodies.rectangle(
      this.shape4.x + this.x - this.pivot.x + this.shape4.width / 2,
      this.shape4.y + this.y - this.pivot.y + this.shape4.height / 2,
      this.shape4.width,
      this.shape4.height,
      { friction: 0, isStatic: true, isSensor: true },
    );
    this.bod1.clr = this.clr[0];
    this.bod2.clr = this.clr[1];
    this.bod3.clr = this.clr[2];
    this.bod4.clr = this.clr[3];
    this.bod1.platform = true;
    this.bod2.platform = true;
    this.bod3.platform = true;
    this.bod4.platform = true;
    Matter.Composite.add(this.body, [
      this.bod1,
      this.bod2,
      this.bod3,
      this.bod4,
    ]);
    this.body.platform = true; // why am i using this

    Matter.World.add(Manager.physics.world, this.body);
  }

  update(deltaTime) {
    Matter.Composite.rotate(this.body, 0.02, {
      x: this.screenWidth / 2,
      y: this.y,
    });
    this.angle = ((this.bod1.angle / Math.PI) * 180) % 360;
  }
}

export class Triangle extends Container {
  // The physics is implemented into the graphics object
  constructor(y) {
    super();
    //graphics
    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;
    this.x = this.screenWidth / 2;
    this.y = y;
    this.clr = [...Manager.colors];
    this.clr.splice(Math.trunc(Math.random() * 4), 1);
    const HEIGHT = 20;
    const WIDTH = 270 + HEIGHT;
        this.space = WIDTH +HEIGHT*2
    this.y -= this.space;
    this.shape1 = new Graphics()
      .beginFill(this.clr[0])
      .drawRoundedRect(0, 0, WIDTH, HEIGHT, 20);
    this.shape2 = new Graphics()
      .beginFill(this.clr[1])
      .drawRoundedRect(0, 0, WIDTH, HEIGHT, HEIGHT, 20);
    this.shape3 = new Graphics()
      .beginFill(this.clr[2])
      .drawRoundedRect(0, 0, WIDTH, HEIGHT, 20);
    this.shape2.angle = 60;
    this.shape3.angle = -60;
    this.shape3.x = Math.cos(Math.PI / 3) * WIDTH;
    this.shape3.y = Math.sin(Math.PI / 3) * WIDTH;
    this.addChild(this.shape1, this.shape3, this.shape2);
    //physics
    // this.body = Matter.Bodies.rectangle(
    //   0,
    //   this.screenHeight - 10,
    //   this.screenWidth,
    //   10,
    //   { friction: 0, isStatic: true },
    // );
    // Matter.World.add(Manager.physics.world, this.body);
    // this.body.gamePlatform = this; // why am i using this

    this.addChild(
      new Graphics()
        .beginFill(0xff0000)
        .drawCircle(WIDTH / 2 - HEIGHT, WIDTH / 2, 31),
    );

    this.pivot
      .set
      // WIDTH / 2-HEIGHT,
      // WIDTH / 2 - HEIGHT,
      ();
    this.dx = 1;
    this.dy = 10;
  }
  update(deltaTime) {
    // this.angle += 1;
  }
}

export class Circle extends Container {
  // The physics is implemented into the graphics object
  constructor(y) {
    super();
    //graphics
    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;
    this.x = this.screenWidth / 2;
    this.y = y;
    this.clr = Manager.colors;

    this.body = {
      type: "circle",
      clr1: this.clr[0],
      clr2: this.clr[2],
    };

    const WIDTH = 190;
    this.W = WIDTH;
    this.diam = 20;
        this.space = WIDTH +this.diam*2
    this.y -= this.space;
    this.shape1 = new Graphics()
      .lineStyle(this.diam, this.clr[0])
      .arc(WIDTH / 2, WIDTH / 2, WIDTH / 2, -0.01, Math.PI / 2 + 0.1)
      .lineStyle(this.diam, this.clr[1])
      .arc(WIDTH / 2, WIDTH / 2, WIDTH / 2, Math.PI / 2, Math.PI + 0.1)
      .lineStyle(this.diam, this.clr[2])
      .arc(WIDTH / 2, WIDTH / 2, WIDTH / 2, Math.PI, (Math.PI * 3) / 2 + 0.1)
      .lineStyle(this.diam, this.clr[3])
      .arc(WIDTH / 2, WIDTH / 2, WIDTH / 2, (Math.PI * 3) / 2, Math.PI * 2);

    this.addChild(this.shape1);

    Math.sin(Math.PI / 3) * WIDTH;
    this.pivot.set(WIDTH / 2, WIDTH / 2);
    this.dx = 1;
    this.dy = 10;
    this.idx1 = 0;
    this.idx2 = 2;
  }
  update(deltaTime) {
    this.angle = (this.angle + 1) % 360;
    if (this.angle < 90) {
      this.body.clr1 = this.clr[2];
      this.body.clr2 = this.clr[0];
    } else if (this.angle < 180) {
      this.body.clr1 = this.clr[1];
      this.body.clr2 = this.clr[3];
    } else if (this.angle < 270) {
      this.body.clr1 = this.clr[0];
      this.body.clr2 = this.clr[2];
    } else {
      this.body.clr1 = this.clr[3];
      this.body.clr2 = this.clr[1];
    }
  }
}

export class DoubleCircle extends Container {
  // The physics is implemented into the graphics object
  constructor(y) {
    super();
    //graphics
    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;
    this.x = this.screenWidth / 2;
    this.y = y;
    this.clr = Manager.colors;
    const WIDTH = 170;
    this.W = WIDTH;
    this.diam = 16;
        this.space = (WIDTH +this.diam*2)*2
    this.y -= this.space;
    this.shape1 = new Graphics()
      .lineStyle(this.diam, this.clr[0])
      .arc(WIDTH / 2, WIDTH / 2, WIDTH / 2, 0, Math.PI / 2 + 0.1)
      .lineStyle(this.diam, this.clr[1])
      .arc(WIDTH / 2, WIDTH / 2, WIDTH / 2, Math.PI / 2, Math.PI + 0.1)
      .lineStyle(this.diam, this.clr[2])
      .arc(WIDTH / 2, WIDTH / 2, WIDTH / 2, Math.PI, (Math.PI * 3) / 2 + 0.1)
      .lineStyle(this.diam, this.clr[3])
      .arc(WIDTH / 2, WIDTH / 2, WIDTH / 2, (Math.PI * 3) / 2, Math.PI * 2);
    // this.shape1.angle=90
    this.shape2 = new Graphics()
      .lineStyle(this.diam, this.clr[3])
      .arc(WIDTH / 2, WIDTH / 2, WIDTH / 2, 0, Math.PI / 2 + 0.1)
      .lineStyle(this.diam, this.clr[2])
      .arc(WIDTH / 2, WIDTH / 2, WIDTH / 2, Math.PI / 2, Math.PI + 0.1)
      .lineStyle(this.diam, this.clr[1])
      .arc(WIDTH / 2, WIDTH / 2, WIDTH / 2, Math.PI, (Math.PI * 3) / 2 + 0.1)
      .lineStyle(this.diam, this.clr[0])
      .arc(WIDTH / 2, WIDTH / 2, WIDTH / 2, (Math.PI * 3) / 2, Math.PI * 2);
    this.shape2.y = WIDTH + this.diam;
    this.body = {
      type: "doubleCircle",
      clr1: this.clr[0],
      clr2: this.clr[2],
    };
    // this.addChild(this.shape1,this.shape2,this.shape3.this.shape4)
    this.addChild(this.shape1, this.shape2);
    //physics
    // this.body = Matter.Bodies.rectangle(
    //   0,
    //   this.screenHeight - 10,
    //   this.screenWidth,
    //   10,
    //   { friction: 0, isStatic: true },
    // );
    // Matter.World.add(Manager.physics.world, this.body);
    // this.body.gamePlatform = this; // why am i using this

    Math.sin(Math.PI / 3) * WIDTH;
    this.shape1.pivot.set(WIDTH / 2, WIDTH / 2);
    this.shape2.pivot.set(WIDTH / 2, WIDTH / 2);
    this.dx = 1;
    this.dy = 10;
  }
  update(deltaTime) {
    this.shape1.angle = (this.shape1.angle + 1) % 360;
    this.shape2.angle = (this.shape2.angle - 1 + 360) % 360;

    if (this.shape1.angle < 90) {
      this.body.clr1 = this.clr[2];
      this.body.clr2 = this.clr[0];
    } else if (this.shape1.angle < 180) {
      this.body.clr1 = this.clr[1];
      this.body.clr2 = this.clr[3];
    } else if (this.shape1.angle < 270) {
      this.body.clr1 = this.clr[0];
      this.body.clr2 = this.clr[2];
    } else {
      this.body.clr1 = this.clr[3];
      this.body.clr2 = this.clr[1];
    }
  }
}

export class Plus extends Container {
  // The physics is implemented into the graphics object
  constructor(y) {
    super();
    //graphics
    this.screenWidth = Manager.width;
    this.screenHeight = Manager.height;
    // this.x = this.screenWidth / 2;
    this.y = y;
    this.clr = Manager.colors;
    const HEIGHT = 20;
    const WIDTH = 90;
    this.W = WIDTH;
    this.diam = HEIGHT;
        this.space = (WIDTH +this.diam)+WIDTH
    this.y -= this.space;
    this.plus1 = new Container();
    this.plus2 = new Container();
    this.addChild(this.plus1, this.plus2);
    this.plus1.x = this.screenWidth / 2 - WIDTH - HEIGHT / 2;
    this.plus2.x = this.screenWidth / 2 + WIDTH + HEIGHT / 2;

    this.shape1 = new Graphics()
      .beginFill(this.clr[0])
      .drawRoundedRect(0, 0, WIDTH, HEIGHT, 15);
    this.shape1.x = HEIGHT;
    this.shape1Bis = new Graphics()
      .beginFill(this.clr[0])
      .drawRect(0, 0, WIDTH / 2, HEIGHT);
    this.shape1Bis.x = HEIGHT;
    this.shape2 = new Graphics()
      .beginFill(this.clr[1])
      .drawRoundedRect(0, 0, HEIGHT, WIDTH, 15);
    this.shape2.y = HEIGHT;
    this.shape2Bis = new Graphics()
      .beginFill(this.clr[1])
      .drawRect(0, 0, HEIGHT, WIDTH / 2);
    this.shape2Bis.y = HEIGHT;
    this.shape3 = new Graphics()
      .beginFill(this.clr[2])
      .drawRoundedRect(0, 0, WIDTH, HEIGHT, 15);
    this.shape3.x = -WIDTH;
    this.shape3Bis = new Graphics()
      .beginFill(this.clr[2])
      .drawRect(0, 0, WIDTH / 2, HEIGHT);
    this.shape3Bis.x = -WIDTH / 2;
    this.shape4 = new Graphics()
      .beginFill(this.clr[3])
      .drawRoundedRect(0, 0, HEIGHT, WIDTH, 15);
    this.shape4.y = -WIDTH;
    this.shape4Bis = new Graphics()
      .beginFill(this.clr[3])
      .drawRect(0, 0, HEIGHT, WIDTH / 2);
    this.shape4Bis.y = -WIDTH / 2;

    this.plus1.addChild(
      this.shape1,
      this.shape2,
      this.shape3,
      this.shape4,
      this.shape1Bis,
      this.shape2Bis,
      this.shape3Bis,
      this.shape4Bis,
    );

    this.shape5 = new Graphics()
      .beginFill(this.clr[2])
      .drawRoundedRect(HEIGHT, 0, WIDTH, HEIGHT, 15);
    this.shape5Bis = new Graphics()
      .beginFill(this.clr[2])
      .drawRect(HEIGHT, 0, WIDTH / 2, HEIGHT);
    this.shape6 = new Graphics()
      .beginFill(this.clr[1])
      .drawRoundedRect(0, HEIGHT, HEIGHT, WIDTH, 15);
    this.shape6Bis = new Graphics()
      .beginFill(this.clr[1])
      .drawRect(0, HEIGHT, HEIGHT, WIDTH / 2);
    this.shape7 = new Graphics()
      .beginFill(this.clr[0])
      .drawRoundedRect(-WIDTH, 0, WIDTH, HEIGHT, 15);
    this.shape7Bis = new Graphics()
      .beginFill(this.clr[0])
      .drawRect(-WIDTH / 2, 0, WIDTH / 2, HEIGHT);
    this.shape8 = new Graphics()
      .beginFill(this.clr[3])
      .drawRoundedRect(0, -WIDTH, HEIGHT, WIDTH, 15);
    this.shape8Bis = new Graphics()
      .beginFill(this.clr[3])
      .drawRect(0, -WIDTH / 2, HEIGHT, WIDTH / 2);
    this.plus2.addChild(
      this.shape5,
      this.shape6,
      this.shape7,
      this.shape8,
      this.shape5Bis,
      this.shape6Bis,
      this.shape7Bis,
      this.shape8Bis,
    );
    // this.pivot.set(HEIGHT / 2, HEIGHT / 2);

    console.log(
      this.shape1.x +
        this.x -
        this.pivot.x +
        this.plus1.x +
        this.shape1.width / 2,
    );
    // this.shape1.width+this.shape1.height
    this.body = Matter.Composite.create();
    this.bod1 = Matter.Bodies.rectangle(
      165,
      this.shape1.y + this.y - this.pivot.y,
      this.shape1.width,
      this.shape1.height,
      {
        friction: 0,
        isStatic: true,
        isSensor: true,
      },
    );
    this.bod2 = Matter.Bodies.rectangle(
      this.shape2.x +
        this.x -
        this.pivot.x +
        this.shape2.width / 2 +
        this.shape2.width +
        this.shape2.height,
      this.shape2.y + this.y - this.pivot.y + this.shape2.width,
      this.shape2.width,
      this.shape2.height,
      {
        friction: 0,
        isStatic: true,
        isSensor: true,
      },
    );
    this.bod3 = Matter.Bodies.rectangle(
      this.shape3.x +
        this.x -
        this.pivot.x +
        this.shape3.width / 2 +
        this.shape3.width +
        this.shape3.height +
        10,
      this.shape3.y + this.y - this.pivot.y,
      this.shape3.width,
      this.shape3.height,
      {
        friction: 0,
        isStatic: true,
        isSensor: true,
      },
    );
    this.bod4 = Matter.Bodies.rectangle(
      this.shape4.x +
        this.x -
        this.pivot.x +
        this.shape4.width / 2 +
        this.plus1.x,
      this.shape4.y + this.y - this.pivot.y + this.shape4.height / 2,
      this.shape4.width,
      this.shape4.height,
      {
        friction: 0,
        isStatic: true,
        isSensor: true,
      },
    );
    this.bod1.clr = this.clr[0];
    this.bod2.clr = this.clr[1];
    this.bod3.clr = this.clr[2];
    this.bod4.clr = this.clr[3];
    this.bod1.platform = true;
    this.bod2.platform = true;
    this.bod3.platform = true;
    this.bod4.platform = true;
    Matter.Composite.add(this.body, [
      this.bod1,
      this.bod2,
      this.bod3,
      this.bod4,
    ]);

    this.body.platform = true; // why am i using this
    Matter.World.add(Manager.physics.world, this.body);
    this.plus1.pivot.set(HEIGHT / 2, HEIGHT / 2);
    this.plus2.pivot.set(HEIGHT / 2, HEIGHT / 2);
    //
    // Matter.Composite.rotate(this.body, Math.PI, {
    //   x: this.plus1.x,
    //   y: this.y,
    // });
  }

  update(deltaTime) {
    Matter.Composite.rotate(this.body, 0.02, {
      x: this.x + this.plus1.x + this.diam,
      y: this.y,
    });
    this.plus1.angle = ((this.bod1.angle / Math.PI) * 180) % 360;
    this.plus2.angle = -((this.bod1.angle / Math.PI) * 180) % 360;
  }
}
