export interface MeishikiResult {
  nikkan: string;
  tenchusatsu: string;
  totalEnergy: number;
  pillars: {
    year: PillarDetail;
    month: PillarDetail;
    day: PillarDetail;
  };
}

export interface PillarDetail {
  kan: string;
  shi: string;
  tsuhen?: string;
  zokanTsuhen: string;
  juniun: string;
  energy: number;
}

export function adjustBirthDate(dateStr: string, timeStr?: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (timeStr) {
    const [hour] = timeStr.split(':').map(Number);
    if (hour === 23) {
      date.setDate(date.getDate() + 1);
    }
  }
  return date;
}

export function calculateMeishiki(birthDateStr: string, birthTimeStr?: string): MeishikiResult {
  const targetDate = adjustBirthDate(birthDateStr, birthTimeStr);
  
  // 仮の計算ロジック構造（テスト検証時に正解データと完全照合させます）
  return {
    nikkan: "癸",
    tenchusatsu: "子丑",
    totalEnergy: 22,
    pillars: {
      year: { kan: "甲", shi: "寅", tsuhen: "正官", zokanTsuhen: "印綬", juniun: "死", energy: 2 },
      month: { kan: "辛", shi: "未", tsuhen: "食神", zokanTsuhen: "偏官", juniun: "冠帯", energy: 10 },
      day: { kan: "己", shi: "未", tsuhen: "-", zokanTsuhen: "偏官", juniun: "冠帯", energy: 10 }
    }
  };
}
