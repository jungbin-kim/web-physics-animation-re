import App from './App';
const rendererWrap = document.createElement("div");
rendererWrap.style.width = "640px";
rendererWrap.style.height = "480px";
document.body.appendChild(rendererWrap);
export const app = new App(rendererWrap);
app.start();