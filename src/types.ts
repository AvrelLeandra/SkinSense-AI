export interface SkinLesionResult {
  lesionType: string;
  confidence: number;
  riskClass: 'Low' | 'Moderate' | 'High';
  urgency: 'None' | 'Routine' | 'Immediate';
  distribution: { name: string; value: number }[];
  explanation: string;
  gradCamCoordinates: {
    x: number; // percentage from left (0-100)
    y: number; // percentage from top (0-100)
    radius: number; // percentage of width (0-100)
    intensity: number; // 0 to 1
  };
  symptomsChecked?: {
    pain: string;
    bleeding: string;
    itching: string;
    growth: string;
    colorChange: string;
    duration: string;
  };
}

export interface FacialAnalysisResult {
  skinType: 'Dry' | 'Oily' | 'Combination' | 'Normal' | 'Sensitive';
  overallScore: number;
  scores: {
    acne: number;
    pigmentation: number;
    redness: number;
    wrinkles: number;
    pores: number;
    oiliness: number;
    hydration: number;
    sensitivity: number;
  };
  concerns: string[];
  opportunities: string[];
}

export interface SkincareProduct {
  name: string;
  brand: string;
  category: string;
  priceCategory: 'Budget' | 'Mid-Range' | 'Premium';
  priceRange: string;
  ingredients: string[];
  instructions: string;
  timeOfDay: 'Morning' | 'Night' | 'Both';
  expectedResults: string;
  precautions: string;
}

export interface SkincareRoutine {
  morning: {
    step: number;
    title: string;
    productName: string;
    instructions: string;
  }[];
  night: {
    step: number;
    title: string;
    productName: string;
    instructions: string;
  }[];
  weekly: string[];
  seasonalTips: string;
}

export interface IngredientInfo {
  name: string;
  mechanism: string;
  benefits: string[];
  sideEffects: string[];
  frequency: string;
  bestSkinTypes: string[];
  compatibleWith: string[];
  avoidWith: string[];
  evidence: string;
  myth: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  skinScore: number;
  photoUrl?: string;
  waterIntake: number; // liters
  sleepHours: number;
  stressLevel: number; // 1-10
  routineAdhered: boolean;
  notes: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
