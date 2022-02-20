const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");

let buttonStart = document.getElementById("button-start");
let mainApp = document.getElementById("app");

let isVideo = false;
let model = null;

let osc = new p5.Oscillator("sine");
let fft = new p5.FFT(0.2);

let lowest = 32;
let highest = 260;
let oscillatorType = "sine";
let useLinear = true;
let noteOverlay = true;
let clampNotes = false;

function clamp(input, min, max) {
  return input < min ? min : input > max ? max : input;
}

function map(current, in_min, in_max, out_min, out_max) {
  const mapped =
    ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clamp(mapped, out_min, out_max);
}

const modelParams = {
  flipHorizontal: true, // flip e.g for video
  modelType: "ssd320fpnlite",
  modelSize: "large",
  maxNumBoxes: 20, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.7, // confidence threshold for predictions.
};

function start() {
  // updateNote.innerText = "Starting video";
  osc.amp(0);
  osc.start();

  mainApp.classList.remove("hidden");
  mainApp.scrollIntoView({ behavior: "smooth" });
  buttonStart.innerHTML = "Webcam loaded!";
  buttonStart.classList.add("loading");
  buttonStart.removeEventListener("click", start);

  handTrack.startVideo(video).then(function (status) {
    console.log("video started", status);
    if (status) {
      // updateNote.innerText = "Video started. Now tracking";
      isVideo = true;
      runDetection();
    } else {
      // updateNote.innerText = "Please enable video";
    }
  });
}

function runDetection() {
  model.detect(video).then((predictions) => {
    let render = [];

    let freq = -1;
    let amp = -1;

    predictions = predictions.map((object) => {
      // Ignore objects detected that aren't an open palm.
      if (object.label !== "open") {
        return;
      }

      // Find the bounding box of the object.
      let boundingBox = object.bbox; // [xPos, yPos, width, height]

      let x = boundingBox[0] + boundingBox[2] / 2; // Treat the x value as between the two edges of the bounding box.
      let y =
        boundingBox[1] + (boundingBox[1] / canvas.height) * boundingBox[3]; // Treat the y value as the bottom edge of the bounding box.

      amp = map(y, canvas.height, 0, 0, 1);
      freq = map(x, 0, canvas.width, lowest, highest);

      if (clampNotes) {
        freq = frequencyFromNoteNumber(noteNumberFromFrequency(freq));
      }

      render.push(object);
    });

    if (freq != -1 && amp != -1) {
      osc.freq(freq, 0.1);
      osc.amp(map(amp, 0, 1, 0, 0.8), 0.1);
    } else {
      osc.amp(0, 0.1);
    }

    renderPredictions(render, canvas, context, video, freq, amp);
    if (isVideo) {
      requestAnimationFrame(runDetection);
    }
  });
}

// Load the model.
handTrack.load(modelParams).then((lmodel) => {
  // detect objects in the image.
  model = lmodel;
  buttonStart.classList.remove("i");
  buttonStart.classList.remove("loading");
  buttonStart.innerText = "Click to enable webcam";
  buttonStart.addEventListener("click", start);
});

function setup() {
  let cnv = createCanvas(640, 200);
  cnv.parent("mycontainer");
}

function draw() {
  clear();

  let spectrum = fft.analyze();
  noStroke();
  fill(213, 0, 143);

  for (let i = 0; i < 128; i++) {
    let x = map(i, 0, 128, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, height * 0.2);
    rect(x, height, width / 128, h);
  }

  let waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(20);

  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, 0, height);
    vertex(x, y);
  }
  endShape();
}

window.onload = function setup() {
  let sliderLowest = document.getElementById("slider-lowest");
  let sliderLowestValue = document.getElementById("slider-lowest-value");

  let sliderHighest = document.getElementById("slider-highest");
  let sliderHighestValue = document.getElementById("slider-highest-value");

  sliderLowest.oninput = (e) => {
    lowest = parseInt(sliderLowest.value);
    sliderLowestValue.innerHTML = `${lowest}Hz, ≈${noteNameFromFrequency(
      lowest
    )}`;
  };

  sliderHighest.oninput = (e) => {
    highest = parseInt(sliderHighest.value);
    sliderHighestValue.innerHTML = `${highest}Hz, ≈${noteNameFromFrequency(
      highest
    )}`;
  };

  let selectOscillatorType = document.getElementById("select-oscillator-type");
  selectOscillatorType.onchange = (e) => {
    osc.setType(selectOscillatorType.value);
    oscillatorType = selectOscillatorType.value;
  };

  let checkboxNoteOverlay = document.getElementById("option-note-overlay");
  checkboxNoteOverlay.oninput = (e) => {
    noteOverlay = checkboxNoteOverlay.checked;
  };

  let checkboxUseLinear = document.getElementById("option-use-linear");
  checkboxUseLinear.oninput = (e) => {
    useLinear = checkboxUseLinear.checked;
  };

  let checkboxClamp = document.getElementById("option-clamp");
  checkboxClamp.oninput = (e) => {
    clampNotes = checkboxClamp.checked;
  };
};
