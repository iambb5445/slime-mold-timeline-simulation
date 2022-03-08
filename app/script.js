import {sin, cos, Display, FrameData, Particle} from './utilities.js';

const frameCount = 100;
const timelineCanvasCount = 8;

let display = undefined;
let timelineDisplay = undefined;

let currentFrameIndex = 0;
let frames = [];

let currentAnimation;
let paused;
const settingsForm = document.querySelector("form");
let settings = {};

let preferredSize = window.innerWidth < 256 ? 128 : 256;

const settingsPerFrame = [];

const settingsMap = {
  time: [0, 1, frameCount - 1, 0],
  decay: [0.01, 0.01, 0.99, 0.1],
  sensorAngle: [5, 2.5, 90, 22.5],
  sensorDistance: [.5, .5, 20, 10],
  rotation: [5, 2.5, 90, 45],
  velocity: [.1, 0.1, 10, 1],
  depositSize: [0.1, 0.1, 20, 10],
  divergenceProbability: [0.0, 0.1, 1.0, 0.1],
  diffusion: [1, 1, 3, 1],
  size: [256, 64, 1024, preferredSize],
  particles: [0.1, 0.1, 2, 0.1],
};

const prettyLabel = {
  size: 'size*',
  particles: 'particles*'
}

settingsForm.onsubmit = e => {
  e.preventDefault();
  let queryString = [...settingsForm.elements].filter(e => e.value).map(e => e.value).join(';');
  if (window.history) {
    window.history.replaceState(null,'','/?'+queryString);
  }
  init();
};

settingsForm.addEventListener("input", e => {
  let target = e.target;
  document.querySelector("#" + target.name + "-value").innerText = target.value;
});

settingsForm.addEventListener("change", e => {
  let target = e.target;
  document.querySelector("#" + target.name + "-value").innerText = target.value;
  if (target.name != 'time') {
    updateSimulation();
  }
  updateSettings();
});

for (let field in settingsMap) {
  let [min, step, max, value] = settingsMap[field];
  settingsForm.innerHTML += `
    <div class="field">
      <label for="${field}">${prettyLabel[field] || field}</label>
      <input id="${field}" name="${field}" type="range" min="${min}" step="${step}" max="${max}" value="${value}" />
      <b id="${field}-value">${value}</b>
    </div>
  `;
}



settingsForm.innerHTML += `
  <div class="two-up">
    <button type="submit">start over</button>
    <button id="pause">pause</button>
    *: start over to apply
  </div>
`

document.querySelector('#pause').onclick = pause;

function pause(e) {
  e.preventDefault();
  if (paused) {
    tick();
    e.target.innerText = 'pause';
    paused = false;
  } else {
    e.target.innerText = 'play';
    paused = true;
  }
}

function updateSettings() {
  settings = Object.keys(settingsMap).reduce(
    (o, f) =>
      Object.assign(o, { [f]: parseFloat(settingsForm.elements[f].value) }),
    {}
  );
  settings.diffusionArea = Math.pow(settings.diffusion * 2 + 1, 2);
}

function updateSimulation() {
  display.showBlack();
  for (let i = 1; i < frameCount; i++) {
    const lastFrame = frames[i - 1];
    lastFrame.updateNext(frames[i], settings.sensorAngle, settings.sensorDistance, settings.rotation, settings.velocity, settings.divergenceProbability, settings.depositSize, settings.diffusion, settings.diffusionArea, settings.decay);
  }
  const images = []
  for (let i = 0; i < timelineCanvasCount; i++) {
    const frameIndex = parseInt(i * ((frameCount - 1) / (timelineCanvasCount - 1)));
    images.push(frames[frameIndex].getImage());
  }
  timelineDisplay.showImages(images);
}

function init() {
  updateSettings();
  const size = settings.size;
  display = new Display(size, document.querySelector('canvas[name="main-canvas"]'));
  display.showBlack();
  timelineDisplay = new Display(size, document.querySelector('canvas[name="timeline-canvas"]'), timelineCanvasCount);
  
  const particleCount = settings.particles * size * size;

  frames = [FrameData.getRandom(size, particleCount, settings.rotation)]
  for (let i = 1; i < frameCount; i++) {
    const lastFrame = frames[i - 1];
    const frame = lastFrame.getNext(settings.sensorAngle, settings.sensorDistance, settings.rotation, settings.velocity, settings.divergenceProbability, settings.depositSize, settings.diffusion, settings.diffusionArea, settings.decay);
    frames.push(frame);
  }
  const images = []
  for (let i = 0; i < timelineCanvasCount; i++) {
    const frameIndex = parseInt(i * ((frameCount - 1) / (timelineCanvasCount - 1)));
    images.push(frames[frameIndex].getImage());
  }
  timelineDisplay.showImages(images);
  tick();
}

function tick() {
  let timeInput = document.querySelector("#time");
  if (!paused) {
    timeInput.value = parseInt(timeInput.value) + 1;
    updateSettings();
    document.querySelector("#" + timeInput.name + "-value").innerText = timeInput.value;
  }
  const image = frames[currentFrameIndex].getImage();
  display.show(image);
  currentFrameIndex = settings.time;
  setTimeout(tick, 50);
}

init();
