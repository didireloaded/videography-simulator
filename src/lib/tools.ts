import { isDepartmentVisible, type Accent } from "@/lib/content";
import type { IconName } from "@/components/Icon";

export type ToolDef = {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  accent: Accent;
  category: string;
  glyph: IconName;
  departments?: string[];
};

export const tools: ToolDef[] = [
  // Cinematography & Lighting
  { slug: "exposure", title: "Exposure & Depth Test", kicker: "INTERACTIVE", description: "Drag aperture, shutter and ISO. Lock settings and let the simulator calculate the rest, with a live preview.", accent: "flare", category: "exposure", glyph: "sun", departments: ["cinematography", "lighting-grip"] },
  { slug: "shutter", title: "Frame Rate & Shutter", kicker: "CALCULATOR", description: "Pick a frame rate and shutter angle, see the exact shutter speed, and compare motion blur side by side.", accent: "amber", category: "exposure", glyph: "film", departments: ["cinematography"] },
  { slug: "aperture", title: "Aperture & Depth of Field", kicker: "SIMULATOR", description: "Move the subject, push the background away and change focal length to learn what really controls blur.", accent: "flare", category: "exposure", glyph: "aperture", departments: ["cinematography", "directing"] },
  { slug: "white-balance", title: "White Balance & Kelvin", kicker: "SIMULATOR", description: "Sweep colour temperature from candlelight to cool LED and correct tint across mixed light.", accent: "flare", category: "exposure", glyph: "thermometer", departments: ["cinematography", "lighting-grip"] },
  { slug: "composition", title: "Composition Overlays", kicker: "SANDBOX", description: "Toggle thirds, leading lines, headroom and more over a frame. Drag the subject for live feedback.", accent: "ok", category: "composition", glyph: "grid", departments: ["cinematography", "directing", "production-design"] },
  { slug: "movement", title: "Camera Movement Simulator", kicker: "ANIMATED", description: "See every move as a top-down path plus a lens view, and compare two moves side by side.", accent: "flare", category: "camera-movement", glyph: "move", departments: ["cinematography", "directing"] },
  { slug: "shot-sizes", title: "Shot Sizes & Grammar", kicker: "GUIDE", description: "Re-frame one consistent figure through every shot size and read what each communicates.", accent: "info", category: "shot-sizes", glyph: "shot-sizes", departments: ["cinematography", "directing", "script-continuity"] },
  { slug: "angles", title: "Camera Angles & Power", kicker: "GUIDE", description: "Tilt the camera from ground to bird's-eye and feel how height changes power and feeling.", accent: "info", category: "camera-angles", glyph: "compass", departments: ["cinematography", "directing"] },
  { slug: "lighting", title: "Lighting Ratios & Patterns", kicker: "SIMULATOR", description: "Switch lighting patterns and key-to-fill ratios and watch the face reshape in real time.", accent: "amber", category: "lighting", glyph: "lightbulb", departments: ["cinematography", "lighting-grip"] },
  { slug: "lens", title: "Focal Length & Perspective", kicker: "SIMULATOR", description: "Change focal length and feel field of view, facial distortion and background compression.", accent: "info", category: "exposure", glyph: "focus", departments: ["cinematography", "directing"] },

  // Directing
  { slug: "directing-180", title: "180° Screen Direction & Eyelines", kicker: "VISUALIZER", description: "Interactive top-down stage. Drag camera setups across the axis to test eyeline matching and screen direction.", accent: "info", category: "screen-grammar", glyph: "eye", departments: ["directing", "script-continuity", "cinematography"] },
  { slug: "directing-blocking", title: "Scene Blocking & Coverage Planner", kicker: "PLANNER", description: "Stage actors A & B in a location room, test movement motivations, and verify dialogue coverage setups.", accent: "info", category: "directing-craft", glyph: "directing", departments: ["directing", "assistant-directing"] },

  // Lighting & Grip
  { slug: "lighting-studio", title: "Lighting Studio Floor Plan Builder", kicker: "FLOOR PLAN", description: "Interactive studio floor plan. Rig key, fill, rim lights, solid flags, and bounce panels around speaking talent.", accent: "amber", category: "lighting-grip-craft", glyph: "zap", departments: ["lighting-grip", "cinematography"] },
  { slug: "lighting-power", title: "Amperage & Circuit Safety Calc", kicker: "CALCULATOR", description: "Calculate electrical wattage loads against 15A and 20A set breakers to prevent blown circuits or voltage drop.", accent: "amber", category: "power-rigging", glyph: "gauge", departments: ["lighting-grip", "production"] },

  // Sound
  { slug: "audio", title: "Audio Gain Meter & Staging", kicker: "SIMULATOR", description: "Stage transmitter, receiver and camera gain and watch for noise, the sweet spot and clipping.", accent: "info", category: "audio", glyph: "audio", departments: ["sound", "editing-post"] },
  { slug: "sound-rigging", title: "Boom & Lavalier Placement Visualizer", kicker: "GUIDE", description: "Compare overhead boom angles vs hidden chest lavalier rigging for interior dialogue and noisy exteriors.", accent: "ok", category: "sound-craft", glyph: "mic", departments: ["sound"] },
  { slug: "sound-gain", title: "Wireless Trim & Timecode Sync", kicker: "CALCULATOR", description: "Simulate dual-system gain staging from wireless transmitter packs to field recorder preamps and timecode rate.", accent: "ok", category: "audio-staging", glyph: "radio", departments: ["sound", "editing-post"] },

  // Assistant Directing
  { slug: "ad-schedule", title: "Shooting Schedule & Page Calculator", kicker: "ESTIMATOR", description: "Calculate estimated shoot hours and day-out-of-days cast requirements based on script page eighths and setup complexity.", accent: "rec", category: "ad-craft", glyph: "clock", departments: ["assistant-directing", "production"] },

  // Production
  { slug: "prod-budget", title: "Production Budget Allocator", kicker: "CALCULATOR", description: "Interactive Above-the-Line vs Below-the-Line expenditure estimator with mandatory insurance and contingency buffers.", accent: "info", category: "production-craft", glyph: "briefcase", departments: ["production", "assistant-directing"] },

  // Production Design
  { slug: "art-palette", title: "5-Color Scene Palette Builder", kicker: "BUILDER", description: "Build harmonic 5-color set dressing and wardrobe palettes with hex codes, mood tags, and lighting gel contrast.", accent: "amber", category: "art-craft", glyph: "palette", departments: ["production-design", "directing"] },

  // Script and Continuity
  { slug: "script-logger", title: "Interactive Take Logger & Slate Sheet", kicker: "TAKE SHEET", description: "Log camera slates, take durations, audio notes, and mark director approved Circle Takes for instant editor handover.", accent: "info", category: "continuity-craft", glyph: "file-text", departments: ["script-continuity", "directing", "editing-post"] },

  // Editing and Post
  { slug: "post-storage", title: "Data Rate, Storage & Proxy Calculator", kicker: "CALCULATOR", description: "Calculate required hard drive storage in GB/TB based on camera resolution, codec, framerate, and shooting hours.", accent: "flare", category: "post-craft", glyph: "hard-drive", departments: ["editing-post", "cinematography", "production"] },
];

export function findTool(slug: string) {
  return tools.find((t) => t.slug === slug);
}

export function canAccessTool(tool: ToolDef, deptId: string): boolean {
  return isDepartmentVisible(tool.departments, deptId);
}

export function getToolsByDepartment(deptId: string): ToolDef[] {
  return tools.filter((tool) => canAccessTool(tool, deptId));
}
