import { AbsoluteFill, Composition, Mix, registerRoot, staticFile } from "raea";
import * as Tone from "raea/tone";

Tone.getTransport().bpm.value = 120; // 16 bars = 32.0 s = 960 frames @ 30fps

const reverbLong = new Tone.Reverb({ decay: 2.2, wet: 0.28 }).connect(Tone.buses.music);
const reverbShort = new Tone.Reverb({ decay: 1.3, wet: 0.2 }).connect(Tone.buses.music);
const delay = new Tone.PingPongDelay({ delayTime: "8n.", feedback: 0.25, wet: 0.22 }).connect(reverbLong);

const piano = new Tone.Sampler({
  urls: {
    "C3": staticFile("sounds/salamander-piano/C3.mp3"),
    "D#3": staticFile("sounds/salamander-piano/Ds3.mp3"),
    "A3": staticFile("sounds/salamander-piano/A3.mp3"),
    "C4": staticFile("sounds/salamander-piano/C4.mp3"),
    "D#4": staticFile("sounds/salamander-piano/Ds4.mp3"),
    "A4": staticFile("sounds/salamander-piano/A4.mp3"),
    "C5": staticFile("sounds/salamander-piano/C5.mp3"),
  },
  release: 1.4,
  volume: -4,
}).connect(reverbShort);

const halo = new Tone.Sampler({
  urls: {
    "C3": staticFile("sounds/fluid-pad_7_halo/C3.mp3"),
    "E3": staticFile("sounds/fluid-pad_7_halo/E3.mp3"),
    "G#3": staticFile("sounds/fluid-pad_7_halo/Gs3.mp3"),
    "C4": staticFile("sounds/fluid-pad_7_halo/C4.mp3"),
    "E4": staticFile("sounds/fluid-pad_7_halo/E4.mp3"),
    "G#4": staticFile("sounds/fluid-pad_7_halo/Gs4.mp3"),
    "C5": staticFile("sounds/fluid-pad_7_halo/C5.mp3"),
  },
  release: 1.8,
  volume: -14,
}).connect(reverbLong);

const strings = new Tone.Sampler({
  urls: {
    "C2": staticFile("sounds/fluid-synth_strings_1/C2.mp3"),
    "E2": staticFile("sounds/fluid-synth_strings_1/E2.mp3"),
    "G#2": staticFile("sounds/fluid-synth_strings_1/Gs2.mp3"),
    "C3": staticFile("sounds/fluid-synth_strings_1/C3.mp3"),
    "E3": staticFile("sounds/fluid-synth_strings_1/E3.mp3"),
    "G#3": staticFile("sounds/fluid-synth_strings_1/Gs3.mp3"),
    "C4": staticFile("sounds/fluid-synth_strings_1/C4.mp3"),
  },
  release: 1.5,
  volume: -15,
}).connect(reverbLong);

const celesta = new Tone.Sampler({
  urls: {
    "C4": staticFile("sounds/fluid-celesta/C4.mp3"),
    "E4": staticFile("sounds/fluid-celesta/E4.mp3"),
    "G#4": staticFile("sounds/fluid-celesta/Gs4.mp3"),
    "C5": staticFile("sounds/fluid-celesta/C5.mp3"),
    "E5": staticFile("sounds/fluid-celesta/E5.mp3"),
    "G#5": staticFile("sounds/fluid-celesta/Gs5.mp3"),
    "C6": staticFile("sounds/fluid-celesta/C6.mp3"),
  },
  release: 1.0,
  volume: -10,
}).connect(delay);

const subBass = new Tone.MonoSynth({
  oscillator: { type: "triangle" },
  envelope: { attack: 0.04, decay: 0.4, sustain: 0.6, release: 0.5 },
  filter: { type: "lowpass", frequency: 240, Q: 1.2 },
  filterEnvelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 0.4, baseFrequency: 90, octaves: 1.8 },
  volume: -9,
}).connect(Tone.buses.music);

const kick = new Tone.Player({
  url: staticFile("sounds/vcsl-bass-drum-1/BDrumNew_hit_v3_rr1_Sum.wav"),
  volume: -12,
}).connect(Tone.buses.music);

const cymbSwell = new Tone.Player({
  url: staticFile("sounds/vcsl-suspended-cymbal-1/susCymb1_cresc_2s.wav"),
  volume: -16,
}).connect(reverbLong);

// 16-bar futuristic inspirational progression (Am9 - Fmaj7 - Cmaj9 - G6 cycle)
const PROG: { root: string; bass: string; pad: string[]; arp: string[] }[] = [
  { root: "A2", bass: "A1", pad: ["A3", "C4", "E4", "B4"], arp: ["A3", "E4", "B4", "C5", "E5", "B4", "C5", "E4"] },
  { root: "F2", bass: "F1", pad: ["F3", "A3", "C4", "E4"], arp: ["F3", "C4", "E4", "A4", "C5", "A4", "E4", "C4"] },
  { root: "C3", bass: "C2", pad: ["C4", "E4", "G4", "D5"], arp: ["C4", "G4", "D5", "E5", "G5", "E5", "D5", "G4"] },
  { root: "G2", bass: "G1", pad: ["G3", "B3", "D4", "E4"], arp: ["G3", "D4", "E4", "B4", "D5", "B4", "E4", "D4"] },

  { root: "A2", bass: "A1", pad: ["A3", "C4", "E4", "G4"], arp: ["A3", "E4", "G4", "C5", "E5", "C5", "G4", "E4"] },
  { root: "F2", bass: "F1", pad: ["F3", "A3", "C4", "G4"], arp: ["F3", "C4", "G4", "A4", "C5", "A4", "G4", "C4"] },
  { root: "D3", bass: "D2", pad: ["D4", "F4", "A4", "E5"], arp: ["D4", "A4", "E5", "F5", "A5", "F5", "E5", "A4"] },
  { root: "E2", bass: "E1", pad: ["E3", "G3", "B3", "D4"], arp: ["E3", "B3", "D4", "G4", "B4", "G4", "D4", "B3"] },

  { root: "F2", bass: "F1", pad: ["F3", "A3", "C4", "E4"], arp: ["F3", "C4", "E4", "A4", "C5", "E5", "C5", "A4"] },
  { root: "G2", bass: "G1", pad: ["G3", "B3", "D4", "F#4"], arp: ["G3", "D4", "F#4", "B4", "D5", "F#5", "D5", "B4"] },
  { root: "C3", bass: "C2", pad: ["C4", "E4", "G4", "B4"], arp: ["C4", "G4", "B4", "E5", "G5", "E5", "B4", "G4"] },
  { root: "A2", bass: "A1", pad: ["A3", "C4", "E4", "B4"], arp: ["A3", "E4", "B4", "C5", "E5", "B4", "C5", "E4"] },

  { root: "D3", bass: "D2", pad: ["D4", "F4", "A4", "C5"], arp: ["D4", "A4", "C5", "F5", "A5", "F5", "C5", "A4"] },
  { root: "G2", bass: "G1", pad: ["G3", "B3", "D4", "E4"], arp: ["G3", "D4", "E4", "B4", "D5", "B4", "E4", "D4"] },
  { root: "F2", bass: "F1", pad: ["F3", "A3", "C4", "E4"], arp: ["F3", "C4", "E4", "A4", "C5", "A4", "E4", "C4"] },
  { root: "E2", bass: "E1", pad: ["E3", "B3", "D4", "G4"], arp: ["E3", "B3", "D4", "G4", "B4", "D5", "B4", "G4"] },
];

// Piano eighth-note arpeggio across all 16 bars
new Tone.Part(
  (t, ev) => piano.triggerAttackRelease(ev.note, "8n.", t, ev.vel),
  PROG.flatMap((bar, b) =>
    bar.arp.map((note, i) => ({
      time: `${b}:${Math.floor(i / 2)}:${(i % 2) * 2}`,
      note,
      vel: i === 0 ? 0.72 : i % 2 === 0 ? 0.56 : 0.42,
    }))
  )
).start(0);

// Warm Halo Pad + Strings every bar
new Tone.Part(
  (t, ev) => {
    halo.triggerAttackRelease(ev.pad, "2n.", t, 0.55);
    if (ev.bar >= 4) {
      strings.triggerAttackRelease([ev.root, ev.pad[1]], "1m", t, ev.bar >= 8 ? 0.52 : 0.36);
    }
  },
  PROG.map((bar, b) => ({ time: `${b}:0:0`, pad: bar.pad, root: bar.root, bar: b }))
).start(0);

// Deep sub-bass pulse from bar 2 onward
new Tone.Part(
  (t, ev) => subBass.triggerAttackRelease(ev.bass, ev.dur, t, ev.vel),
  PROG.flatMap((bar, b) =>
    b < 2
      ? []
      : [
          { time: `${b}:0:0`, bass: bar.bass, dur: "2n", vel: 0.75 },
          { time: `${b}:2:2`, bass: bar.root, dur: "4n", vel: 0.55 },
        ]
  )
).start(0);

// Crystalline Celesta motif (bars 0-1, 4-5, 8-11, 12-15)
const MOTIF: [string, string, string, number][] = [
  ["0:0:0", "E5", "4n", 0.65], ["0:1:2", "G5", "8n", 0.5], ["0:2:0", "B5", "2n", 0.7],
  ["1:0:0", "A5", "4n.", 0.65], ["1:2:0", "E5", "2n", 0.55],
  ["4:0:0", "C6", "4n", 0.75], ["4:1:0", "B5", "8n", 0.6], ["4:1:2", "G5", "8n", 0.6], ["4:2:0", "E5", "2n", 0.7],
  ["6:0:0", "F5", "4n", 0.7], ["6:1:2", "A5", "8n", 0.6], ["6:2:0", "E5", "2n", 0.65],
  ["8:0:0", "E5", "4n", 0.75], ["8:1:0", "A5", "4n", 0.78], ["8:2:0", "C6", "2n", 0.85],
  ["9:0:0", "B5", "4n.", 0.8], ["9:1:2", "A5", "8n", 0.65], ["9:2:0", "G5", "2n", 0.75],
  ["10:0:0", "E5", "4n", 0.75], ["10:1:2", "G5", "8n", 0.65], ["10:2:0", "B5", "2n.", 0.82],
  ["12:0:0", "A5", "4n", 0.72], ["12:1:2", "F5", "8n", 0.6], ["12:2:0", "C6", "2n", 0.78],
  ["14:0:0", "A5", "4n.", 0.7], ["14:2:0", "E5", "2n", 0.65],
  ["15:0:0", "G5", "2n", 0.72], ["15:2:0", "B5", "2n", 0.68],
];
new Tone.Part(
  (t, ev) => celesta.triggerAttackRelease(ev.note, ev.dur, t, ev.vel),
  MOTIF.map(([time, note, dur, vel]) => ({ time, note, dur, vel }))
).start(0);

// Soft heartbeat kick & cymbal swells at section builds
new Tone.Part(
  (t) => kick.start(t),
  Array.from({ length: 12 }, (_, idx) => idx + 4).flatMap((b) => [
    { time: `${b}:0:0` },
    { time: `${b}:2:0` },
  ])
).start(0);

Tone.getTransport().schedule((t) => cymbSwell.start(t), "7:0:0");
Tone.getTransport().schedule((t) => cymbSwell.start(t), "15:0:0");
Tone.getTransport().start();

export default function BgmLoop() {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Mix lufs={-14} ceiling={-1.5} />
    </AbsoluteFill>
  );
}

registerRoot(() => (
  <Composition id="bgm-loop" component={BgmLoop} width={640} height={360} fps={30} durationInFrames={960} />
));
