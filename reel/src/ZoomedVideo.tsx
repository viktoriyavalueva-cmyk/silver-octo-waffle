import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

type Props = {
  trimBefore: number;
  trimAfter: number;
  durationInFrames: number;
  zoomFrom?: number;
  zoomTo?: number;
};

const FADE_FRAMES = 6;

export const ZoomedVideo: React.FC<Props> = ({
  trimBefore,
  trimAfter,
  durationInFrames,
  zoomFrom = 1,
  zoomTo = 1.12,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
    output: "perceptual-scale",
  });

  const volume = interpolate(
    frame,
    [
      0,
      FADE_FRAMES,
      durationInFrames - FADE_FRAMES,
      durationInFrames,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill name="Shot" style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Video
        src={staticFile("media/video.mp4")}
        trimBefore={trimBefore}
        trimAfter={trimAfter}
        volume={volume}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale,
        }}
      />
    </AbsoluteFill>
  );
};
