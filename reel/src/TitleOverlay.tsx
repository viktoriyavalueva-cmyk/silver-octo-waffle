import { loadFont } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  weights: ["600", "800"],
  subsets: ["cyrillic", "latin"],
});

const GOLD = "#D4AF6A";

export const TitleOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inStart = 0;
  const inEnd = 2 * fps;
  const holdEnd = 3.4 * fps;
  const outEnd = 4.3 * fps;

  const opacity = interpolate(
    frame,
    [inStart, inEnd, holdEnd, outEnd],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  const translateY = interpolate(frame, [inStart, inEnd], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const lineScale = interpolate(frame, [4, inEnd + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill
      name="TitleOverlay"
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 260,
        pointerEvents: "none",
      }}
    >
      <Interactive.Div
        name="TitleCard"
        style={{
          opacity,
          translate: `0px ${translateY}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            padding: "22px 56px",
            borderRadius: 20,
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.55) 100%)",
            backdropFilter: "blur(2px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Interactive.Div
            name="Title"
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: 92,
              letterSpacing: 4,
              color: "#FFFFFF",
              textTransform: "uppercase",
              textShadow: "0 4px 24px rgba(0,0,0,0.45)",
              lineHeight: 1,
            }}
          >
            КТО Я
          </Interactive.Div>
          <div
            style={{
              marginTop: 16,
              width: 120,
              height: 3,
              borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              scale: `${lineScale} 1`,
            }}
          />
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
