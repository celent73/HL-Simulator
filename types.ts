
// src/types.ts

// --- HERBALIFE SPECIFIC TYPES ---

export type HerbalifeLevel = 'Member' | 'Senior Consultant' | 'Qualified Producer' | 'Supervisor' | 'World Team' | 'Active World Team' | 'GET' | 'GET 2.5' | 'Millionaire' | 'Millionaire 7.5' | 'President';

export interface DownlineMember {
  id: string;
  name: string;
  level: HerbalifeLevel;
  pv: number; // Volume Points
  children?: DownlineMember[]; // Recursive children for Network Visualizer
}

export interface HerbalifePlanInput {
  personalPV: number; // Punti Volume Personali
  retailTurnover: number; // Fatturato Retail Totale
  downline: DownlineMember[]; // Lista downline diretta
}

export interface HerbalifeResult {
  currentLevel: HerbalifeLevel;
  discountPercentage: number;
  retailProfit: number;
  wholesaleProfit: number; // Guadagno indiretto (Differenza sconto)
  royaltyEarnings: number; // Royalties (5% su supervisor)
  productionBonus: number; // Bonus Produzione (TAB Team 2-6%)
  totalEarnings: number;
  turnover: number; // Fatturato stimato (PV * 2)
  qualificationTime: string; // Tempo richiesto per la qualifica
  nextLevel?: HerbalifeLevel;
  pvToNextLevel?: number;
  potentialEarningsNextLevel?: number;
  nextLevelQualificationTime?: string; // Tempo richiesto per il prossimo livello
}

// --- LEGACY / SHARED TYPES (Kept for compatibility with existing components like Header/Legal) ---

export interface CashbackCategory {
  id: string;
  name: string;
  amount: number;
  brand: string;
  percentage: number;
  fixedAmount?: number;
  icon?: string;
  isExtra?: boolean;
}

export interface PlanInput {
  // Legacy fields might be needed if we reuse components that strictly require them, 
  // but we will try to phase them out. For now, valid for the "InputPanel" if we were to keep it.
  directRecruits: number;
  contractsPerUser: number;
  indirectRecruits: number;
  networkDepth: number;
  realizationTimeMonths: number;
  personalClientsGreen: number;
  personalClientsLight: number;
  personalClientsBusinessGreen: number;
  personalClientsBusinessLight: number;
  myPersonalUnitsGreen: number;
  myPersonalUnitsLight: number;
  cashbackSpending: number;
  cashbackPercentage: number;
  cashbackDetails?: any[];
  unionParkPanels?: number;
  unionParkPun?: number;
  unionParkDuration?: number;
  electricityPrice?: number;
  punValue?: number;
  electricityConsumption?: number;
  electricityFixed?: number;
  gasPrice?: number;
  psvValue?: number;
  gasConsumption?: number;
  gasFixed?: number;
  includeSpread?: boolean;
  isComparisonMode?: boolean;
  otherElecSpread?: number;
  otherGasSpread?: number;
  otherElecFixed?: number;
  otherGasFixed?: number;
  otherSupplierName?: string;
  includeEarningsInAnalysis?: boolean;
}

export interface CondoInput {
  greenUnits: number;
  lightUnits: number;
  yearlyNewUnitsGreen: number;
  yearlyNewUnitsLight: number;
  familiesPerCondo: number;
  networkConversionRate: number;
  managedCondos: number;
  showFamilyUtilityView?: boolean;
  includeMainNetworkEarnings?: boolean;
}

export type ViewMode = 'family' | 'client' | 'condo'; // Ensure these are still valid if app uses them for routing

export interface LevelData {
  level: number;
  users: number;
  oneTimeBonus: number;
  recurringYear1: number;
  recurringYear2: number;
  recurringYear3: number;
}

export interface MonthlyGrowthData {
  month: number;
  cumulativeEarnings: number;
  monthlyRecurring: number;
  monthlyOneTimeBonus: number;
  monthlyTotalEarnings: number;
  cumulativeOneTimeBonus: number;
  cumulativeRecurring: number;
  users: number;
}

export interface CompensationPlanResult {
  levelData: LevelData[];
  levels: LevelData[];
  totalUsers: number;
  totalContracts: number;
  totalOneTimeBonus: number;
  totalRecurringYear1: number;
  totalRecurringYear2: number;
  totalRecurringYear3: number;
  monthlyData: MonthlyGrowthData[];
  monthlyCashback: number;
  monthlyPanelYield: number;
}

export interface CondoSimulationResult {
  year1: { activeUnits: number; oneTimeBonus: number; recurringMonthly: number; totalAnnual: number; };
  year2: { activeUnits: number; oneTimeBonus: number; recurringMonthly: number; totalAnnual: number; };
  year3: { activeUnits: number; oneTimeBonus: number; recurringMonthly: number; totalAnnual: number; };
  total3Years: number;
  networkStats?: any;
  familyUtilityEarnings?: any;
}
