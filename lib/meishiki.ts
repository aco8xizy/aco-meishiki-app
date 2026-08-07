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

const JUKKAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const JUNISHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 五行・陰陽定義
const KAN_ELEMENTS: Record<string, { element: string; polarity: "陽" | "陰" }> = {
  "甲": { element: "木", polarity: "陽" },
  "乙": { element: "木", polarity: "陰" },
  "丙": { element: "火", polarity: "陽" },
  "丁": { element: "火", polarity: "陰" },
  "戊": { element: "土", polarity: "陽" },
  "己": { element: "土", polarity: "陰" },
  "庚": { element: "金", polarity: "陽" },
  "辛": { element: "金", polarity: "陰" },
  "壬": { element: "水", polarity: "陽" },
  "癸": { element: "水", polarity: "陰" },
};

// 鳥海流 蔵干経過日数テーブル
// 各地支：[{ limit: 経過日数, kan: 蔵干 }]
const TORIUMI_ZOKAN_TABLE: Record<string, Array<{ limit: number; kan: string }>> = {
  "子": [{ limit: 30, kan: "癸" }],
  "丑": [{ limit: 9, kan: "癸" }, { limit: 12, kan: "辛" }, { limit: 30, kan: "己" }],
  "寅": [{ limit: 7, kan: "戊" }, { limit: 14, kan: "丙" }, { limit: 30, kan: "甲" }],
  "卯": [{ limit: 30, kan: "乙" }],
  "辰": [{ limit: 9, kan: "乙" }, { limit: 12, kan: "癸" }, { limit: 30, kan: "戊" }],
  "巳": [{ limit: 7, kan: "戊" }, { limit: 14, kan: "庚" }, { limit: 30, kan: "丙" }],
  "午": [{ limit: 19, kan: "己" }, { limit: 30, kan: "丁" }],
  "未": [{ limit: 9, kan: "丁" }, { limit: 12, kan: "乙" }, { limit: 30, kan: "己" }],
  "申": [{ limit: 7, kan: "戊" }, { limit: 14, kan: "壬" }, { limit: 30, kan: "庚" }],
  "酉": [{ limit: 30, kan: "辛" }],
  "戌": [{ limit: 9, kan: "辛" }, { limit: 12, kan: "丁" }, { limit: 30, kan: "戊" }],
  "亥": [{ limit: 12, kan: "甲" }, { limit: 30, kan: "壬" }],
};

const JUNIUN_ENERGY: Record<string, number> = {
  "長生": 9, "沐浴": 7, "冠帯": 10, "建禄": 11, "帝旺": 12, "衰": 8,
  "病": 4, "死": 2, "墓": 5, "絶": 1, "胎": 3, "養": 6,
};

const JUNIUN_TABLE: Record<string, Record<string, string>> = {
  "甲": { "子":"沐浴", "丑":"冠帯", "寅":"建禄", "卯":"帝旺", "辰":"衰", "巳":"病", "午":"死", "未":"墓", "申":"絶", "酉":"胎", "戌":"養", "亥":"長生" },
  "乙": { "子":"病", "丑":"衰", "寅":"帝旺", "卯":"建禄", "辰":"冠帯", "巳":"沐浴", "午":"長生", "未":"養", "申":"胎", "酉":"絶", "戌":"墓", "亥":"死" },
  "丙": { "子":"胎", "丑":"養", "寅":"長生", "卯":"沐浴", "辰":"冠帯", "巳":"建禄", "午":"帝旺", "未":"衰", "申":"病", "酉":"死", "戌":"墓", "亥":"絶" },
  "丁": { "子":"絶", "丑":"墓", "寅":"死", "卯":"病", "辰":"衰", "巳":"帝旺", "午":"建禄", "未":"冠帯", "申":"沐浴", "酉":"長生", "戌":"養", "亥":"胎" },
  "戊": { "子":"胎", "丑":"養", "寅":"長生", "卯":"沐浴", "辰":"冠帯", "巳":"建禄", "午":"帝旺", "未":"衰", "申":"病", "酉":"死", "戌":"墓", "亥":"絶" },
  "己": { "子":"絶", "丑":"墓", "寅":"死", "卯":"病", "辰":"衰", "巳":"帝旺", "午":"建禄", "未":"冠帯", "申":"沐浴", "酉":"長生", "戌":"養", "亥":"胎" },
  "庚": { "子":"死", "丑":"墓", "寅":"絶", "卯":"胎", "辰":"養", "巳":"長生", "午":"沐浴", "未":"冠帯", "申":"建禄", "酉":"帝旺", "戌":"衰", "亥":"病" },
  "辛": { "子":"長生", "丑":"養", "寅":"胎", "卯":"絶", "辰":"墓", "巳":"死", "午":"病", "未":"衰", "申":"帝旺", "酉":"建禄", "戌":"冠帯", "亥":"沐浴" },
  "壬": { "子":"帝旺", "丑":"衰", "寅":"病", "卯":"死", "辰":"墓", "巳":"絶", "午":"胎", "未":"養", "申":"長生", "酉":"沐浴", "戌":"冠帯", "亥":"建禄" },
  "癸": { "子":"建禄", "丑":"冠帯", "寅":"沐浴", "卯":"長生", "辰":"養", "巳":"胎", "午":"絶", "未":"墓", "申":"死", "酉":"病", "戌":"衰", "亥":"帝旺" },
};

// 節入り月テーブル（毎月の節入り概算日・時刻）
// [小寒(1月), 立春(2月), 啓蟄(3月), 清明(4月), 立夏(5月), 芒種(6月), 小暑(7月), 立秋(8月), 白露(9月), 寒露(10月), 立冬(11月), 大雪(12月)]
const SETSUIRI_MONTHS = [
  { month: 1, day: 6, hour: 0 },
  { month: 2, day: 4, hour: 0 },
  { month: 3, day: 6, hour: 0 },
  { month: 4, day: 5, hour: 0 },
  { month: 5, day: 6, hour: 0 },
  { month: 6, day: 6, hour: 0 },
  { month: 7, day: 7, hour: 0 },
  { month: 8, day: 8, hour: 0 },
  { month: 9, day: 8, hour: 0 },
  { month: 10, day: 8, hour: 0 },
  { month: 11, day: 7, hour: 0 },
  { month: 12, day: 7, hour: 0 },
];

/**
 * 通変星の五行・陰陽生剋計算
 */
function getTsuhen(dayKan: string, targetKan: string): string {
  if (dayKan === targetKan) return "比肩";
  const dayInfo = KAN_ELEMENTS[dayKan];
  const targetInfo = KAN_ELEMENTS[targetKan];
  if (!dayInfo || !targetInfo) return "";

  const isSamePolarity = dayInfo.polarity === targetInfo.polarity;
  const elemMap = ["木", "火", "土", "金", "水"];
  const dIdx = elemMap.indexOf(dayInfo.element);
  const tIdx = elemMap.indexOf(targetInfo.element);

  const diff = (tIdx - dIdx + 5) % 5;

  if (diff === 0) return isSamePolarity ? "比肩" : "劫財";
  if (diff === 1) return isSamePolarity ? "食神" : "傷官";
  if (diff === 2) return isSamePolarity ? "偏財" : "正財";
  if (diff === 3) return isSamePolarity ? "偏官" : "正官";
  if (diff === 4) return isSamePolarity ? "偏印" : "印綬";

  return "";
}

/**
 * 節入り経過日数から蔵干を決定
 */
function getZokan(shi: string, passedDays: number): string {
  const table = TORIUMI_ZOKAN_TABLE[shi];
  if (!table) return "甲";
  for (const item of table) {
    if (passedDays <= item.limit) {
      return item.kan;
    }
  }
  return table[table.length - 1].kan;
}

function getJuniun(nikkan: string, shi: string): { name: string; energy: number } {
  const name = JUNIUN_TABLE[nikkan]?.[shi] || "養";
  const energy = JUNIUN_ENERGY[name] || 6;
  return { name, energy };
}

export function calculateMeishiki(birthDateStr: string, birthTimeStr?: string): MeishikiData | null {
  if (!birthDateStr) return null;

  let [year, month, day] = birthDateStr.split("-").map(Number);
  let hour = 10;
  let minute = 0;

  if (birthTimeStr && birthTimeStr.trim() !== "") {
    const parts = birthTimeStr.split(":").map(Number);
    if (!isNaN(parts[0])) hour = parts[0];
    if (!isNaN(parts[1])) minute = parts[1];
  }

  // 修正必須⑤：23時台生まれは翌日0:00扱い
  if (hour >= 23) {
    const targetDate = new Date(Date.UTC(year, month - 1, day + 1));
    year = targetDate.getUTCFullYear();
    month = targetDate.getUTCMonth() + 1;
    day = targetDate.getUTCDate();
    hour = 0;
    minute = 0;
  }

  // ----------------------------------------------------
  // 1. 正確な日干支算出（ユリウス日完全補正）
  // ----------------------------------------------------
  const baseDate = Date.UTC(1900, 0, 1); // 1900年1月1日 = 甲戌 (11)
  const currentDate = Date.UTC(year, month - 1, day);
  const diffDays = Math.round((currentDate - baseDate) / (1000 * 60 * 60 * 24));

  let dayEtoNum = (diffDays + 11) % 60;
  if (dayEtoNum <= 0) dayEtoNum += 60;

  const dayKan = JUKKAN[(dayEtoNum - 1) % 10];
  const dayShi = JUNISHI[(dayEtoNum - 1) % 12];

  // 天中殺
  const tenchusatsuList = ["戌亥", "申酉", "午未", "辰巳", "寅卯", "子丑"];
  const kIdx = (dayEtoNum - 1) % 10;
  const sIdx = (dayEtoNum - 1) % 12;
  const tenIdx = Math.floor(((kIdx - sIdx + 12) % 12) / 2);
  const tenchusatsu = tenchusatsuList[tenIdx] || "子丑";

  // ----------------------------------------------------
  // 2. 年干支（立春判定）
  // ----------------------------------------------------
  const risshun = SETSUIRI_MONTHS[1]; // 2月4日
  const isBeforeRisshun = (month < 2) || (month === 2 && (day < risshun.day || (day === risshun.day && hour < risshun.hour)));

  let yearEtoYear = isBeforeRisshun ? year - 1 : year;
  let yearEtoNum = (yearEtoYear - 4) % 60 + 1;
  if (yearEtoNum <= 0) yearEtoNum += 60;

  const yearKan = JUKKAN[(yearEtoNum - 1) % 10];
  const yearShi = JUNISHI[(yearEtoNum - 1) % 12];

  // ----------------------------------------------------
  // 3. 月干支・節入り経過日数の算出
  // ----------------------------------------------------
  let currentMonthSetsu = SETSUIRI_MONTHS[month - 1];
  let isBeforeSetsu = (day < currentMonthSetsu.day) || (day === currentMonthSetsu.day && hour < currentMonthSetsu.hour);

  let lunarMonth = month;
  if (isBeforeSetsu) {
    lunarMonth = month - 1;
    if (lunarMonth < 1) lunarMonth = 12;
  }

  // 節入り日からの経過日数計算
  let setsuDay = SETSUIRI_MONTHS[lunarMonth - 1].day;
  let passedDays = day - setsuDay + 1;
  if (passedDays <= 0) {
    passedDays += 30; // 節入り前の補正
  }

  const monthShiArray = ["丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子"];
  const monthShi = monthShiArray[lunarMonth - 1];

  // 五虎遁月法
  const yKanIdx = (yearEtoNum - 1) % 10;
  const monthStartKanMap = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0]; // 丙, 戊, 庚, 壬, 甲
  const startKanIdx = monthStartKanMap[yKanIdx];

  let monthOffset = (lunarMonth === 1) ? 11 : (lunarMonth - 2);
  const monthKan = JUKKAN[(startKanIdx + monthOffset) % 10];

  let monthEtoNum = 1;
  for (let i = 1; i <= 60; i++) {
    if (JUKKAN[(i - 1) % 10] === monthKan && JUNISHI[(i - 1) % 12] === monthShi) {
      monthEtoNum = i;
      break;
    }
  }

  // ----------------------------------------------------
  // 4. 蔵干・通変星・十二運星（鳥海流）
  // ----------------------------------------------------
  const dayZokan = getZokan(dayShi, passedDays);
  const monthZokan = getZokan(monthShi, passedDays);
  const yearZokan = getZokan(yearShi, passedDays);

  const monthTsuhen = getTsuhen(dayKan, monthKan);
  const yearTsuhen = getTsuhen(dayKan, yearKan);

  const dayZokanTsuhen = getTsuhen(dayKan, dayZokan);
  const monthZokanTsuhen = getTsuhen(dayKan, monthZokan);
  const yearZokanTsuhen = getTsuhen(dayKan, yearZokan);

  const dayJuniun = getJuniun(dayKan, dayShi);
  const monthJuniun = getJuniun(dayKan, monthShi);
  const yearJuniun = getJuniun(dayKan, yearShi);

  // 時柱を除く3柱の運勢エネルギー合計
  const totalEnergy = dayJuniun.energy + monthJuniun.energy + yearJuniun.energy;

  return {
    tenchusatsu,
    element_type: dayKan,
    totalEnergy,
    pillars: {
      day: {
        kan: dayKan,
        shi: dayShi,
        number: dayEtoNum,
        zokan: dayZokan,
        tsuhen: "-",
        zokanTsuhen: dayZokanTsuhen,
        juniun: dayJuniun.name,
        energy: dayJuniun.energy,
      },
      month: {
        kan: monthKan,
        shi: monthShi,
        number: monthEtoNum,
        zokan: monthZokan,
        tsuhen: monthTsuhen,
        zokanTsuhen: monthZokanTsuhen,
        juniun: monthJuniun.name,
        energy: monthJuniun.energy,
      },
      year: {
        kan: yearKan,
        shi: yearShi,
        number: yearEtoNum,
        zokan: yearZokan,
        tsuhen: yearTsuhen,
        zokanTsuhen: yearZokanTsuhen,
        juniun: yearJuniun.name,
        energy: yearJuniun.energy,
      },
    },
  };
}
