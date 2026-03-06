export function getDailyBossRates(level: number) {
  const r7 = { epic: 95.95, legendary: 4, uber: 0.05 };
  const r6 = { epic: 94.95, legendary: 5, uber: 0.0501 };
  const r5 = { epic: 94.7, legendary: 5.25, uber: 0.0502 };
  const r4 = { epic: 94.449, legendary: 5.5, uber: 0.051 };

  const ranges = [
    { start: 78, end: 123, from: r7, to: r6 },
    { start: 126, end: 153, from: r6, to: r5 },
    { start: 156, end: 183, from: r5, to: r4 },
  ];

  if (level >= 183) return r4;
  if (level < 78) {
    throw new Error('Level too low for this simplified version.');
  }

  for (const range of ranges) {
    if (level >= range.start && level <= range.end) {
      const progress = (level - range.start) / (range.end - range.start);

      return {
        epic: range.from.epic + (range.to.epic - range.from.epic) * progress,
        legendary:
          range.from.legendary +
          (range.to.legendary - range.from.legendary) * progress,
        uber: range.from.uber + (range.to.uber - range.from.uber) * progress,
      };
    }
  }

  return r6;
}

export function getNormalBossRates(level: number) {
  const r3 = { common: 75, rare: 20, epic: 4.9, legendary: 0.1 };

  const r13 = { common: 43, rare: 41, epic: 15.5, legendary: 0.5 };

  const r12 = { common: 25.5, rare: 50, epic: 23.49, legendary: 1, uber: 0.01 };

  const r11 = { rare: 56.48, epic: 42, legendary: 1.5, uber: 0.02 };

  const ranges = [
    { start: 1, end: 4, from: r3, to: r13 },
    { start: 5, end: 10, from: r13, to: r12 },
    { start: 11, end: 20, from: r12, to: r11 },
  ];

  if (level <= 1) return r3;
  if (level >= 60) return r11;

  for (const range of ranges as {
    start: number;
    end: number;
    from: Record<string, number>;
    to: Record<string, number>;
  }[]) {
    if (level >= range.start && level <= range.end) {
      const progress = (level - range.start) / (range.end - range.start);

      const result: Record<string, number> = {};

      const keys: Set<string> = new Set([
        ...Object.keys(range.from),
        ...Object.keys(range.to),
      ]);

      for (const key of keys) {
        const fromVal = range.from[key] || 0;
        const toVal = range.to[key] || 0;

        result[key] = fromVal + (toVal - fromVal) * progress;
      }

      return result;
    }
  }
  return r11;
}
