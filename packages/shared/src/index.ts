export type Vector3Tuple = [number, number, number];

export type MovementInput = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
};

export type GameSettings = {
  movementSpeed: number;
  paused: boolean;
  showPhysics: boolean;
  resetToken: number;
  mode: GameMode;
  roomId?: string;
  destination?: { x: number; z: number };
  cameraView: 'firstPerson' | 'thirdPerson';
  themeMode: ThemeMode;
  themeChosen: boolean;
};

export type ThemeMode = 'light' | 'dark' | 'auto';

export type GameMode = 'explore' | 'enteringComputer' | 'computer' | 'arcade' | 'reading' | 'enteringReading' | 'readingOnSofa' | 'enteringTV' | 'watching' | 'gameNet';

export type RoomLife = { wateredLessons: string[]; keyCollected: boolean; greenhouseOpen: boolean; bookPages: Record<string, number> };

export type TestStep =
  | { type: 'text'; selector: string; text: string; exact?: boolean }
  | { type: 'nonempty-text'; selector: string }
  | { type: 'count'; selector: string; count: number }
  | { type: 'attribute'; selector: string; name: string; value: string }
  | { type: 'click'; selector: string; times?: number }
  | { type: 'render'; component: string; props?: Record<string, string | number | boolean>; callbackProp?: string }
  | { type: 'rerender'; component: string; props: Record<string, string | number | boolean> }
  | { type: 'callback'; count: number }
  | { type: 'input'; selector: string; value: string }
  | { type: 'check'; selector: string; checked: boolean }
  | { type: 'wait'; milliseconds: number }
  | { type: 'wait-text'; selector: string; text: string; timeout?: number }
  | { type: 'storage'; key: string; contains: string }
  | { type: 'remount' }
  | { type: 'clock'; milliseconds: number }
  | { type: 'timer-count'; count: number }
  | { type: 'unmount' }
  | { type: 'focus'; selector: string }
  | { type: 'effect-count'; index: number; max: number }
  | { type: 'student-test'; mutant: boolean };

export type ChallengeTest = {
  id: string;
  name: string;
  mandatory: boolean;
  steps: TestStep[];
  questionId?: string;
  source?: { component?: string; components?: string[]; hook?: string; forbidHooks?: string[]; function?: string; maxLines?: { name: string; count: number } };
};

export type Challenge = {
  id: string;
  title: string;
  topic: string;
  description: string;
  instructions: string[];
  starterFiles: Record<string, string>;
  tests: ChallengeTest[];
  hints: string[];
  xp: number;
  coins: number;
  prerequisites: string[];
  kind?: ChallengeKind;
  chapterId?: number;
  skills?: string[];
  tags?: string[];
  mastery?: boolean;
  questions?: KnowledgeQuestion[];
  concept?: Concept;
  solution?: string;
  project?: { id: string; step: number };
  difficulty?: number;
  minutes?: number;
};

export type TestResult = { id: string; name: string; passed: boolean; message?: string };
export type EvaluationResult = { passed: boolean; score: number; tests: TestResult[]; quality?: QualityScore[] };
export type CodeAnalysis = { components: string[]; hooks: string[]; functions?: Record<string, number>; tree?: ComponentEdge[]; warnings?: string[] };
export type CompiledCode = { code: string; safeSource: string; analysis: CodeAnalysis };

export type ChallengeKind = 'write' | 'debug' | 'predict' | 'read' | 'complete' | 'refactor' | 'feature' | 'boss';
export type KnowledgeQuestion = { id: string; prompt: string; code?: string; options: string[]; answer: number; explanation: string };
export type Concept = { title: string; paragraphs: string[]; example: string; visual: 'render' | 'props' | 'state' | 'effect' | 'redux' | 'query' | 'router'; reference: string };
export type TeachingStep = { id: string; title: string; paragraphs: string[]; code?: string; notes?: { code: string; text: string }[]; preview?: string };
export type TeachingLesson = { title: string; steps: TeachingStep[]; reference: string };
export type ComponentEdge = { parent: string; child: string; props: string[] };
export type QualityScore = { name: string; score: number | null; evidence: string };
export type RuntimeTrace = { kind: 'state' | 'render' | 'dom' | 'props' | 'effect' | 'request' | 'store' | 'query'; label: string; at: number; detail?: string };
export type SkillDefinition = { id: string; title: string; prerequisites: string[]; chapterId: number };
export type Chapter = { id: number; title: string; description: string; roomId: string; skills: string[]; prerequisites: string[]; concept: Concept };
export type KnowledgeRoom = { id: string; title: string; subtitle: string; mastery: string[]; color: string; chapters: number[]; emblem: string };

export type InteractionObject = {
  id: string;
  position: Vector3Tuple;
  interactionRadius: number;
  label: string;
  onInteract: () => void;
};
