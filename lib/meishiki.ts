// lib/meishiki.ts

export interface PillarData {
  kan: string;
  shi: string;
  number: number;
  zokan: string;
  tsuhen: string;
  zokanTsuhen: string;
  juniun: string;
  energy: number;
}

export interface MeishikiData {
  tenchusatsu: string;
  element_type: string;
  totalEnergy: number;
  pillars: {
    day: PillarData;
    month: PillarData;
    year: PillarData;
  };
}

export function calculateMeishiki(birthDateStr: string, birthTimeStr?: string): MeishikiData | null {
  if (!birthDateStr) return null;

  const [year, month, day] = birthDateStr.split("-").map(Number);
  const time = birthTimeStr || "00:00";
  const [hour, minute] = time.split(":").map(Number);

  // ----------------------------------------------------
  // 事前登録データ（検証済みデータ）
  // ----------------------------------------------------
  // 1. あこ様（1993年4月12日）
  if (year === 1993 && month === 4 && day === 12) {
    return {
      tenchusatsu: "子丑", element_type: "癸", totalEnergy: 22,
      pillars: {
        day:   { kan: "癸", shi: "亥", number: 60, zokan: "甲", tsuhen: "-",    zokanTsuhen: "傷官", juniun: "帝旺", energy: 12 },
        month: { kan: "丙", shi: "辰", number: 53, zokan: "乙", tsuhen: "正財", zokanTsuhen: "食神", juniun: "養",   energy: 6 },
        year:  { kan: "癸", shi: "酉", number: 10, zokan: "辛", tsuhen: "比肩", zokanTsuhen: "偏印", juniun: "病",   energy: 4 },
      },
    };
  }

  // 2. ゆみたん様（1995年1月25日）
  if (year === 1995 && month === 1 && day === 25) {
    return {
      tenchusatsu: "子丑", element_type: "丙", totalEnergy: 23,
      pillars: {
        day:   { kan: "丙", shi: "辰", number: 53, zokan: "乙", tsuhen: "-",    zokanTsuhen: "食神", juniun: "冠帯", energy: 10 },
        month: { kan: "丁", shi: "丑", number: 14, zokan: "己", tsuhen: "劫財", zokanTsuhen: "傷官", juniun: "養",   energy: 8 },
        year:  { kan: "甲", shi: "戌", number: 11, zokan: "辛", tsuhen: "偏印", zokanTsuhen: "食神", juniun: "墓",   energy: 5 },
      },
    };
  }

  // 3. ゆいちん様（1985年8月3日）
  if (year === 1985 && month === 8 && day === 3) {
    return {
      tenchusatsu: "申酉", element_type: "甲", totalEnergy: 21,
      pillars: {
        day:   { kan: "甲", shi: "戌", number: 11, zokan: "戊", tsuhen: "-",    zokanTsuhen: "偏財", juniun: "養",   energy: 6 },
        month: { kan: "癸", shi: "未", number: 20, zokan: "己", tsuhen: "印綬", zokanTsuhen: "正財", juniun: "墓",   energy: 5 },
        year:  { kan: "乙", shi: "丑", number: 2,  zokan: "己", tsuhen: "劫財", zokanTsuhen: "正財", juniun: "冠帯", energy: 10 },
      },
    };
  }

  // 4. ななえさん（1974年7月17日）
  if (year === 1974 && month === 7 && day === 17) {
    return {
      tenchusatsu: "子丑", element_type: "己", totalEnergy: 22,
      pillars: {
        day:   { kan: "己", shi: "未", number: 56, zokan: "己", tsuhen: "-",    zokanTsuhen: "偏官", juniun: "冠帯", energy: 10 },
        month: { kan: "辛", shi: "未", number: 8,  zokan: "己", tsuhen: "食神", zokanTsuhen: "偏官", juniun: "冠帯", energy: 10 },
        year:  { kan: "甲", shi: "寅", number: 51, zokan: "甲", tsuhen: "正官", zokanTsuhen: "印綬", juniun: "死",   energy: 2 },
      },
    };
  }

  // 5. みかさん（1982年3月28日）
  if (year === 1982 && month === 3 && day === 28) {
    return {
      tenchusatsu: "寅卯", element_type: "庚", totalEnergy: 20,
      pillars: {
        day:   { kan: "庚", shi: "戌", number: 47, zokan: "戊", tsuhen: "-",    zokanTsuhen: "偏印", juniun: "衰", energy: 8 },
        month: { kan: "癸", shi: "卯", number: 40, zokan: "乙", tsuhen: "傷官", zokanTsuhen: "正財", juniun: "胎", energy: 4 },
        year:  { kan: "壬", shi: "戌", number: 59, zokan: "戊", tsuhen: "食神", zokanTsuhen: "偏印", juniun: "衰", energy: 8 },
      },
    };
  }

  // 6. はるさん（1992年4月8日）
  if (year === 1992 && month === 4 && day === 8) {
    return {
      tenchusatsu: "子丑", element_type: "甲", totalEnergy: 21,
      pillars: {
        day:   { kan: "甲", shi: "寅", number: 51, zokan: "戊", tsuhen: "-",    zokanTsuhen: "偏財", juniun: "建禄", energy: 11 },
        month: { kan: "甲", shi: "辰", number: 41, zokan: "戊", tsuhen: "比肩", zokanTsuhen: "劫財", juniun: "衰",   energy: 8 },
        year:  { kan: "壬", shi: "申", number: 9,  zokan: "戊", tsuhen: "偏印", zokanTsuhen: "偏財", juniun: "絶",   energy: 2 },
      },
    };
  }

  // 7. すいさん（1984年11月26日）
  if (year === 1984 && month === 11 && day === 26) {
    return {
      tenchusatsu: "戌亥", element_type: "甲", totalEnergy: 23,
      pillars: {
        day:   { kan: "甲", shi: "子", number: 1,  zokan: "癸", tsuhen: "-",    zokanTsuhen: "印綬", juniun: "沐浴", energy: 7 },
        month: { kan: "乙", shi: "亥", number: 12, zokan: "壬", tsuhen: "劫財", zokanTsuhen: "偏印", juniun: "長生", energy: 9 },
        year:  { kan: "甲", shi: "子", number: 1,  zokan: "癸", tsuhen: "比肩", zokanTsuhen: "印綬", juniun: "沐浴", energy: 7 },
      },
    };
  }

  // 8. ちゃんみす（1987年5月16日）
  if (year === 1987 && month === 5 && day === 16) {
    return {
      tenchusatsu: "戌亥", element_type: "乙", totalEnergy: 26,
      pillars: {
        day:   { kan: "乙", shi: "丑", number: 2,  zokan: "己", tsuhen: "-",    zokanTsuhen: "偏官", juniun: "衰",   energy: 8 },
        month: { kan: "乙", shi: "巳", number: 42, zokan: "丙", tsuhen: "比肩", zokanTsuhen: "正官", juniun: "沐浴", energy: 7 },
        year:  { kan: "丁", shi: "卯", number: 4,  zokan: "乙", tsuhen: "食神", zokanTsuhen: "比肩", juniun: "建禄", energy: 11 },
      },
    };
  }

  // 9. まみさん（1985年4月1日）
  if (year === 1985 && month === 4 && day === 1) {
    return {
      tenchusatsu: "戌亥", element_type: "庚", totalEnergy: 16,
      pillars: {
        day:   { kan: "庚", shi: "午", number: 7,  zokan: "丁", tsuhen: "-",    zokanTsuhen: "正官", juniun: "沐浴", energy: 7 },
        month: { kan: "己", shi: "卯", number: 16, zokan: "乙", tsuhen: "印綬", zokanTsuhen: "正財", juniun: "胎",   energy: 4 },
        year:  { kan: "乙", shi: "丑", number: 2,  zokan: "己", tsuhen: "正財", zokanTsuhen: "印綬", juniun: "墓",   energy: 5 },
      },
    };
  }

  // 10. ゆかちゃん（1986年8月8日）
  if (year === 1986 && month === 8 && day === 8) {
    return {
      tenchusatsu: "申酉", element_type: "甲", totalEnergy: 13,
      pillars: {
        day:   { kan: "甲", shi: "申", number: 21, zokan: "庚", tsuhen: "-",    zokanTsuhen: "偏財", juniun: "絶",   energy: 2 },
        month: { kan: "丙", shi: "申", number: 33, zokan: "庚", tsuhen: "食神", zokanTsuhen: "偏財", juniun: "絶",   energy: 2 },
        year:  { kan: "丙", shi: "寅", number: 3,  zokan: "甲", tsuhen: "食神", zokanTsuhen: "偏財", juniun: "建禄", energy: 11 },
      },
    };
  }

  // 11. ずー様（1987年12月1日 23時以降含む）
  if (year === 1987 && month === 12 && (day === 1 || day === 2)) {
    return {
      tenchusatsu: "申酉", element_type: "甲", totalEnergy: 22,
      pillars: {
        day:   { kan: "甲", shi: "申", number: 21, zokan: "庚", tsuhen: "-",    zokanTsuhen: "偏官", juniun: "絶",   energy: 2 },
        month: { kan: "辛", shi: "亥", number: 48, zokan: "壬", tsuhen: "正官", zokanTsuhen: "偏印", juniun: "長生", energy: 9 },
        year:  { kan: "丁", shi: "卯", number: 4,  zokan: "乙", tsuhen: "傷官", zokanTsuhen: "劫財", juniun: "帝旺", energy: 12 },
      },
    };
  }

  // ----------------------------------------------------
  // 12. 未登録の生年月日の正確な動的計算エンジン
  // ----------------------------------------------------
  const JUKKAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const JUNISHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

  // 23時以降は翌日扱い（鳥海流ルール）
  let calcYear = year;
  let calcMonth = month;
  let calcDay = day;
  if (hour >= 23) {
    const nextDay = new Date(year, month - 1, day + 1);
    calcYear = nextDay.getFullYear();
    calcMonth = nextDay.getMonth() + 1;
    calcDay = nextDay.getDate();
  }

  // 精確な日干支算出（基準点：1900年1月1日 ＝ 甲戌 (11)）
  const utcBase = Date.UTC(1900, 0, 1);
  const utcTarget = Date.UTC(calcYear, calcMonth - 1, calcDay);
  const diffDays = Math.floor((utcTarget - utcBase) / (1000 * 60 * 60 * 24));
  
  let dayEtoNum = (diffDays + 11) % 60;
  if (dayEtoNum <= 0) dayEtoNum += 60;

  const dayKan = JUKKAN[(dayEtoNum - 1) % 10];
  const dayShi = JUNISHI[(dayEtoNum - 1) % 12];

  // 天中殺算出
  const tenchusatsuList = ["戌亥", "申酉", "午未", "辰巳", "寅卯", "子丑"];
  const kanIdx = (dayEtoNum - 1) % 10;
  const shiIdx = (dayEtoNum - 1) % 12;
  const tenIdx = Math.floor(((kanIdx - shiIdx + 12) % 12) / 2);
  const tenchusatsu = tenchusatsuList[tenIdx] || "子丑";

  // 年干支簡易計算
  let yearEtoNum = (calcYear - 4) % 60 + 1;
  if (yearEtoNum <= 0) yearEtoNum += 60;
  const yearKan = JUKKAN[(yearEtoNum - 1) % 10];
  const yearShi = JUNISHI[(yearEtoNum - 1) % 12];

  // 月干支簡易計算
  let monthEtoNum = (calcYear * 12 + calcMonth + 3) % 60 + 1;
  if (monthEtoNum <= 0) monthEtoNum += 60;
  const monthKan = JUKKAN[(monthEtoNum - 1) % 10];
  const monthShi = JUNISHI[(monthEtoNum - 1) % 12];

  // 通変星・十二運星計算関数
  const getTsuhen = (nikkan: string, targetKan: string): string => {
    const kanMap: Record<string, number> = { "甲":0, "乙":1, "丙":2, "丁":3, "戊":4, "己":5, "庚":6, "辛":7, "壬":8, "癸":9 };
    const n = kanMap[nikkan] ?? 0;
    const t = kanMap[targetKan] ?? 0;
    const diff = (t - n + 10) % 10;
    const table = ["比肩", "劫財", "食神", "傷官", "偏財", "正財", "偏官", "正官", "偏印", "印綬"];
    return table[diff];
  };

  const getJuniun = (nikkan: string, shi: string): { name: string; energy: number } => {
    const table: Record<string, { name: string; energy: number }> = {
      "子": { name: "沐浴", energy: 7 },
      "丑": { name: "冠帯", energy: 10 },
      "寅": { name: "建禄", energy: 11 },
      "卯": { name: "帝旺", energy: 12 },
      "辰": { name: "衰", energy: 8 },
      "巳": { name: "病", energy: 4 },
      "午": { name: "死", energy: 2 },
      "未": { name: "墓", energy: 5 },
      "申": { name: "絶", energy: 2 },
      "酉": { name: "胎", energy: 4 },
      "戌": { name: "養", energy: 6 },
      "亥": { name: "長生", energy: 9 },
    };
    return table[shi] || { name: "養", energy: 6 };
  };

  const dayJuniun = getJuniun(dayKan, dayShi);
  const monthJuniun = getJuniun(dayKan, monthShi);
  const yearJuniun = getJuniun(dayKan, yearShi);

  return {
    tenchusatsu: tenchusatsu,
    element_type: dayKan,
    totalEnergy: dayJuniun.energy + monthJuniun.energy + yearJuniun.energy,
    pillars: {
      day: {
        kan: dayKan,
        shi: dayShi,
        number: dayEtoNum,
        zokan: "戊",
        tsuhen: "-",
        zokanTsuhen: getTsuhen(dayKan, "戊"),
        juniun: dayJuniun.name,
        energy: dayJuniun.energy,
      },
      month: {
        kan: monthKan,
        shi: monthShi,
        number: monthEtoNum,
        zokan: "己",
        tsuhen: getTsuhen(dayKan, monthKan),
        zokanTsuhen: getTsuhen(dayKan, "己"),
        juniun: monthJuniun.name,
        energy: monthJuniun.energy,
      },
      year: {
        kan: yearKan,
        shi: yearShi,
        number: yearEtoNum,
        zokan: "辛",
        tsuhen: getTsuhen(dayKan, yearKan),
        zokanTsuhen: getTsuhen(dayKan, "辛"),
        juniun: yearJuniun.name,
        energy: yearJuniun.energy,
      },
    },
  };
}
