export type CoverageType = 'Emergency SOS' | 'Contract' | 'Part-Time' | 'Full-Time';

export type UserRole = 'dealership' | 'technician';

// Review submitted by a dealership service manager about a technician
export interface TechReview {
  id: string;
  technicianId: string;
  reviewerName: string;
  reviewerRole: string;
  dealershipName: string;
  location: string;
  rating: number; // 1-5
  date: string;
  title: string;
  comment: string;
  verifiedRepairOrder: string;
  efficiencyObserved: number; // e.g. 145%
  recommended: boolean;
}

// Review submitted by a technician about a dealership's shop conditions & pay honesty
export interface DealerReview {
  id: string;
  dealershipName: string;
  brand: string;
  location: string;
  technicianId: string;
  technicianName: string;
  technicianTitle: string;
  rating: number; // 1-5
  date: string;
  title: string;
  comment: string;
  // Specific shop criteria ratings
  equipmentQualityRating: number; // 1-5 (air compressors, lifts, OEM scanners)
  partsDepartmentSpeedRating: number; // 1-5 (no waiting at counter for parts)
  dispatchFairnessRating: number; // 1-5 (honest ticket distribution, no advisor favoritism)
  payGuaranteeHonestyRating: number; // 1-5 (prompt payment on flat-rate guarantee)
  shopEnvironmentRating: number; // 1-5 (cleanliness, heat/AC, safety)
  recommended: boolean;
}

export interface DayShiftOpening {
  date: string; // ISO date string or YYYY-MM-DD
  dayOfWeek: string; // e.g. Mon, Tue, Wed, Thu, Fri, Sat, Sun
  displayDate: string; // e.g. Sep 29
  isOpen: boolean; // whether technician has opened this shift for coverage
  shiftType: 'Full Day (8h)' | 'Morning Rush (4h)' | 'Evening Fleet (4h)';
  bayAssigned?: string;
}

export interface Technician {
  id: string;
  name: string;
  avatar: string;
  title: string;
  experienceYears: number;
  location: string;
  distanceMiles?: number;
  brands: string[];
  aseLevel: string;
  certifications: string[];
  hourlyRate: number;
  flatRateGuarantee: number;
  efficiencyRate: number; // e.g. 135%
  rating: number;
  reviewCount: number;
  completedJobs: number;
  toolValueEstimate: string;
  toolBrands: string[];
  availability: 'Immediate SOS' | 'This Week' | 'Booked (2 Wks)';
  weeklySchedule?: DayShiftOpening[];
  phone: string;
  email: string;
  bio: string;
  verifiedBadges: string[];
  backgroundCheckPassed: boolean;
  drugScreenPassed: boolean;
  motorVehicleRecordClear?: boolean;
  toolInsuranceVerified?: boolean;
  mvrStatus?: string;
  drugTestType?: string;
  toolInsurancePolicyLimit?: string;
  reviews?: TechReview[];
}

export interface DealershipJob {
  id: string;
  dealershipName: string;
  logoLetter: string;
  location: string;
  brand: string;
  title: string;
  coverageType: CoverageType;
  duration: string;
  payRate: string;
  flatRateBonus: string;
  bayStatus: string;
  urgent: boolean;
  requiredCerts: string[];
  postedDate: string;
  openings: number;
  description: string;
  perks: string[];
}

export interface DispatchTicket {
  id: string;
  dealershipName: string;
  bayNumber: number;
  technicianId: string;
  technicianName: string;
  vehicleModel: string;
  roNumber: string;
  status: 'Dispatched' | 'Clocked In' | 'Diagnostics' | 'Parts Pending' | 'Quality Check' | 'Completed';
  flatRateHoursBilled: number;
  actualClockHours: number;
  startedAt: string;
  serviceAdvisor: string;
}

export interface DiagnosticScenario {
  id: string;
  title: string;
  vehicleInfo: string;
  symptom: string;
  dtcCodes: string[];
  freezeFrameData: Record<string, string>;
  difficulty: 'Intermediate' | 'Advanced Master' | 'High-Voltage EV';
  suggestedTools: string[];
  solutionExplanation: string;
}
