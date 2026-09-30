"use client";

import {
  Aperture,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Crosshair,
  Download,
  Eye,
  Film,
  Focus,
  FolderOpen,
  Frame,
  Grid,
  Gauge,
  HelpCircle,
  Home,
  Info as InfoIcon,
  Lightbulb,
  ListChecks,
  LoaderCircle,
  LucideProps,
  Mic,
  Moon,
  Move,
  Music,
  Package,
  Printer,
  Settings2,
  SlidersHorizontal,
  Sun,
  Thermometer,
  Video,
  Volume2,
  Wrench,
  X,
  AlertTriangle,
  Clapperboard,
  Briefcase,
  Palette,
  FileText,
  Scissors,
  Headphones,
  Clock,
  Calendar,
  Users,
  CheckSquare,
  Monitor,
  HardDrive,
  Layers,
  Share2,
  UserPlus,
  Plus,
  Trash2,
  Edit3,
  Save,
  FolderPlus,
  FileCode,
  Sparkles,
  ShieldCheck,
  FileCheck,
  Truck,
  Coffee,
  FileSpreadsheet,
  Layers3,
  Zap,
  Radio,
  FileWarning,
  ListTodo,
  FolderKanban,
  LayoutDashboard,
  UserCheck,
  ListOrdered,
} from "lucide-react";

export type IconName =
  | "home"
  | "learn"
  | "tools"
  | "builder"
  | "projects"
  | "saved"
  | "camera"
  | "aperture"
  | "sun"
  | "exposure"
  | "focus"
  | "lens"
  | "move"
  | "movement"
  | "choose-movement"
  | "lightbulb"
  | "lighting"
  | "mic"
  | "interview"
  | "list-checks"
  | "book-open"
  | "bookmark"
  | "bookmark-check"
  | "download"
  | "settings"
  | "sliders"
  | "moon"
  | "low-light"
  | "slowmo"
  | "gauge"
  | "package"
  | "product"
  | "music"
  | "music-video"
  | "talking-head"
  | "video"
  | "wrench"
  | "exposure-fix"
  | "film"
  | "shutter"
  | "thermometer"
  | "white-balance"
  | "grid"
  | "composition"
  | "shot-sizes"
  | "frame"
  | "compass"
  | "angles"
  | "audio"
  | "volume"
  | "check"
  | "close"
  | "x"
  | "chevron-up"
  | "chevron-down"
  | "arrow-right"
  | "arrow-left"
  | "printer"
  | "print"
  | "alert"
  | "info"
  | "folder"
  | "eye"
  | "crosshair"
  | "loader"
  | "help"
  | "clapperboard"
  | "directing"
  | "briefcase"
  | "production"
  | "palette"
  | "production-design"
  | "file-text"
  | "script-continuity"
  | "scissors"
  | "editing-post"
  | "headphones"
  | "sound"
  | "clock"
  | "assistant-directing"
  | "calendar"
  | "users"
  | "check-square"
  | "monitor"
  | "hard-drive"
  | "layers"
  | "share2"
  | "user-plus"
  | "plus"
  | "trash2"
  | "edit3"
  | "save"
  | "folder-plus"
  | "file-code"
  | "sparkles"
  | "shield-check"
  | "file-check"
  | "truck"
  | "coffee"
  | "file-spreadsheet"
  | "layers3"
  | "zap"
  | "lighting-grip"
  | "radio"
  | "file-warning"
  | "list-todo"
  | "folder-kanban"
  | "layout-dashboard"
  | "user-check"
  | "list-ordered";

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.75,
  className = "",
  ...props
}: { name: IconName } & LucideProps) {
  const common = { size, strokeWidth, className, ...props };

  switch (name) {
    case "home":
      return <Home {...common} />;
    case "learn":
    case "book-open":
      return <BookOpen {...common} />;
    case "tools":
    case "sliders":
      return <SlidersHorizontal {...common} />;
    case "builder":
    case "list-checks":
      return <ListChecks {...common} />;
    case "saved":
    case "bookmark":
      return <Bookmark {...common} />;
    case "bookmark-check":
      return <BookmarkCheck {...common} />;
    case "camera":
      return <Camera {...common} />;
    case "aperture":
      return <Aperture {...common} />;
    case "sun":
    case "exposure":
      return <Sun {...common} />;
    case "focus":
    case "lens":
      return <Focus {...common} />;
    case "move":
    case "movement":
    case "choose-movement":
      return <Move {...common} />;
    case "lightbulb":
    case "lighting":
      return <Lightbulb {...common} />;
    case "mic":
    case "interview":
      return <Mic {...common} />;
    case "moon":
    case "low-light":
      return <Moon {...common} />;
    case "slowmo":
    case "gauge":
      return <Gauge {...common} />;
    case "package":
    case "product":
      return <Package {...common} />;
    case "music":
    case "music-video":
      return <Music {...common} />;
    case "talking-head":
    case "video":
      return <Video {...common} />;
    case "wrench":
    case "exposure-fix":
      return <Wrench {...common} />;
    case "film":
    case "shutter":
      return <Film {...common} />;
    case "thermometer":
    case "white-balance":
      return <Thermometer {...common} />;
    case "grid":
    case "composition":
      return <Grid {...common} />;
    case "shot-sizes":
    case "frame":
      return <Frame {...common} />;
    case "compass":
    case "angles":
      return <Compass {...common} />;
    case "audio":
    case "volume":
      return <Volume2 {...common} />;
    case "check":
      return <Check {...common} />;
    case "close":
    case "x":
      return <X {...common} />;
    case "chevron-up":
      return <ChevronUp {...common} />;
    case "chevron-down":
      return <ChevronDown {...common} />;
    case "arrow-right":
      return <ArrowRight {...common} />;
    case "arrow-left":
      return <ArrowLeft {...common} />;
    case "printer":
    case "print":
      return <Printer {...common} />;
    case "alert":
      return <AlertTriangle {...common} />;
    case "info":
      return <InfoIcon {...common} />;
    case "folder":
      return <FolderOpen {...common} />;
    case "eye":
      return <Eye {...common} />;
    case "crosshair":
      return <Crosshair {...common} />;
    case "download":
      return <Download {...common} />;
    case "settings":
      return <Settings2 {...common} />;
    case "loader":
      return <LoaderCircle {...common} />;
    case "help":
      return <HelpCircle {...common} />;
    case "projects":
    case "folder-kanban":
      return <FolderKanban {...common} />;
    case "clapperboard":
    case "directing":
      return <Clapperboard {...common} />;
    case "briefcase":
    case "production":
      return <Briefcase {...common} />;
    case "palette":
    case "production-design":
      return <Palette {...common} />;
    case "file-text":
    case "script-continuity":
      return <FileText {...common} />;
    case "scissors":
    case "editing-post":
      return <Scissors {...common} />;
    case "headphones":
    case "sound":
      return <Headphones {...common} />;
    case "clock":
    case "assistant-directing":
      return <Clock {...common} />;
    case "calendar":
      return <Calendar {...common} />;
    case "users":
      return <Users {...common} />;
    case "check-square":
    case "list-todo":
      return <ListTodo {...common} />;
    case "monitor":
      return <Monitor {...common} />;
    case "hard-drive":
      return <HardDrive {...common} />;
    case "layers":
    case "layers3":
      return <Layers {...common} />;
    case "share2":
      return <Share2 {...common} />;
    case "user-plus":
      return <UserPlus {...common} />;
    case "plus":
      return <Plus {...common} />;
    case "trash2":
      return <Trash2 {...common} />;
    case "edit3":
      return <Edit3 {...common} />;
    case "save":
      return <Save {...common} />;
    case "folder-plus":
      return <FolderPlus {...common} />;
    case "file-code":
      return <FileCode {...common} />;
    case "sparkles":
      return <Sparkles {...common} />;
    case "shield-check":
      return <ShieldCheck {...common} />;
    case "file-check":
      return <FileCheck {...common} />;
    case "truck":
      return <Truck {...common} />;
    case "coffee":
      return <Coffee {...common} />;
    case "file-spreadsheet":
      return <FileSpreadsheet {...common} />;
    case "zap":
    case "lighting-grip":
      return <Zap {...common} />;
    case "radio":
      return <Radio {...common} />;
    case "file-warning":
      return <FileWarning {...common} />;
    case "layout-dashboard":
      return <LayoutDashboard {...common} />;
    case "user-check":
      return <UserCheck {...common} />;
    case "list-ordered":
      return <ListOrdered {...common} />;
    default: {
      const _exhaustive: never = name;
      return <HelpCircle {...common} aria-label={`Unknown icon ${_exhaustive}`} />;
    }
  }
}
