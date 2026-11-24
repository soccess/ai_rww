import { AbsoluteFill, Composition, Mix, registerRoot, staticFile } from "raea";
import * as Tone from "raea/tone";

Tone.getTransport().bpm.value = 120;

const hall = new Tone.Reverb({ decay: 1.2, wet: 0.32 }).connect(Tone.buses.sfx);
const noiseFilter = new Tone.Filter({ type: "bandpass", frequency: 2200, Q: 3.0 }).connect(hall);
const rewindNoise = new Tone.NoiseSynth({
  noise: { type: "pink" },
  envelope: { attack: 0.06, decay: 0.6, sustain: 0.08, release: 0.3 },
  volume: -11,
}).connect(noiseFilter);

const piano = new Tone.Sampler({
  urls: {
    "C4": staticFile("sounds/salamander-piano/C4.mp3"),
    "D#4": staticFile("sounds/salamander-piano/Ds4.mp3"),
    "A4": staticFile("sounds/salamander-piano/A4.mp3"),
    "C5": staticFile("sounds/salamander-piano/C5.mp3"),
  },
  release: 0.9,
  volume: -4,
}).connect(hall);

const subPulse = new Tone.MembraneSynth({
  pitchDecay: 0.06,
  octaves: 3,
  oscillator: { type: "sine" },
  envelope: { attack: 0.005, decay: 0.32, sustain: 0, release: 0.15 },
  volume: -7,
}).connect(Tone.buses.sfx);

const tr = Tone.getTransport();
tr.schedule((t) => {
  rewindNoise.triggerAttackRelease("4n.", t, 0.7);
  noiseFilter.frequency.setValueAtTime(2400, t);
  noiseFilter.frequency.exponentialRampToValueAtTime(260, 0.55, t);
  piano.triggerAttackRelease("C5", "8n", t, 0.72);
  piano.triggerAttackRelease("A4", "8n", t + 0.09, 0.65);
  piano.triggerAttackRelease("E4", "4n", t + 0.18, 0.7);
  subPulse.triggerAttackRelease("A1", "8n", t + 0.18, 0.7);
}, 0);
tr.start();

export default function SfxMorphPrev() {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Mix lufs={-14} ceiling={-1.5} />
    </AbsoluteFill>
  );
}

registerRoot(() => (
  <Composition id="sfx-morph-prev" component={SfxMorphPrev} width={640} height={360} fps={30} durationInFrames={39} />
));
