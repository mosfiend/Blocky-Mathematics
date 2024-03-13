import * as PIXI from 'pixi.js'
import Matter from 'matter-js';
import { Manager } from "../manager";

export class TrainWreck extends PIXI.Container {
    constructor(roadHeight) {
        super();
        this.screenWidth = Manager.width;
        this.screenHeight = Manager.height;

        this.ground = new PIXI.Graphics()
            .beginFill(0xff0000)
            .drawRect(0, 0, this.screenWidth, 50);
        this.ground.pivot.set(this.ground.width / 2, this.ground.height / 2)
        this.ground.x = this.ground.width / 2
        this.ground.y = this.screenHeight + this.ground.height / 2 - roadHeight
        this.body = Matter.Bodies.rectangle(
            this.ground.x, this.ground.y,
            this.ground.width, this.ground.height,
            { friction: 0, isStatic: true });
        Matter.World.add(Manager.physics.world, this.body);
            this.body.ground = this.body
    };

    update(deltaTime) {
        // Matter.Body.setVelocity(this.heavyObj.body, { x: this.dx, y: this.heavyObj.y });

        // Matter.Body.setPosition(this.heavyObj.body, { x: this.heavyObj.body.position.x, y: this.heavyObj.body.position.y })
        // this.heavyObj.x = this.heavyObj.body.position.x;
        // this.heavyObj.y = this.heavyObj.body.position.y
    }
};



class Platform extends PIXI.Graphics {
    constructor() {
        super() 
        this.heavyObj = new PIXI.Graphics()
            .beginFill(0xee0e0e)
            .drawRect(0, 0, 2000, 1500)
        this.heavyObj.pivot.set(this.heavyObj.width / 2, this.heavyObj.height / 2)
        this.heavyObj.x = this.screenWidth * 0.75
        this.heavyObj.y = 200
        this.addChild(this.heavyObj)

        this.heavyObj.body = Matter.Bodies.rectangle(
            this.heavyObj.x, this.heavyObj.y,
            this.heavyObj.width, this.heavyObj.height,
            { friction: 100 });
        
            Matter.World.add(Manager.physics.world, this.heavyObj.body);
        this.heavyObj.body.ground = this.heavyObj
            Matter.Body.setMass(this.heavyObj.body, 100000.0);
        this.dx = -1

    }

}