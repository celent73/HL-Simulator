import { useMemo } from 'react';
import { HerbalifeLevel, HerbalifePlanInput, HerbalifeResult } from '../types';

const DISCOUNTS: Record<string, number> = {
    'Member': 25,
    'Senior Consultant': 35,
    'Success Builder': 42,
    'Supervisor': 50,
    'World Team': 50,
    'GET': 50,
    'GET 2.5': 50,
    'Millionaire': 50,
    'Millionaire 7.5': 50,
    'President': 50
};

const TAB_BONUSES: Record<string, number> = {
    'GET': 2,
    'GET 2.5': 2,
    'Millionaire': 4,
    'Millionaire 7.5': 4,
    'President': 6
};

// ROYALTY POINT (RO) THRESHOLDS
const RO_THRESHOLDS = {
    'World Team': 500,
    'GET': 1000,
    'GET 2.5': 2500,
    'Millionaire': 4000,
    'Millionaire 7.5': 7500,
    'President': 10000
};

const QUALIFICATION_TIME: Record<string, string> = {
    'Member': 'Immediato',
    'Senior Consultant': '2 mesi (accumulo)',
    'Success Builder': '1 mese (ordine unico)',
    'Supervisor': '12 mesi o 2 mesi',
    'World Team': '4 mesi consecutivi',
    'GET': '3 mesi consecutivi',
    'GET 2.5': '3 mesi consecutivi',
    'Millionaire': '3 mesi consecutivi',
    'Millionaire 7.5': '3 mesi consecutivi',
    'President': '3 mesi consecutivi'
};

export const useHerbalifeLogic = (input: HerbalifePlanInput): HerbalifeResult => {

    // 1. Calculate Turnover Ratio (Currency per PV)
    // FIXED: 1 PV = 2 Euro as per new requirements
    const turnoverPerPV = 2;

    // 2. Calculate Royalty Points (RO)
    // RO is 5% of Total Volume from Supervisor Legs (1st, 2nd, 3rd level).
    // In this flat simulator, we treat all "Supervisor" downline members as producing Royalty Volume.
    const totalSupervisorPV = useMemo(() => {
        return input.downline.reduce((sum, m) => {
            // We count volume from Supervisors towards RO
            if (m.level === 'Supervisor' || m.level === 'World Team' || m.level === 'GET' || m.level === 'GET 2.5' || m.level === 'Millionaire' || m.level === 'Millionaire 7.5' || m.level === 'President') {
                return sum + m.pv;
            }
            return sum;
        }, 0);
    }, [input.downline]);

    const royaltyPoints = Math.floor(totalSupervisorPV * 0.05);

    // 3. Determine Level (Logic: High Levels driven by RO, Low Levels by PV)
    const personalLevel = useMemo<HerbalifeLevel>(() => {
        // Check TAB / Leadership Levels determined by RO
        if (royaltyPoints >= RO_THRESHOLDS['President']) return 'President';
        if (royaltyPoints >= RO_THRESHOLDS['Millionaire 7.5']) return 'Millionaire 7.5';
        if (royaltyPoints >= RO_THRESHOLDS['Millionaire']) return 'Millionaire';
        if (royaltyPoints >= RO_THRESHOLDS['GET 2.5']) return 'GET 2.5';
        if (royaltyPoints >= RO_THRESHOLDS['GET']) return 'GET';
        if (royaltyPoints >= RO_THRESHOLDS['World Team']) return 'World Team';

        // Total Volume (Personal + Downline) determines Level for lower grades
        const totalVolume = input.personalPV + input.downline.reduce((acc, m) => acc + m.pv, 0);

        // Fallback to Total Volume (PPV + DLV) for lower grades
        if (totalVolume >= 4000) return 'Supervisor';

        // MODIFIED: Success Builder (1000 PV) requires PERSONAL volume
        if (input.personalPV >= 1000) return 'Success Builder';

        if (totalVolume >= 500) return 'Senior Consultant';
        return 'Member';
    }, [input.personalPV, input.downline, royaltyPoints]);

    const discount = DISCOUNTS[personalLevel] || 25;
    const productionBonusPercent = TAB_BONUSES[personalLevel] || 0;

    // 4. Retail Profit
    // FIXED: Retail Profit is now strictly based on Personal PV * Turnover Rate * Discount
    // Formula: (Personal PV * 2) * (Discount / 100)
    const retailProfit = (input.personalPV * turnoverPerPV) * (discount / 100);

    // 5. Wholesale Profit
    // Difference between My Discount and Downline Discount
    const wholesaleProfit = useMemo(() => {
        return input.downline.reduce((total, member) => {
            const memberDiscount = DISCOUNTS[member.level] || 25;
            const margin = Math.max(0, discount - memberDiscount);
            // Wholesale is earned on the CURRENCY volume of the downline
            const memberTurnover = member.pv * turnoverPerPV;
            return total + (memberTurnover * (margin / 100));
        }, 0);
    }, [input.downline, discount, turnoverPerPV]);

    // 6. Royalty Earnings (Cash)
    // 5% of Turnver of Supervisor Organizations
    // MODIFIED: Scaled Royalty based on PERSONAL PV (User Request)
    // < 100: 0%
    // 100-199: 1%
    // 200-299: 2%
    // 300-399: 3%
    // 400-499: 4%
    // >= 500: 5%
    const royaltyEarnings = useMemo(() => {
        if (discount < 50) return 0; // Only Supervisors+ earn Royalties

        // Determine Royalty Percentage
        let royaltyPct = 0;
        const ppv = input.personalPV;
        if (ppv >= 2500) royaltyPct = 0.05;
        else if (ppv >= 2000) royaltyPct = 0.04;
        else if (ppv >= 1500) royaltyPct = 0.03;
        else if (ppv >= 1000) royaltyPct = 0.02;
        else if (ppv >= 500) royaltyPct = 0.01;
        else royaltyPct = 0;

        if (royaltyPct === 0) return 0;

        // Sum of Turnover of Supervisors * RoyaltyPct
        // Only from Supervisor legs
        return input.downline.reduce((total, member) => {
            if (DISCOUNTS[member.level] >= 50) { // Supervisor or higher
                const vol = member.pv * turnoverPerPV;
                return total + (vol * royaltyPct);
            }
            return total;
        }, 0);
    }, [input.downline, discount, turnoverPerPV, input.personalPV]);

    // 7. Production Bonus (TAB Team)
    // % on Entire Downline Turnover
    const productionBonus = useMemo(() => {
        if (productionBonusPercent === 0) return 0;
        const totalDownlineTurnover = input.downline.reduce((acc, m) => acc + (m.pv * turnoverPerPV), 0);
        return totalDownlineTurnover * (productionBonusPercent / 100);
    }, [input.downline, productionBonusPercent, turnoverPerPV]);

    const totalEarnings = retailProfit + wholesaleProfit + royaltyEarnings + productionBonus;

    // Next Level Analysis
    let nextLevel: HerbalifeLevel | undefined;
    let pvToNextLevel: number | undefined; // Usually PV or RO
    let potentialEarningsNextLevel: number | undefined;

    const levelsOrder: HerbalifeLevel[] = ['Member', 'Senior Consultant', 'Success Builder', 'Supervisor', 'World Team', 'GET', 'GET 2.5', 'Millionaire', 'Millionaire 7.5', 'President'];
    const currentIndex = levelsOrder.indexOf(personalLevel);

    if (currentIndex >= 0 && currentIndex < levelsOrder.length - 1) {
        nextLevel = levelsOrder[currentIndex + 1];

        // Calculate Gap (PV based for low, RO based for high)
        if (['Member', 'Senior Consultant'].includes(personalLevel)) {
            // Target is PV based (up to Supervisor typically)
            if (nextLevel === 'Senior Consultant') pvToNextLevel = Math.max(0, 500 - input.personalPV);
            if (nextLevel === 'Success Builder') pvToNextLevel = Math.max(0, 1000 - input.personalPV);
            if (nextLevel === 'Supervisor') pvToNextLevel = Math.max(0, 4000 - input.personalPV);
        } else {
            // Target is RO based
            const targetRO = RO_THRESHOLDS[nextLevel as keyof typeof RO_THRESHOLDS];
            if (targetRO) {
                pvToNextLevel = Math.max(0, targetRO - royaltyPoints); // Here "PV" variable name re-used for RO points
            }
        }

        // Potential Earnings at Next Level
        // We simulate: If you had the rate of Next Level, what would you earn on CURRENT volume?
        // For TAB levels, this shows the power of the Bonus.
        const nextDiscount = DISCOUNTS[nextLevel];
        const nextBonusPct = TAB_BONUSES[nextLevel] || 0;

        const newRetail = (input.personalPV * turnoverPerPV) * (nextDiscount / 100);

        const newWholesale = input.downline.reduce((total, member) => {
            const memberDiscount = DISCOUNTS[member.level] || 25;
            const margin = Math.max(0, nextDiscount - memberDiscount);
            return total + (member.pv * turnoverPerPV * (margin / 100));
        }, 0);

        const newRoyalties = (nextDiscount >= 50) ? input.downline.reduce((total, member) => {
            if (DISCOUNTS[member.level] >= 50) return total + (member.pv * turnoverPerPV * 0.05);
            return total;
        }, 0) : 0;

        const newProdBonus = input.downline.reduce((acc, m) => acc + (m.pv * turnoverPerPV), 0) * (nextBonusPct / 100);

        potentialEarningsNextLevel = newRetail + newWholesale + newRoyalties + newProdBonus;
    }

    const qualificationTime = QUALIFICATION_TIME[personalLevel] || '';
    const nextLevelQualificationTime = nextLevel ? QUALIFICATION_TIME[nextLevel] : undefined;
    const turnover = input.personalPV * turnoverPerPV;

    return {
        currentLevel: personalLevel,
        discountPercentage: discount,
        retailProfit,
        wholesaleProfit,
        royaltyEarnings,
        productionBonus,
        totalEarnings,
        nextLevel,
        pvToNextLevel: pvToNextLevel || 0,
        potentialEarningsNextLevel,
        turnover,
        qualificationTime,
        nextLevelQualificationTime
    };
};
