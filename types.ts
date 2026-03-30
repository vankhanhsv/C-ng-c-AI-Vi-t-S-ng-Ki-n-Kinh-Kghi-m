
export type AppStatus =
  | "INITIALIZING"
  | "SELECTING_LANGUAGE"
  | "GATHERING_INFO"
  | "GENERATING_TOPIC"
  | "GENERATING_OUTLINE"
  | "REVIEWING_OUTLINE"
  | "GENERATING_CONTENT"
  | "COMPLETED";

export type Language = "vi" | "en";
export type SectionStatus = "PENDING" | "GENERATING" | "COMPLETED";
export type WritingStyle = "heartfelt" | "factual" | "analytical" | "simple";

export interface UserInfo {
  name: string;
  school: string;
  phone: string;
  email: string;
  schoolYear: string;
}

export interface DetailedConfig {
  schoolType: string;
  schoolScale: string;
  facilities: string;
  difficulties: string;
  targetClass: string;
  studentCount: string;
  studentCharacteristics: string;
  problemStatus: string;
  mainSolutions: string;
  tools: string;
  timeRange: string;
  resultBefore: string;
  resultAfter: string;
  evidence: string;
  approvalLevel: string;
}

export interface OutlineNode {
  id: string;
  title: string;
  targetWordCount: number;
  actualWordCount: number;
  content: string;
  status: SectionStatus;
  userGuidance: string;
  children?: OutlineNode[];
}

export interface SKKNTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  outlineText: string;
}

export interface AppState {
  status: AppStatus;
  language: Language;
  userInfo: UserInfo;
  detailedConfig: DetailedConfig;
  topic: string;
  targetWordCount: number;
  customOutlineText: string;
  selectedTemplate: SKKNTemplate | null;
  outline: OutlineNode[];
  currentSectionId: string | null;
  progressIndex: number;
  errorMessage: string | null;
  writingStyle: WritingStyle;
  // Các thông tin bổ sung cho ngữ cảnh AI
  educationLevel: string;
  subject: string;
}

export interface GeneratedSolution {
  title: string;
}

export interface AIOutlineResponse {
  id: string;
  title: string;
  children?: AIOutlineResponse[];
}

export interface SKKNSuggestionInput {
  educationLevel: string;
  subject: string;
  strength: string;
  product: string;
  goal: string;
}

export interface SKKNSuggestion {
  id: string;
  title: string;
  description: string;
}
