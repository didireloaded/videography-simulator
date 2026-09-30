import type { IconName } from "@/components/Icon";

export type Scenario = {
  id: string;
  title: string;
  icon: IconName;
  intro: string;
  startingPoint: { label: string; value: string }[];
  tips: string[];
  tools: { label: string; href: string }[];
};

export const scenarios: Scenario[] = [
  {
    id: "interview",
    title: "Shoot an interview",
    icon: "interview",
    intro:
      "Start with a flattering, repeatable setup. Lock the look first, then let exposure absorb the room.",
    startingPoint: [
      { label: "Shot size", value: "Medium close-up, eye-level" },
      { label: "Lens", value: "50–85mm at f/2.8–f/4" },
      { label: "Frame rate", value: "25 fps, 1/50s (180°)" },
      { label: "Light", value: "Soft key 45°, gentle fill, rim" },
      { label: "Audio", value: "Lavalier + boom safety track" },
    ],
    tips: [
      "Leave looking room in the direction the subject faces.",
      "Keep headroom tight — a sliver above the head.",
      "Record 30s of room tone before you leave.",
    ],
    tools: [
      { label: "Exposure triangle", href: "/tools/exposure" },
      { label: "Shot sizes", href: "/tools/shot-sizes" },
      { label: "Lighting patterns", href: "/tools/lighting" },
    ],
  },
  {
    id: "low-light",
    title: "Film a low-light event",
    icon: "low-light",
    intro:
      "Protect the shadows. Decide your noise ceiling first, then open up and slow the shutter within reason.",
    startingPoint: [
      { label: "Aperture", value: "Wide open (f/1.4–f/1.8)" },
      { label: "ISO", value: "Second native ISO, cap noise" },
      { label: "Shutter", value: "180° if motion allows" },
      { label: "Lens", value: "Fast prime, stabilised" },
      { label: "Profile", value: "Log for highlight latitude" },
    ],
    tips: [
      "Expose to the right to bury noise in the shadows.",
      "Use practical and motivated lights wherever you can.",
      "A slightly slow shutter trades blur for light — embrace it for mood.",
    ],
    tools: [
      { label: "Exposure triangle", href: "/tools/exposure" },
      { label: "Frame rate & shutter", href: "/tools/shutter" },
    ],
  },
  {
    id: "slowmo",
    title: "Create slow motion",
    icon: "slowmo",
    intro:
      "Slow motion is about capture rate, then playback. Double the frames and brighten your lights.",
    startingPoint: [
      { label: "Capture", value: "50 / 60 / 100 / 120 fps" },
      { label: "Shutter", value: "180° → 1/240s at 120 fps" },
      { label: "Light", value: "Much more light (shutter is faster)" },
      { label: "Shutter test", value: "Watch for flicker on LED/HMI" },
      { label: "Playback", value: "Conform to 24/25 fps timeline" },
    ],
    tips: [
      "Faster shutter needs more light — plan for it.",
      "Some LEDs and street lights flicker at high frame rates; test first.",
      "Keep motion smooth — slow motion punishes jitter.",
    ],
    tools: [
      { label: "Frame rate & shutter", href: "/tools/shutter" },
      { label: "Movement simulator", href: "/tools/movement" },
    ],
  },
  {
    id: "product",
    title: "Shoot a product video",
    icon: "product",
    intro:
      "Crisp, controlled and glossy. Stop down for sharpness, light for sheen, and move with intention.",
    startingPoint: [
      { label: "Aperture", value: "f/5.6–f/8 for sharp detail" },
      { label: "Lens", value: "Macro/tele, low distortion" },
      { label: "Frame rate", value: "60 fps for silky moves" },
      { label: "Light", value: "Soft top key + controlled highlights" },
      { label: "Move", value: "Slow slider / turntable" },
    ],
    tips: [
      "Control reflections — flag the lens and surroundings.",
      "Use a turntable or slider for repeatable, smooth motion.",
      "Diffuse everything; product shots hate harsh speculars.",
    ],
    tools: [
      { label: "Aperture & DoF", href: "/tools/aperture" },
      { label: "Movement simulator", href: "/tools/movement" },
      { label: "Lighting patterns", href: "/tools/lighting" },
    ],
  },
  {
    id: "music-video",
    title: "Film a music video",
    icon: "music-video",
    intro:
      "Energy, rhythm and style. Pick a movement grammar and a frame-rate plan for the performance.",
    startingPoint: [
      { label: "Frame rate", value: "Match performance to track BPM" },
      { label: "Move", value: "Gimbal arcs + dynamic handheld" },
      { label: "Lens", value: "Mixed: wide energy + tight detail" },
      { label: "Light", value: "Bold colour, haze, practicals" },
      { label: "Sync", value: "Playback at known speed/timecode" },
    ],
    tips: [
      "Choreograph camera moves to musical accents.",
      "Plan slow-mo beats at multiples of your base frame rate.",
      "Let one strong visual idea carry each setup.",
    ],
    tools: [
      { label: "Movement simulator", href: "/tools/movement" },
      { label: "Shot sizes", href: "/tools/shot-sizes" },
      { label: "Composition", href: "/tools/composition" },
    ],
  },
  {
    id: "talking-head",
    title: "Set up a talking-head video",
    icon: "talking-head",
    intro:
      "Clean, repeatable and flattering. One great key and a locked-off frame will out-perform ten clever ones.",
    startingPoint: [
      { label: "Shot size", value: "Medium shot, eye-level" },
      { label: "Lens", value: "50mm, f/2.8–f/4" },
      { label: "Frame rate", value: "24/25 fps, 180°" },
      { label: "Light", value: "Large soft key + subtle rim" },
      { label: "Separation", value: "Pull subject off the background" },
    ],
    tips: [
      "Create depth: separate subject, background and lights.",
      "Lock white balance for consistent skin tone.",
      "Record dual-system audio with a safety track.",
    ],
    tools: [
      { label: "Composition", href: "/tools/composition" },
      { label: "Exposure triangle", href: "/tools/exposure" },
      { label: "Lighting patterns", href: "/tools/lighting" },
    ],
  },
  {
    id: "choose-movement",
    title: "Choose a camera movement",
    icon: "choose-movement",
    intro:
      "Movement is a sentence, not an effect. Match the move to the emotion, then compare two side by side.",
    startingPoint: [
      { label: "Reveal", value: "Dolly in or slow push" },
      { label: "Follow", value: "Tracking / truck alongside" },
      { label: "Scale", value: "Arc or jib for dimension" },
      { label: "Energy", value: "Handheld or whip pan" },
      { label: "Dread", value: "Dolly zoom" },
    ],
    tips: [
      "Ask what the move should make the viewer feel.",
      "Compare dolly vs zoom to feel the difference in perspective.",
      "A great static frame beats a mediocre moving one.",
    ],
    tools: [
      { label: "Movement simulator", href: "/tools/movement" },
      { label: "Camera angles", href: "/tools/angles" },
      { label: "Client Mode", href: "/client" },
    ],
  },
  {
    id: "exposure-fix",
    title: "Fix an exposure problem",
    icon: "exposure-fix",
    intro:
      "Diagnose before you change anything. Decide which trade-off you can afford, then move one setting at a time.",
    startingPoint: [
      { label: "Too dark", value: "Open aperture → slower shutter → raise ISO (last)" },
      { label: "Too bright", value: "ND filter → stop down → faster shutter" },
      { label: "Noisy", value: "Lower ISO, add light, expose brighter" },
      { label: "Motion choppy", value: "Check you're near 180°" },
      { label: "Blown highlights", value: "Pull exposure / use log / ND" },
    ],
    tips: [
      "Reach for an ND before you speed up the shutter.",
      "Read the histogram, not just the LCD.",
      "Protect highlights — you can lift shadows, not restore clipped detail.",
    ],
    tools: [
      { label: "Exposure triangle", href: "/tools/exposure" },
      { label: "Frame rate & shutter", href: "/tools/shutter" },
    ],
  },
];

export type ClientPhrase = {
  says: string;
  direction: string;
  slug: string;
};

export const clientPhrases: ClientPhrase[] = [
  { says: "Move closer to them", direction: "Dolly in / push in", slug: "dolly-in" },
  { says: "Move away from them", direction: "Dolly out / pull out", slug: "dolly-in" },
  { says: "Turn the camera left", direction: "Pan left", slug: "pan" },
  { says: "Turn the camera right", direction: "Pan right", slug: "pan" },
  { says: "Follow them sideways", direction: "Truck / tracking shot", slug: "truck" },
  { says: "Point the camera upward", direction: "Tilt up", slug: "tilt" },
  { says: "Point the camera down", direction: "Tilt down", slug: "tilt" },
  { says: "Raise the whole camera", direction: "Pedestal / boom up", slug: "pedestal" },
  { says: "Lower the whole camera", direction: "Pedestal down", slug: "pedestal" },
  { says: "Make the image rotate", direction: "Roll / Dutch", slug: "dutch-angle" },
  { says: "Make them feel closer without moving", direction: "Zoom in", slug: "zoom" },
  { says: "Circle around them", direction: "Arc / orbit", slug: "arc" },
  { says: "Whoosh across really fast", direction: "Whip pan", slug: "whip-pan" },
  { says: "Make it feel shaky and real", direction: "Handheld", slug: "handheld" },
  { says: "Keep it totally still", direction: "Static / locked-off", slug: "static" },
  { says: "Swoop down from high up", direction: "Jib / boom", slug: "boom" },
];

export type MoveKind =
  | "pan" | "tilt" | "dollyIn" | "dollyOut" | "truck" | "pedestal"
  | "boom" | "arc" | "zoom" | "dollyZoom" | "tracking" | "whipPan" | "handheld" | "static";

export type MoveDef = {
  kind: MoveKind;
  name: string;
  abbr: string;
  operator: string;
  equipment: string;
  feel: string;
  mistake: string;
  // top-down camera path as percentages [x, y] around a subject at center
  path: [number, number][];
  rotates?: number; // degrees the lens rotates during the move
};

export const movements: MoveDef[] = [
  {
    kind: "pan",
    name: "Pan",
    abbr: "PAN",
    operator: "Rotate the head horizontally left or right; the camera stays put.",
    equipment: "Fluid head on a tripod.",
    feel: "Sweeping, observant; follows action or reveals the space.",
    mistake: "Confusing it with a truck — a pan rotates, it doesn't travel.",
    path: [[42, 50], [50, 50], [58, 50]],
    rotates: 40,
  },
  {
    kind: "tilt",
    name: "Tilt",
    abbr: "TILT",
    operator: "Rotate the head vertically up or down; the camera stays put.",
    equipment: "Fluid head on a tripod.",
    feel: "Reveals height — feet to face, or ground to skyline.",
    mistake: "Letting the head drift sideways while tilting.",
    path: [[50, 56], [50, 50], [50, 44]],
    rotates: 0,
  },
  {
    kind: "dollyIn",
    name: "Dolly In",
    abbr: "D-IN",
    operator: "Roll the whole camera forward toward the subject along a line.",
    equipment: "Dolly on track, slider, or pushed gimbal.",
    feel: "Growing intimacy and focus; pulls the viewer in.",
    mistake: "Confusing it with a zoom — a dolly changes perspective.",
    path: [[80, 50], [65, 50], [50, 50]],
  },
  {
    kind: "dollyOut",
    name: "Dolly Out",
    abbr: "D-OUT",
    operator: "Roll the whole camera backward, away from the subject.",
    equipment: "Dolly on track, slider, or pulled gimbal.",
    feel: "Distance, scale or a slow release; reveals context.",
    mistake: "Drifting off-axis so the subject slides out of frame.",
    path: [[50, 50], [65, 50], [80, 50]],
  },
  {
    kind: "truck",
    name: "Truck Left/Right",
    abbr: "TRK",
    operator: "Translate the whole camera sideways, facing forward the whole time.",
    equipment: "Dolly on track, slider, or side-stepping gimbal.",
    feel: "Tracks the subject and adds parallax depth.",
    mistake: "Calling it a pan — a truck translates, it doesn't rotate.",
    path: [[35, 50], [50, 50], [65, 50]],
  },
  {
    kind: "pedestal",
    name: "Pedestal Up/Down",
    abbr: "PED",
    operator: "Raise or lower the whole camera vertically, keeping the angle.",
    equipment: "Studio pedestal, jib, or motorised column.",
    feel: "A clean vertical reveal without tilt distortion.",
    mistake: "Confusing it with a tilt — a pedestal keeps the angle and moves.",
    path: [[50, 66], [50, 50], [50, 34]],
  },
  {
    kind: "boom",
    name: "Boom / Jib",
    abbr: "JIB",
    operator: "Swing a long arm through an arc, sweeping the camera high and low.",
    equipment: "Jib, crane, or technocrane with a remote head.",
    feel: "Grand, sweeping, god-like reveals.",
    mistake: "Hiding a bad composition behind constant motion.",
    path: [[62, 70], [50, 50], [38, 30]],
  },
  {
    kind: "arc",
    name: "Arc / Orbit",
    abbr: "ARC",
    operator: "Curve the camera around the subject at a roughly constant radius.",
    equipment: "Gimbal, steadicam, or curved dolly track.",
    feel: "Dimension and dynamism; the world turns around the subject.",
    mistake: "Drifting closer or farther so focus and framing shift.",
    path: [[68, 60], [68, 40], [50, 32], [32, 40], [32, 60], [50, 68]],
  },
  {
    kind: "zoom",
    name: "Zoom In",
    abbr: "ZOOM",
    operator: "Change focal length from a fixed position to magnify the subject.",
    equipment: "Parfocal zoom lens (focus holds through the range).",
    feel: "Sudden attention or stylised energy; perspective stays put.",
    mistake: "Confusing it with a dolly — zoom magnifies without moving.",
    path: [[75, 50], [75, 50], [75, 50]],
  },
  {
    kind: "dollyZoom",
    name: "Dolly Zoom",
    abbr: "D-ZOOM",
    operator: "Dolly in while zooming out so the subject size stays constant.",
    equipment: "Dolly/track plus a zoom lens with matched speed.",
    feel: "Vertigo — the world warps while the subject is frozen.",
    mistake: "Letting the subject grow or shrink so the effect reads flat.",
    path: [[78, 50], [64, 50], [50, 50]],
  },
  {
    kind: "tracking",
    name: "Tracking",
    abbr: "TRK",
    operator: "Follow the subject through space, matching its pace.",
    equipment: "Gimbal, steadicam, or dolly on track.",
    feel: "Immersion and momentum; carries the viewer through the world.",
    mistake: "Uneven pace that pulls ahead of or lags behind the subject.",
    path: [[30, 50], [50, 50], [70, 50]],
  },
  {
    kind: "whipPan",
    name: "Whip Pan",
    abbr: "WHIP",
    operator: "Snap the head hard and fast, then settle on the next frame.",
    equipment: "Fluid head or handheld.",
    feel: "Speed, chaos, or a smash-cut hidden in the blur.",
    mistake: "Speed so wild the start and end frames are unusable.",
    path: [[40, 50], [50, 50], [60, 50]],
    rotates: 90,
  },
  {
    kind: "handheld",
    name: "Handheld",
    abbr: "HH",
    operator: "Hold the camera by hand; introduce organic micro-movement.",
    equipment: "Light rig with grips, or a stabilising monitor.",
    feel: "Documentary immediacy, tension, 'being there'.",
    mistake: "Mistaking shake for energy — too much just reads sloppy.",
    path: [[48, 52], [52, 48], [49, 51], [51, 49]],
  },
  {
    kind: "static",
    name: "Static",
    abbr: "STAT",
    operator: "Lock the tripod and let the action move inside a still frame.",
    equipment: "Heavy tripod, sandbags, locked head.",
    feel: "Control and stillness; observation rather than movement.",
    mistake: "An unlocked head that creeps and ruins the composition.",
    path: [[70, 50]],
  },
];

export const movementPairs = [
  { a: "dollyIn", b: "zoom", label: "Dolly in vs Zoom in" },
  { a: "pan", b: "truck", label: "Pan vs Truck" },
  { a: "tilt", b: "pedestal", label: "Tilt vs Pedestal" },
  { a: "handheld", b: "static", label: "Handheld vs Static" },
  { a: "arc", b: "truck", label: "Arc vs Truck" },
  { a: "boom", b: "tilt", label: "Jib vs Tilt" },
];

export function findMovement(kind: string): MoveDef | undefined {
  return movements.find((m) => m.kind === kind);
}

export const shotSizes = [
  { id: "ews", name: "Extreme Wide", crop: 0.08 },
  { id: "ws", name: "Wide Shot", crop: 0.16 },
  { id: "fs", name: "Full Shot", crop: 0.28 },
  { id: "mws", name: "Medium Wide", crop: 0.42 },
  { id: "cs", name: "Cowboy Shot", crop: 0.52 },
  { id: "ms", name: "Medium Shot", crop: 0.64 },
  { id: "mcu", name: "Medium Close-Up", crop: 0.78 },
  { id: "cu", name: "Close-Up", crop: 0.9 },
  { id: "ecu", name: "Extreme Close-Up", crop: 1.05 },
];

export const angleList = [
  { id: "ground", name: "Ground Level", deg: -75, label: "GROUND" },
  { id: "low", name: "Low Angle", deg: -35, label: "LOW" },
  { id: "knee", name: "Knee Level", deg: -18, label: "KNEE" },
  { id: "hip", name: "Hip Level", deg: -8, label: "HIP" },
  { id: "eye", name: "Eye Level", deg: 0, label: "EYE" },
  { id: "shoulder", name: "Shoulder Level", deg: 8, label: "SHLDR" },
  { id: "high", name: "High Angle", deg: 30, label: "HIGH" },
  { id: "birds", name: "Bird's-Eye", deg: 75, label: "TOP" },
];

export const focalLengths = [
  { mm: 14, label: "14mm" },
  { mm: 16, label: "16mm" },
  { mm: 24, label: "24mm" },
  { mm: 35, label: "35mm" },
  { mm: 50, label: "50mm" },
  { mm: 85, label: "85mm" },
  { mm: 135, label: "135mm" },
  { mm: 200, label: "200mm" },
];

export const apertures = ["f/1.4", "f/2", "f/2.8", "f/4", "f/5.6", "f/8", "f/11", "f/16"];

export const frameRates = [24, 25, 30, 50, 60, 100, 120];

export const whiteBalancePoints = [
  { k: 1900, name: "Candlelight" },
  { k: 2700, name: "Tungsten" },
  { k: 3200, name: "Warm Indoor" },
  { k: 4000, name: "Fluorescent" },
  { k: 5200, name: "Daylight" },
  { k: 6000, name: "Cloudy Daylight" },
  { k: 7500, name: "Shade" },
  { k: 9000, name: "Cool LED" },
];
