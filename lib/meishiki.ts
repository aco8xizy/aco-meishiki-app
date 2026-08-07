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

// 鳥海流（愛され四柱推命）蔵干（本気）テーブル
const ZOKAN_MAP_TORIUMI: Record<string, string> = {
  "子": "癸", "丑": "己", "寅": "甲", "卯": "乙", "辰": "戊", "巳": "丙",
  "午": "丁", "未": "己", "申": "庚", "酉": "辛", "戌": "戊", "亥": "壬",
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

// 節入り概算日（1月〜12月: 小寒, 立春, 啓蟄, 清明, 立夏, 芒種, 小暑, 立秋, 白露, 寒露, 立冬, 大雪）
const SETSUIRI_DAYS = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7];

function getTsuhen(baseKan: string, targetKan: string): string {
  const kanMap: Record<string, number> = { "甲":0, "乙":1, "丙":2, "丁":3, "戊":4, "己":5, "庚":6, "辛":7, "壬":8, "癸":9 };
  const b = kanMap[baseKan];
  const t = kanMap[targetKan];
  if (b === undefined || t === undefined) return "";
  const diff = (t - b + 10) % 10;
  const tsuhenList = ["比肩", "劫財", "食神", "傷官", "偏財", "正財", "偏官", "正官", "偏印", "印綬"];
  return tsuhenList[diff];
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

  if (birthTimeStr && birthTimeStr.trim() !== "") {
    const parts = birthTimeStr.split(":").map(Number);
    if (!isNaN(parts[0])) hour = parts[0];
  }

  // 愛され四柱推命ルール：23時以降は翌日扱い
  if (hour >= 23) {
    const nextDate = new Date(year, month - 1, day + 1);
    year = nextDate.getFullYear();
    month = nextDate.getMonth() + 1;
    day = nextDate.getDate();
  }

  // ----------------------------------------------------
  // 1. 日干支（ユリウス日による計算）
  // ----------------------------------------------------
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const julianDay = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  let dayEtoNum = (julianDay + 49) % 60;
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
  const risshunDay = SETSUIRI_DAYS[1]; // 2月4日頃
  let isBeforeRisshun = (month < 2) || (month === 2 && day < risshunDay);

  let yearEtoYear = isBeforeRisshun ? year - 1 : year;
  let yearEtoNum = (yearEtoYear - 4) % 60 + 1;
  if (yearEtoNum <= 0) yearEtoNum += 60;

  const yearKan = JUKKAN[(yearEtoNum - 1) % 10];
  const yearShi = JUNISHI[(yearEtoNum - 1) % 12];

  // ----------------------------------------------------
  // 3. 月干支（節入り判定・五虎遁月法）
  // ----------------------------------------------------
  const setsuiDay = SETSUIRI_DAYS[month - 1];
  
  // 節入り前なら前の月として計算
  let lunarMonth = month;
  if (day < setsuiDay) {
    lunarMonth = month - 1;
    if (lunarMonth < 1) lunarMonth = 12;
  }

  // 月支のインデックス（寅月=1月節, 卯月=2月節, 辰月=3月節...）
  // 辰月（4月18日）は lunarMonth = 4 ➔ shiIndex = (4 + 1) % 12 = 5 ('辰'はインデックス4)
  // 月支順序: 1月節=寅(2), 2月節=卯(3), 3月節=辰(4), 4月節=巳(5)... 12月節=丑(1)
  const monthShiArray = ["丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子"];
  const monthShi = monthShiArray[lunarMonth - 1] || "辰";

  // 五虎遁（年干の十干から月干を導く）
  // 甲己年➔丙寅..., 乙庚年➔戊寅..., 丙辛年➔庚寅..., 丁壬年➔壬寅..., 戊癸年➔甲寅...
  const yKanIdx = (yearEtoNum - 1) % 10;
  const monthStartKanMap = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0]; // 丙, 戊, 庚, 壬, 甲
  const startKanIdx = monthStartKanMap[yKanIdx];

  // 寅月(lunarMonth=2に相当)からのオフセット
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
  const dayZokan = ZOKAN_MAP_TORIUMI[dayShi] || "甲";
  const monthZokan = ZOKAN_MAP_TORIUMI[monthShi] || "甲";
  const yearZokan = ZOKAN_MAP_TORIUMI[yearShi] || "甲";

  const monthTsuhen = getTsuhen(dayKan, monthKan);
  const yearTsuhen = getTsuhen(dayKan, yearKan);

  const dayZokanTsuhen = getTsuhen(dayKan, dayZokan);
  const monthZokanTsuhen = getTsuhen(dayKan, monthZokan);
  const yearZokanTsuhen = getTsuhen(dayKan, yearZokan);

  const dayJuniun = getJuniun(dayKan, dayShi);
  const monthJuniun = getJuniun(dayKan, monthShi);
  const yearJuniun = getJuniun(dayKan, yearShi);

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
