import "./style.css";
import { Manager } from "./manager.js";
import { LoaderScene } from "./scenes/LoaderScene";

const urlParams = new URLSearchParams(window.location.search);
const lang = urlParams.get("lang");

// Now 'infoData' contains the value passed in the query parameter
const canvas = document.getElementById("pixi-canvas");
Manager.initialize(400, 640, 0x2e3037, lang ? lang : "english");
const loader = new LoaderScene();
Manager.changeScene(loader);
// console.log((Manager.app.renderer.screen.width = 400));
// Manager.app.renderer.screen.width = 400;
