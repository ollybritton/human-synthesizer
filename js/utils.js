// The following code is adapted from PitchDetect.js (https://github.com/cwilso/PitchDetect/blob/master/js/pitchdetect.js).
var noteStrings = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

function noteNumberFromFrequency(frequency) {
  var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
}

function noteNameFromFrequency(frequency) {
  return noteStrings[noteNumberFromFrequency(frequency) % 12];
}

function frequencyFromNoteNumber(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}
