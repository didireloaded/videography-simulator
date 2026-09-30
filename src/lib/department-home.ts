import type { IconName } from "@/components/Icon";
import type { Scenario } from "@/lib/guides";

export type DeptQuickAction = {
  label: string;
  href: string;
  icon: IconName;
  primary?: boolean;
};

export type DeptChecklist = {
  title: string;
  items: string[];
};

export type DeptHomeConfig = {
  quickActions: DeptQuickAction[];
  scenarios: Scenario[];
  checklist: DeptChecklist;
};

export const DEPARTMENT_HOME_CONFIGS: Record<string, DeptHomeConfig> = {
  cinematography: {
    quickActions: [
      { label: "Open Exposure & Depth Test", href: "/tools/exposure", icon: "sun", primary: true },
      { label: "Movement & Blocking Simulator", href: "/tools/movement", icon: "move" },
    ],
    checklist: {
      title: "Morning Camera Department Checklist",
      items: [
        "Verify sensor glass cleanliness and check flange focal distance.",
        "Perform morning black balance and camera sensor calibration.",
        "Check wireless video transmitters and focus puller monitor range.",
        "Confirm DIT has formatted and verified checksum cards from previous roll.",
        "Set standard timecode jam from Sound Department master clock.",
      ],
    },
    scenarios: [
      {
        id: "cine-interview",
        title: "2-Camera Corporate Dialogue Setup",
        icon: "video",
        intro: "Match A and B camera color temperatures and establish a flattering 3-point lighting wrap.",
        startingPoint: [
          { label: "A-Cam Framing", value: "Medium Close-Up (85mm T2.8)" },
          { label: "B-Cam Framing", value: "Profile Two-Shot (50mm T4.0)" },
          { label: "White Balance", value: "5600K matched to diffused HMI key" },
          { label: "ISO / EI", value: "Base native ISO (800) for clean shadows" },
        ],
        tips: [
          "Place B-cam within 30° of A-cam eyeline to prevent jarring perspective shifts.",
          "Use a solid 4x4 negative fill flag on the shadow side to maintain sculpting.",
          "Keep shutter angle locked at 180° (1/50s at 25fps) for natural lip sync.",
        ],
        tools: [
          { label: "Exposure Test", href: "/tools/exposure" },
          { label: "Shot Sizes Guide", href: "/tools/shot-sizes" },
        ],
      },
      {
        id: "cine-lowlight",
        title: "Subway Night Exterior Pursuit",
        icon: "moon",
        intro: "Protect shadow noise floor while leveraging practical street lamps and fluorescent overheads.",
        startingPoint: [
          { label: "Lens Package", value: "High-speed T1.4 Primes" },
          { label: "Sensor Mode", value: "Dual Native ISO (High tier 3200)" },
          { label: "Shutter Angle", value: "172.8° to avoid HMI/LED flicker" },
          { label: "Color Gamut", value: "Log C / S-Log3 for highlight latitude" },
        ],
        tips: [
          "Expose slightly to the right (+0.5 EV) to bury sensor noise in shadows.",
          "Check street lamp frequencies at high ISO before rolling.",
        ],
        tools: [
          { label: "Exposure Test", href: "/tools/exposure" },
          { label: "Shutter Calculator", href: "/tools/shutter" },
        ],
      },
    ],
  },
  directing: {
    quickActions: [
      { label: "Staging & Blocking Planner", href: "/tools/directing-blocking", icon: "directing", primary: true },
      { label: "180° Eyeline Visualizer", href: "/tools/directing-180", icon: "eye" },
    ],
    checklist: {
      title: "Director's Morning Setup & Blocking Checklist",
      items: [
        "Walk the physical location with actors before locking camera marks.",
        "Confirm emotional objective verbs for each character's scene entrance.",
        "Verify with 1st AD that mandatory master coverage is scheduled before company move.",
        "Check eyeline height and screen direction with Script Supervisor.",
        "Review storyboard frames and shot list priority with DP during lighting block.",
      ],
    },
    scenarios: [
      {
        id: "dir-confrontation",
        title: "High-Tension Dialogue Confrontation",
        icon: "clapperboard",
        intro: "Maximize emotional friction by moving from loose conversational framing into tight, compressed singles.",
        startingPoint: [
          { label: "Staging Plan", value: "Table Confrontation (Opposed seating)" },
          { label: "Camera Coverage", value: "Wide Master -> 85mm OTS Reverses -> ECU Singles" },
          { label: "Screen Direction", value: "Maintain strict 180° axis along dining table" },
          { label: "Pacing Note", value: "Hold master on initial silence; cut on character realization beat" },
        ],
        tips: [
          "Do not cut to close-ups too early in the scene; earn the emotional push-in.",
          "Ensure actor gaze direction leads into negative looking room.",
        ],
        tools: [
          { label: "Blocking Planner", href: "/tools/directing-blocking" },
          { label: "180° Axis Visualizer", href: "/tools/directing-180" },
        ],
      },
      {
        id: "dir-oner",
        title: "Continuous Tracking 'Oner' Sequence",
        icon: "move",
        intro: "Choreograph actor movement to reveal background story elements without cutting.",
        startingPoint: [
          { label: "Camera Support", value: "3-Axis Gimbal or Steadicam with spotter" },
          { label: "Actor Motivation", value: "Crossing room to retrieve hidden briefcase" },
          { label: "Focus Strategy", value: "Wireless follow focus with pre-marked floor tape" },
        ],
        tips: [
          "Rehearse camera operator footwork at half-speed before bringing in actors.",
          "Build natural pauses (actor tying shoe or opening door) to allow camera reframing.",
        ],
        tools: [
          { label: "Blocking Planner", href: "/tools/directing-blocking" },
          { label: "Camera Movement Sim", href: "/tools/movement" },
        ],
      },
    ],
  },
  "lighting-grip": {
    quickActions: [
      { label: "Studio Floor Plan Builder", href: "/tools/lighting-studio", icon: "zap", primary: true },
      { label: "Circuit Amperage Calculator", href: "/tools/lighting-power", icon: "gauge" },
    ],
    checklist: {
      title: "Grip & Electric Set Safety Checklist",
      items: [
        "Sandbag all C-stand legs (heavy bag on tallest leg pointing toward load).",
        "Place rubber cable crossovers / yellow jackets over all high-traffic stingers.",
        "Check generator grounding and balance amperage draw across distribution legs.",
        "Secure safety cables on every overhead grid or truss mounted fixture.",
        "Confirm Stingers are never plugged into shared 15A wall breakers exceeding 80% load.",
      ],
    },
    scenarios: [
      {
        id: "grip-noir",
        title: "Dramatic 8:1 Low-Key Noir Setup",
        icon: "lightbulb",
        intro: "Sculpt sharp facial contrast using controlled hard side-key and heavy negative fill.",
        startingPoint: [
          { label: "Key Light", value: "Focused LED Fresnel at 90° side angle" },
          { label: "Fill Ratio", value: "8:1 (Fill 3 stops darker than Key)" },
          { label: "Shadow Control", value: "4x4 Solid Black Flag rigger on fill side" },
          { label: "Rim Separation", value: "Backlight raking shoulder from 45° behind" },
        ],
        tips: [
          "Kill all overhead ambient fluorescent room lights before setting key.",
          "Use barn doors and black foil (Blackwrap) to prevent lens flare.",
        ],
        tools: [
          { label: "Lighting Floor Plan", href: "/tools/lighting-studio" },
          { label: "Amperage Calc", href: "/tools/lighting-power" },
        ],
      },
      {
        id: "grip-exterior",
        title: "Day Exterior Sun Control & Bounce",
        icon: "sun",
        intro: "Tame harsh midday overhead sun using large overhead rags and ultra-bounce fill.",
        startingPoint: [
          { label: "Overhead Rag", value: "12x12 Silent Frost or 1/2 Grid Cloth on combo stands" },
          { label: "Eye Fill", value: "4x4 Beadboard or Unbleached Muslin bounce below lens" },
          { label: "Wind Safety", value: "4x Sandbags per Combo stand + guy lines if windy" },
        ],
        tips: [
          "Always assign a dedicated grip to hold guy lines when wind exceeds 10 mph.",
          "Angle bounce cards to catch natural sunlight without blinding talent.",
        ],
        tools: [
          { label: "Lighting Floor Plan", href: "/tools/lighting-studio" },
        ],
      },
    ],
  },
  sound: {
    quickActions: [
      { label: "Wireless Gain Staging Sim", href: "/tools/sound-gain", icon: "radio", primary: true },
      { label: "Boom & Lav Placement Guide", href: "/tools/sound-rigging", icon: "mic" },
    ],
    checklist: {
      title: "Location Audio Rigging & Sync Checklist",
      items: [
        "Scan wireless RF spectrum and lock clean transmitter/receiver frequencies.",
        "Perform vocal scratch test at peak actor volume; verify transmitter meter stays under 0 dB.",
        "Check lavalier clothing friction; apply moleskin or Rycote overcovers if synthetic fabric rustles.",
        "Confirm 10 dB attenuation safety track is recording on receiver Channel 2.",
        "Jam sync timecode boxes on camera body and smart slate before first roll.",
      ],
    },
    scenarios: [
      {
        id: "snd-dialogue",
        title: "Multi-Actor Acoustic Dialogue Capture",
        icon: "mic",
        intro: "Achieve rich vocal resonance while eliminating acoustic room comb filtering.",
        startingPoint: [
          { label: "Primary Track", value: "Overhead Boom (Sennheiser MKH416 / Schoeps)" },
          { label: "Isolated Tracks", value: "Dual Sanken COS-11D Lavs hidden in collar/tie" },
          { label: "Preamp Trim", value: "Peak normal dialogue at -12 dBFS (Safety at -22 dBFS)" },
          { label: "Acoustic Rule", value: "Maintain 3-to-1 distance ratio between active capsules" },
        ],
        tips: [
          "Aim boom capsule toward actor's sternum/mouth from 45° overhead, not top of skull.",
          "Record 60 seconds of location room tone before company wrap.",
        ],
        tools: [
          { label: "Boom & Lav Guide", href: "/tools/sound-rigging" },
          { label: "Gain Staging Sim", href: "/tools/sound-gain" },
        ],
      },
    ],
  },
  "assistant-directing": {
    quickActions: [
      { label: "Schedule & Page Estimator", href: "/tools/ad-schedule", icon: "clock", primary: true },
      { label: "Open Project Call Sheets", href: "/projects", icon: "list-checks" },
    ],
    checklist: {
      title: "1st AD Set Operations & Safety Checklist",
      items: [
        "Conduct morning crew safety briefing (fire exits, track rules, first aid location).",
        "Confirm first unit rolling target time with DP and Director during rehearsal block.",
        "Monitor actor makeup/wardrobe turnaround times against DOOD schedule.",
        "Enforce strict 6-hour meal turnaround penalties and announce lunch 30 mins prior.",
        "Publish tomorrow's preliminary call sheet to HODs before location wrap.",
      ],
    },
    scenarios: [
      {
        id: "ad-company-move",
        title: "Multi-Location Company Move Day",
        icon: "clock",
        intro: "Execute a seamless mid-day location relocation without hemorrhaging shooting hours.",
        startingPoint: [
          { label: "Schedule Buffer", value: "Budget exactly 1.5 hours for physical wrap and transport" },
          { label: "Scene Budget", value: "3.5 pages total (2.0 pages Loc A, 1.5 pages Loc B)" },
          { label: "Logistics Priority", value: "Pre-rig Location B lighting package with advance rigging crew" },
        ],
        tips: [
          "Send 2nd AD to Location B an hour early to verify parking cones and power access.",
          "Never schedule complex night stunts on the same day as a company move.",
        ],
        tools: [
          { label: "Schedule Estimator", href: "/tools/ad-schedule" },
        ],
      },
    ],
  },
  production: {
    quickActions: [
      { label: "Above/Below Budget Allocator", href: "/tools/prod-budget", icon: "briefcase", primary: true },
      { label: "Open Production Binders", href: "/projects", icon: "folder" },
    ],
    checklist: {
      title: "Production Manager Governance Checklist",
      items: [
        "Verify signed Location Agreements and Certificates of Insurance (COI) before crew call.",
        "Check that all talent and background extras have signed liability release forms.",
        "Confirm catering and craft service headcount matching daily call sheet distribution.",
        "Review daily overtime logs and payroll fringe tax allocations.",
        "Maintain mandatory 10% emergency contingency reserve untouched in production account.",
      ],
    },
    scenarios: [
      {
        id: "prod-indie",
        title: "$75k Commercial Budget Allocation",
        icon: "briefcase",
        intro: "Balance high-end camera package rentals against mandatory crew payroll and location fees.",
        startingPoint: [
          { label: "Above-The-Line", value: "$22,500 (30% - Director, Producer, Talent)" },
          { label: "Below-The-Line", value: "$41,250 (55% - Crew Payroll, Gear, Locations)" },
          { label: "Post-Production", value: "$11,250 (15% - Edit, Color, Sound Mix)" },
          { label: "Contingency Bond", value: "$7,500 (Mandatory 10% cash reserve)" },
        ],
        tips: [
          "Never cut location insurance or workers' compensation to afford camera lenses.",
          "Negotiate weekly flat rates for grip packages instead of daily billing.",
        ],
        tools: [
          { label: "Budget Allocator", href: "/tools/prod-budget" },
        ],
      },
    ],
  },
  "production-design": {
    quickActions: [
      { label: "5-Color Palette Builder", href: "/tools/art-palette", icon: "palette", primary: true },
      { label: "Open Art Dept Project Notes", href: "/projects", icon: "folder" },
    ],
    checklist: {
      title: "Art Department & Set Dressing Checklist",
      items: [
        "Verify 60-30-10 harmonic color ratios against DP's intended lighting gel temperatures.",
        "Confirm 3x to 5x duplicate multiples for all consumable or breakaway hero props.",
        "Check character wardrobe contrast against set wall background colors.",
        "Photograph set dressing placement before rolling for Script Supervisor continuity matching.",
        "Secure clear protective runners over location flooring during crew equipment load-in.",
      ],
    },
    scenarios: [
      {
        id: "art-subway",
        title: "Gritty Subway Noir Set Dressing",
        icon: "palette",
        intro: "Establish urban tension using cool steel blues contrasted against warm sodium hero props.",
        startingPoint: [
          { label: "Dominant Wall (60%)", value: "#2b3b4c Steel Blue / Gritty Tile" },
          { label: "Secondary Trim (30%)", value: "#8a969e Chrome & Wet Asphalt Neutral" },
          { label: "Hero Prop Accent (10%)", value: "#df9834 Sodium Vapor & Leather Briefcase" },
        ],
        tips: [
          "Test fabric swatches under camera lighting during prep; LED CRI can shift pigment hues.",
          "Age new leather or brass props with Fuller's earth and dulling spray before shooting.",
        ],
        tools: [
          { label: "Palette Builder", href: "/tools/art-palette" },
        ],
      },
    ],
  },
  "script-continuity": {
    quickActions: [
      { label: "Interactive Take Logger", href: "/tools/script-logger", icon: "file-text", primary: true },
      { label: "180° Screen Direction Axis", href: "/tools/directing-180", icon: "eye" },
    ],
    checklist: {
      title: "Script Supervisor Set Continuity Checklist",
      items: [
        "Record exact stopwatch duration and timecode sync for every slated camera roll.",
        "Log actor dialogue ad-libs, line flubs, or intentional script deviations.",
        "Verify actor eyeline direction and screen-left/screen-right continuity across reverses.",
        "Confirm directly with Director after each take whether to circle take for editor assembly.",
        "Deliver signed daily continuity logs and lined script pages to DIT at wrap.",
      ],
    },
    scenarios: [
      {
        id: "script-table",
        title: "Multi-Take Dialogue Continuity Logging",
        icon: "file-text",
        intro: "Track prop hand placements and drinking glass levels across 4 overlapping camera setups.",
        startingPoint: [
          { label: "Eyeline Tracking", value: "Actor A looks Screen-Right; Actor B looks Screen-Left" },
          { label: "Prop Action Mark", value: "Briefcase unlatched on line 3 (must match close-up)" },
          { label: "Circle Take Log", value: "Slate 14A, Take 3 marked as Director's Print choice" },
        ],
        tips: [
          "Take instant timestamped photos of talent wardrobe wrinkles at the head of every setup.",
          "Note boom mic shadows or audio dips on your log to warn the assistant editor.",
        ],
        tools: [
          { label: "Take Logger", href: "/tools/script-logger" },
          { label: "180° Visualizer", href: "/tools/directing-180" },
        ],
      },
    ],
  },
  "editing-post": {
    quickActions: [
      { label: "Storage & Proxy Calculator", href: "/tools/post-storage", icon: "hard-drive", primary: true },
      { label: "Audio Gain & Preamp Review", href: "/tools/sound-gain", icon: "radio" },
    ],
    checklist: {
      title: "Assistant Editor & DIT Ingest Checklist",
      items: [
        "Verify 3-2-1 backup protocol: 3 total copies across 2 media types with 1 offsite RAID.",
        "Generate 1080p ProRes 422 Proxy files with identical timecode and filenames as RAW.",
        "Check Script Supervisor circled takes and assemble initial sequence selects.",
        "Apply standard J-cut and L-cut dialogue split edits to soften speaker transitions.",
        "Confirm audio delivery specs: dialogue dialogue dialogue stems peaked at -12 dBFS.",
      ],
    },
    scenarios: [
      {
        id: "post-workflow",
        title: "4K Cinema RAW Ingest & Proxy Assembly",
        icon: "hard-drive",
        intro: "Establish fluid offline editing on standard laptops without losing RAW color relinking.",
        startingPoint: [
          { label: "Ingest Storage", value: "15.0 GB/min (Uncompressed 4K RAW) -> 13.5 TB Total" },
          { label: "Proxy Format", value: "ProRes 422 Proxy @ 1080p (0.8 GB/min)" },
          { label: "Timeline Pacing", value: "Advance incoming speaker audio 12 frames before video cut (J-Cut)" },
        ],
        tips: [
          "Never rename proxy clips or strip camera metadata during transcode.",
          "Keep dialogue, sound effects, and music on strictly segregated timeline tracks.",
        ],
        tools: [
          { label: "Storage Calc", href: "/tools/post-storage" },
        ],
      },
    ],
  },
};

export function getDeptHomeConfig(deptId: string): DeptHomeConfig {
  return DEPARTMENT_HOME_CONFIGS[deptId] ?? DEPARTMENT_HOME_CONFIGS["cinematography"];
}
