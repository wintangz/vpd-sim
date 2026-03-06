type Stat = 'attack' | 'defense' | 'speed' | 'critChance' | 'stamina';

type CreateItemStatsParams = {
  weightedStats?: Partial<Record<Stat, number>>;
  itemType: string;
  level: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'uber';
  dupePowerLevel?: number;
  overflowStat?: Stat;
};

type ComputeStatParams = {
  stat?: Stat;
  totalStats: number;
  weight: number;
  weightTotal: number;
  level: number;
  dupePowerLevel: number;
  standardDupeStatBump: number;
};

export const SPEED_DIVIDER = 4;
export const MAX_DUPE_POWER_LEVEL = 10;
export const MAX_CRIT_CHANCE_ON_ITEM = 0.44;

const EXPONENT = 3;
const GROWTH_RATE = 0.2;

const CRIT_RATING_CONSTANT =
  (MAX_CRIT_CHANCE_ON_ITEM * 306.25) / (0.633 - MAX_CRIT_CHANCE_ON_ITEM);

export function calcExpStatRaw(
  baseStat: number,
  level: number,
  multiplier: number,
  flatBonus: number,
) {
  const growth = Math.pow(1 + level * GROWTH_RATE, EXPONENT);

  const scaled = baseStat * growth;

  return Math.max(scaled * multiplier, scaled + flatBonus);
}

export function calcExpStat(
  baseStat: number,
  level: number,
  multiplier: number,
  flatBonus: number,
) {
  return Math.floor(calcExpStatRaw(baseStat, level, multiplier, flatBonus));
}

export const TOTAL_STATS_BY_RARITY = {
  common: 10,
  rare: 7,
  epic: 10,
  legendary: 15,
  uber: 20,
};

export const RARITY_GROWTH = {
  common: 0.021,
  rare: 0.0147,
  epic: 0.021,
  legendary: 0.0315,
  uber: 0.04725,
};

// Unknown use - calc the approximate total stats for A0 Legendary Item
export function approxTotalStatsForLegoItemLevel(level: number) {
  const base = TOTAL_STATS_BY_RARITY.legendary;

  const value = calcExpStat(base, level, 1, 1);

  return value * 2;
}

export function computeRegularStat({
  stat,
  totalStats,
  weight,
  weightTotal,
  level,
  dupePowerLevel,
  standardDupeStatBump,
}: ComputeStatParams) {
  const baseStat = (totalStats * weight) / weightTotal;

  const levelFactor = level - 1;

  const dupeMultiplier = 1 + dupePowerLevel / 10;

  const flatBonus = dupePowerLevel * standardDupeStatBump;

  let value = calcExpStat(baseStat, levelFactor, dupeMultiplier, flatBonus);

  if (stat === 'speed') {
    value = Math.round(value / SPEED_DIVIDER);
  }

  return value;
}

export function computeRegularStatRaw({
  totalStats,
  weight,
  weightTotal,
  level,
  dupePowerLevel,
  standardDupeStatBump,
}: ComputeStatParams) {
  const baseStat = (totalStats * weight) / weightTotal;

  const levelFactor = level - 1;

  const dupeMultiplier = 1 + dupePowerLevel / 10;

  const flatBonus = dupePowerLevel * standardDupeStatBump;

  return calcExpStatRaw(baseStat, levelFactor, dupeMultiplier, flatBonus);
}

export function critConversion(rating: number) {
  if (rating <= CRIT_RATING_CONSTANT) {
    const critChance = (rating * 0.633) / (306.25 + rating);

    return {
      critChance,
      extra: 0,
    };
  }

  return {
    critChance: MAX_CRIT_CHANCE_ON_ITEM,
    extra: rating - CRIT_RATING_CONSTANT,
  };
}

export function critCalc(
  base: number,
  multiplier: number,
  dupePowerLevel: number,
  flatBonus: number,
) {
  const scaled = base * multiplier;

  const dupeBoost = 1 + dupePowerLevel / MAX_DUPE_POWER_LEVEL;

  const value = Math.max(scaled * dupeBoost, scaled + flatBonus);

  return Math.round(value * 10000) / 10000;
}

export function createItemStats({
  weightedStats = {
    attack: 0,
    defense: 0,
    speed: 0,
    critChance: 0,
    stamina: 0,
  },
  itemType,
  level,
  rarity,
  dupePowerLevel = 0,
  overflowStat,
}: CreateItemStatsParams) {
  const stats: Partial<Record<Stat, number>> = {};

  const statKeys = Object.keys(weightedStats);

  let weightTotal = 0;

  for (const stat of statKeys as Stat[]) {
    weightTotal += weightedStats[stat] ?? 0;
  }

  let totalStats = TOTAL_STATS_BY_RARITY[rarity];

  let multiplier = statKeys.length;

  if (statKeys.length !== 5) {
    if (itemType === 'trinket') {
      multiplier = 1;
    }

    if (rarity === 'common') {
      multiplier = 5;
    }
  }

  totalStats *= multiplier;

  const standardDupeStatBump = 10;

  let extraStats = 0;

  for (const stat of statKeys as Stat[]) {
    const weight = weightedStats[stat] ?? 0;

    if (stat !== 'critChance') {
      stats[stat] = computeRegularStat({
        stat,
        totalStats,
        weight,
        weightTotal,
        level,
        dupePowerLevel,
        standardDupeStatBump,
      });
    } else {
      const rating = computeRegularStat({
        stat: 'attack',
        totalStats,
        weight,
        weightTotal,
        level,
        dupePowerLevel,
        standardDupeStatBump,
      });

      const { critChance, extra } = critConversion(rating);

      extraStats = extra;

      stats.critChance = Math.round(critChance * 1000) / 1000;
    }
  }

  if (overflowStat && extraStats > 0) {
    if (overflowStat !== 'speed') {
      stats[overflowStat] = Math.floor(extraStats);
    } else {
      stats[overflowStat] = Math.round(extraStats / SPEED_DIVIDER);
    }
  }

  if (extraStats > 0 && statKeys.length !== 5) {
    for (const stat of statKeys as Stat[]) {
      const weight = weightedStats[stat] ?? 0;

      if (stat !== 'critChance') {
        stats[stat] = Math.floor(
          computeRegularStatRaw({
            stat,
            totalStats,
            weight,
            weightTotal,
            level,
            dupePowerLevel,
            standardDupeStatBump,
          }) + extraStats,
        );
      }
    }
  } else if (extraStats > 0) {
    for (const stat of statKeys as Stat[]) {
      const weight = weightedStats[stat] ?? 0;

      if (stat !== 'speed' && stat !== 'critChance') {
        stats[stat] = Math.floor(
          computeRegularStatRaw({
            totalStats,
            weight,
            weightTotal,
            level,
            dupePowerLevel,
            standardDupeStatBump,
          }) +
            extraStats / 4,
        );
      } else if (stat === 'speed') {
        stats[stat] = Math.floor(
          (computeRegularStatRaw({
            totalStats,
            weight,
            weightTotal,
            level,
            dupePowerLevel,
            standardDupeStatBump,
          }) +
            extraStats / 4) /
            SPEED_DIVIDER,
        );
      }
    }
  }

  return stats;
}

// Unknown use
export function reverseCritCalcLevel(
  base: number,
  target: number,
  dupePowerLevel: number,
  flatBonus: number,
) {
  const dupeMultiplier = 1 + dupePowerLevel / MAX_DUPE_POWER_LEVEL;

  const option1 = target / (base * dupeMultiplier);

  const option2 = (target - flatBonus) / base;

  const calc1 = critCalc(option1, base, dupePowerLevel, flatBonus);

  const calc2 = critCalc(option2, base, dupePowerLevel, flatBonus);

  if (Math.abs(calc1 - target) < Math.abs(calc2 - target)) {
    return option1;
  }

  return option2;
}
