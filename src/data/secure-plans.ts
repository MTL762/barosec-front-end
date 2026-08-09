export type BillingPeriod = "annual" | "monthly";
export type CameraTier = "single" | "unlimited";

export type PlanId = "plus" | "premium" | "premiumRecording";

export type PlanPriceTier = {
  id: CameraTier;
  annual: number;
  monthly: number;
};

export type PlanDefinition = {
  id: PlanId;
  popular?: boolean;
  hasEmergency?: boolean;
  hasRecording?: boolean;
  tiers: PlanPriceTier[];
  coreFeatureKeys: string[];
  earlyWarningKeys: string[];
  emergencyKeys?: string[];
  recordingKeys?: string[];
};

export const plans: PlanDefinition[] = [
  {
    id: "plus",
    tiers: [
      { id: "single", annual: 7.99, monthly: 9.99 },
      { id: "unlimited", annual: 17.99, monthly: 19.99 },
    ],
    coreFeatureKeys: [
      "videoHistory",
      "activityZones",
      "priorityCare",
      "theftReplacement",
      "discounts",
    ],
    earlyWarningKeys: [
      "earlyWarning",
      "basicDetection",
      "personRecognition",
      "vehicleRecognition",
      "customDetection",
      "fireDetection",
      "audioDetection",
    ],
  },
  {
    id: "premium",
    popular: true,
    hasEmergency: true,
    tiers: [{ id: "unlimited", annual: 24.99, monthly: 29.99 }],
    coreFeatureKeys: [
      "videoHistory",
      "activityZones",
      "priorityCare",
      "theftReplacement",
      "discounts",
    ],
    earlyWarningKeys: [
      "earlyWarning",
      "basicDetection",
      "personRecognition",
      "vehicleRecognition",
      "customDetection",
      "fireDetection",
      "audioDetection",
      "eventCaptions",
      "videoSearch",
    ],
    emergencyKeys: [
      "emergencyResponse",
      "professionalMonitoring",
      "emergencyResponse247",
      "barosecSafe",
      "homeInsurance",
    ],
  },
  {
    id: "premiumRecording",
    hasEmergency: true,
    hasRecording: true,
    tiers: [{ id: "unlimited", annual: 39.99, monthly: 49.99 }],
    coreFeatureKeys: [
      "videoHistory",
      "activityZones",
      "priorityCare",
      "theftReplacement",
      "discounts",
    ],
    earlyWarningKeys: [
      "earlyWarning",
      "basicDetection",
      "personRecognition",
      "vehicleRecognition",
      "customDetection",
      "fireDetection",
      "audioDetection",
      "eventCaptions",
      "videoSearch",
    ],
    emergencyKeys: [
      "emergencyResponse",
      "professionalMonitoring",
      "emergencyResponse247",
      "barosecSafe",
      "homeInsurance",
    ],
    recordingKeys: ["continuousRecording"],
  },
];

export const featureDetailKeys = [
  "videoHistory",
  "activityZones",
  "priorityCare",
  "theftReplacement",
  "discounts",
  "smartMotion",
  "personRecognition",
  "vehicleRecognition",
  "customDetection",
  "fireDetection",
  "audioDetection",
  "eventCaptions",
  "videoSearch",
  "professionalMonitoring",
  "emergencyResponse247",
  "barosecSafe",
  "homeInsurance",
  "continuousRecording",
] as const;

export const benefitKeys = [
  "spotDanger",
  "storeShare",
  "emergency",
  "quickerAction",
  "personalized",
  "smartZones",
] as const;

export function formatPrice(amount: number): string {
  return amount.toFixed(2);
}
