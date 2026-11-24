import { AbsoluteFill, Composition, Mix, registerRoot, staticFile } from "raea";
import * as Tone from "raea/tone";

Tone.getTransport().bpm.value = 120;

const hall = new Tone.Reverb({ decay: 1.4, wet: 0.35 }).connect(Tone.buses.sfx);

// Stage 1: Explode impact (sub drop + punch)
const impactDrum = new Tone.Player({
  url: staticFile("sounds/vcsl-bass-drum-1/BDrumNew_hit_v5_rr1_Sum.wav"),
  volume: -4,
}).connect(Tone.buses.sfx);

const subDrop = new Tone.MembraneSynth({
  pitchDecay: 0.08,
  octaves: 5,
  oscillator: { type: "sine" },
  envelope: { attack: 0.005, decay: 0.45, sustain: 0.0, release: 0.2 },
  volume: -5,
}).connect(Tone.buses.sfx);

// Stage 2: Vortex swirl (swept noise + metallic shimmer)
const noiseFilter = new Tone.Filter({ type: "bandpass", frequency: 240, Q: 3.5 }).connect(hall);
const vortexNoise = new Tone.NoiseSynth({
  noise: { type: "pink" },
  envelope: { attack: 0.15, decay: 0.75, sustain: 0.15, release: 0.4 },
  volume: -10,
}).connect(noiseFilter);

const cymbBow = new Tone.Player({
  url: staticFile("sounds/vcsl-suspended-cymbal-1/susCymb1_bow_13.wav"),
  volume: -12,
}).connect(hall);

// Stage 3: Reassemble crystalline lock
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
  release: 0.9,
  volume: -4,
}).connect(hall);

const lockSynth = new Tone.PolySynth(Tone.FMSynth, {
  harmonicity: 2.5,
  modulationIndex: 4,
  envelope: { attack: 0.01, decay: 0.45, sustain: 0.1, release: 0.6 },
  volume: -12,
}).connect(hall);

const tr = Tone.getTransport();
// 0.00s: Explode
tr.schedule((t) => {
  impactDrum.start(t);
  subDrop.triggerAttackRelease("C2", "8n", t, 0.9);
  vortexNoise.triggerAttackRelease("2n", t, 0.8);
  noiseFilter.frequency.setValueAtTime(220, t);
  noiseFilter.frequency.exponentialRampToValueAtTime(2800, 0.55, t);
  noiseFilter.frequency.exponentialRampToValueAtTime(520, 0.55, t + 0.55);
}, 0);

// 0.12s: Vortex swirl
tr.schedule((t) => {
  cymbBow.start(t);
}, 0.12);

// 0.85s: Reassemble crystalline lock
tr.schedule((t) => {
  celesta.triggerAttackRelease("E5", "8n", t, 0.72);
  celesta.triggerAttackRelease("B5", "8n", t + 0.07, 0.78);
  celesta.triggerAttackRelease("E6", "4n", t + 0.14, 0.88);
  lockSynth.triggerAttackRelease(["E4", "B4", "E5"], "4n", t + 0.12, 0.65);
}, 0.82);

tr.start();

export default function SfxMorphNext() {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Mix lufs={-14} ceiling={-1.5} />
    </AbsoluteFill>
  );
}

registerRoot(() => (
  <Composition id="sfx-morph-next" component={SfxMorphNext} width={640} height={360} fps={30} durationInFrames={54} />
));
