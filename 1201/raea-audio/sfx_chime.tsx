import { AbsoluteFill, Composition, Mix, registerRoot, staticFile } from "raea";
import * as Tone from "raea/tone";

Tone.getTransport().bpm.value = 120;

const hall = new Tone.Reverb({ decay: 1.0, wet: 0.25 }).connect(Tone.buses.sfx);
const celesta = new Tone.Sampler({
  urls: {
    "C5": staticFile("sounds/fluid-celesta/C5.mp3"),
    "E5": staticFile("sounds/fluid-celesta/E5.mp3"),
    "G#5": staticFile("sounds/fluid-celesta/Gs5.mp3"),
    "C6": staticFile("sounds/fluid-celesta/C6.mp3"),
  },
  release: 0.8,
  volume: -4,
}).connect(hall);

const tr = Tone.getTransport();
tr.schedule((t) => {
  celesta.triggerAttackRelease("C5", "16n", t, 0.65);
  celesta.triggerAttackRelease("G5", "16n", t + 0.06, 0.72);
  celesta.triggerAttackRelease("C6", "4n", t + 0.12, 0.85);
}, 0);
tr.start();

export default function SfxChime() {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Mix lufs={-14} ceiling={-1.5} />
    </AbsoluteFill>
  );
}

registerRoot(() => (
  <Composition id="sfx-chime" component={SfxChime} width={640} height={360} fps={30} durationInFrames={30} />
));
