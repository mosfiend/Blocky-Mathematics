import * as PIXI from "pixi.js"
import { Manager } from "../manager";
import { manifest } from "../assets/assets"
import { StartMenu } from "./StartMenu"
import { Stage } from "./Stage";
export class LoaderScene extends PIXI.Container {
    constructor() {
        super();
        this.initializeLoader().then(() => {
            this.gameLoaded()
        })
    }
    update(deltaTime) {
    }
    async initializeLoader() {
        Manager.createPhysics(); // No idea where I should put this, it's not async but I need to be loaded a bit before my assets
        await PIXI.Assets.init({ manifest });
        const bundleIds = manifest.bundles.map(bundle => bundle.name);
        await PIXI.Assets.loadBundle(bundleIds);
    }
    downloadProgress(progressRatio) {

    }
    gameLoaded() {
        Manager.changeScene(new StartMenu());

    }
    transitionIn() {
        Manager.app.stage.addChild(Manager.currentScene)
    }

    transitionOut() {
        Manager.app.stage.removeChild(Manager.currentScene)
    }

    resize() {

    }

}