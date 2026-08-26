import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, Composition } from "remotion";
import { TitleOverlay } from "./TitleOverlay";
import { ZoomedVideo } from "./ZoomedVideo";

const FPS = 30;
const TRANSITION_FRAMES = 10;

// Cut list, derived from adaptive silence detection on public/media/video.mp4.
// Each block is [sourceStartSeconds, sourceEndSeconds]; cuts land on natural
// speech pauses so no word is cut mid-syllable.
const BLOCKS = [
  { start: 1.6, end: 20.48, zoomTo: 1.08 },
  { start: 29.39, end: 37.45, zoomTo: 1.1 },
  { start: 43.5, end: 46.53, zoomTo: 1.05 },
  { start: 52.89, end: 88.9, zoomTo: 1.15 },
].map((b) => ({
  trimBefore: Math.round(b.start * FPS),
  trimAfter: Math.round(b.end * FPS),
  durationInFrames: Math.round(b.end * FPS) - Math.round(b.start * FPS),
  zoomTo: b.zoomTo,
}));

const TOTAL_DURATION =
  BLOCKS.reduce((sum, b) => sum + b.durationInFrames, 0) -
  (BLOCKS.length - 1) * TRANSITION_FRAMES;

export const KtoYaReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        {BLOCKS.flatMap((block, i) => [
          i > 0 ? (
            <TransitionSeries.Transition
              key={`t-${i}`}
              presentation={fade()}
              timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
            />
          ) : null,
          <TransitionSeries.Sequence
            key={`s-${i}`}
            durationInFrames={block.durationInFrames}
            name={`Shot-${i + 1}`}
          >
            <ZoomedVideo
              trimBefore={block.trimBefore}
              trimAfter={block.trimAfter}
              durationInFrames={block.durationInFrames}
              zoomTo={block.zoomTo}
            />
          </TransitionSeries.Sequence>,
        ])}
      </TransitionSeries>
      <TitleOverlay />
    </AbsoluteFill>
  );
};

export const RemotionComposition: React.FC = () => {
  return (
    <Composition
      id="KtoYaReel"
      component={KtoYaReel}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
