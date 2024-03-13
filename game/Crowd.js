import * as PIXI from 'pixi.js'
import Matter from 'matter-js';
import { Manager } from "../manager";

export class Crowd extends PIXI.Container {
    #head
    #tail
    #peeps
    #height
    constructor(capacity, roadHeight) {
        super();
        this.screenHeight = Manager.height
        this.screenWidth = Manager.width
        this.roadHeight = roadHeight
        this.capacity = capacity
        this.rows = new Array().fill(false)
        this.#peeps = new Array(capacity)
        this.#head = 0
        this.#tail = (this.#head - 1 + this.capacity) % this.capacity
        for (let i = 0; i < this.capacity; i++) {
            const I = i % 10
            this.set(i, "F" + I + I + I + I + I)
        }
    };

    update(deltaTime) {
        for (let i = 0; i < this.capacity; i++) {
            this.#peeps[i].move(this.screenWidth, this.screenHeight,)
        }
    };
    chaos () {
        this.#peeps.forEach(a=>{a.panic()})
    }
    getHeadIdx() {
        return this.#head % this.capacity
    }

    getHead() {
        return this.#peeps[this.#head % this.capacity]
    }

    getTail() {
        return this.#peeps[this.#tail % this.capacity]
    }

    incHead() {
        this.#head = (this.#head + 1) % this.capacity
        // this.#tail = ((this.#head - 1 + this.capacity)) % this.capacity
    }

    get(idx) {
        return this.#peeps[(idx - this.#head + this.capacity) % this.capacity]
    }

    set(idx, clr) {
        this.#height = (this.get(this.#head - 1)?.y || this.#height) + 200
        // idx = ((idx - this.#head) % this.capacity + this.capacity) % this.capacity
        idx = (idx + this.#head) % this.capacity
        if (!this.#peeps[idx]) {
            this.#peeps[idx] = new Person(this.screenWidth, this.screenHeight, clr, this.roadHeight)
            this.addChild(this.#peeps[idx])
        }
        else {
            this.#peeps[idx].reuse() // Will probably never need to use this
        }
    }
}

export class Person extends PIXI.Graphics {         // The physics is implemented into the graphics object
    constructor(screenWidth, screenHeight, clr, roadHeight) {
        super();
        this.panicking = false
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
        this.roadHeight = roadHeight
        //graphics
        this.dir = [-1, 1][Math.trunc(Math.random() * 2)]
        this.clr = clr
        this.dimensions = 30
        this.beginFill(this.clr)
            .drawRect(0, 0, this.dimensions, this.dimensions);
        // this.pivot.set(this.dimensions / 2, this.dimensions / 2)
        this.x = this.dir > 0 ? 0 : this.screenWidth;
        const row = this.roadHeight / 5 * Math.trunc(Math.random() * 5)
        this.y = this.screenHeight - this.roadHeight + row;
        this.boundary = this.x ? 0 : this.screenWidth + this.dir * this.screenWidth * Math.random() * 0.5
        //physics
        this.body = Matter.Bodies.rectangle(
            this.x + this.width / 2, this.y + this.height / 2,
            this.width, this.height,
            { friction: 0, isStatic: true });
        Matter.World.add(Manager.physics.world, this.body);
        // this.body.gamePlatform = this; // why am i using this 
        this.dx = this.dir * (3 + (Math.random()))
        this.dy = 10
    }
    move() {
        Matter.Body.setPosition(this.body, { x: this.body.position.x + this.dx, y: this.body.position.y })
        if (((this.x < 0 && this.dir < 0) || (this.x > this.boundary && this.dir > 0)) && !this.panicking) {
            this.reuse();
        }
        this.x = this.body.position.x;
        this.y = this.body.position.y
    }
    reuse(x, y) {
        // this.dir = [-1, 1][Math.trunc(Math.random() * 2)]
        this.x = this.screenWidth - this.dir * (this.screenWidth);
        // const row = this.roadHeight / 5 * Math.trunc(Math.random() * 5)
        // this.y = this.screenHeight - this.roadHeight + row
        // this.boundary = this.x + this.dir*Math.random()*0.5
        // this.dx = this.dir * (3 + (Math.random()))

        Matter.Body.setPosition(this.body, { x: this.x + this.width / 2, y: this.y })
    }
    panic() {

        if (!this.panicking) {
            const face = new PIXI.Graphics().beginFill(0x101022).drawRect(this.dimensions / 2, this.dimensions * 3 / 5, this.dimensions / 1.5, this.dimensions / 3)
            face.pivot.set(face.width / 2, 0)
            const eyeL = new PIXI.Graphics().beginFill(0x101022).drawRect(0, 0, this.dimensions / 5, this.dimensions / 5)
            const eyeR = new PIXI.Graphics().beginFill(0x101022).drawRect(0, 0, this.dimensions / 5, this.dimensions / 5)
let eyeLevel = Math.random() * this.dimensions/3
            eyeL.x = Math.random() * this.dimensions*0.4
  eyeL.y = eyeLevel
  eyeR.x = (0.4+Math.random()) * this.dimensions/2
  eyeR.y = eyeLevel
            this.addChild(face, eyeL, eyeR)
            this.dx *= 2
        }
        this.panicking = true
    }
}
// implement a circular queue
// uses the same 8 pixi graphics
// but changes their shape when it's popped back to the beginning
