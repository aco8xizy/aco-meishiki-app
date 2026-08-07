"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [gender, setGender] = useState("女性");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const calculateElement = (dateStr: string) => {
    if (!dateStr) return "甲";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const elements = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    const index = (year + month + day) % 10;
    return elements[index];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthDate) {
      alert("お名前と生年月日を入力してください");
      return;
    }

    setLoading(true);
    const elementType = calculateElement(birthDate);

    const meishikiData = {
      tenchusatsu: "子丑",
      totalEnergy: 22,
      pillars: {
        year: { kan: "甲", shi: "寅", tsuhen: "正官", zokanTsuhen: "印綬", juniun: "死", energy: 2 },
        month: { kan: "辛", shi: "未", tsuhen: "食神", zokanTsuhen: "偏官", juniun: "冠帯", energy: 10 },
        day: { kan: elementType, shi: "未", tsuhen: "-", zokanTsuhen: "偏官", juniun: "冠帯", energy: 10 }
      }
    };

    // 💾 Supabaseにユーザーデータを自動登録（400エラー対策済み）
    try {
      if (supabaseUrl && supabaseAnonKey) {
        const payload: any = {
          name: name,
          birth_date: birthDate,
          gender: gender,
          element_type: elementType,
          meishiki_data: meishikiData
        };

        // 時間が入力されている場合のみ追加
        if (birthTime) {
          payload.birth_time = birthTime;
        }

        const { error } = await supabase.from("users").insert([payload]);
        if (error) {
          console.error("Supabase保存エラー詳細:", error);
        }
      }
    } catch (err) {
      console.error("送信時例外:", err);
    }

    // マスター取得
    let masterInfo = null;
    try {
      if (supabaseUrl && supabaseAnonKey) {
        const { data } = await supabase
          .from("element_masters")
          .select("*")
          .eq("id", elementType)
          .single();
        if (data) masterInfo = data;
      }
    } catch (err) {
      console.error("マスター取得エラー:", err);
    }

    setResult({
      name,
      elementType,
      masterInfo,
      meishikiData
    });

    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f1ea", color: "#2b332c", fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', serif", padding: "40px 20px" }}>
      <main style={{ maxWidth: "500px", margin: "0 auto", backgroundColor: "#ffffff", padding: "30px 25px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1px solid #e2ddd3" }}>
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <span style={{ fontSize: "11px", color: "#6b7a6d", letterSpacing: "0.2em", display: "block", marginBottom: "6px" }}>AKO TELL DIAGNOSIS</span>
          <h1 style={{ fontSize: "22px", margin: 0, color: "#2d4030", fontWeight: "500" }}>四柱推命 命式診断</h1>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "6px", color: "#4a574c" }}>お名前</label>
              <input
                type="text"
                required
                placeholder="山田 太郎"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #d5cfc4", backgroundColor: "#faf9f6", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "6px", color: "#4a574c" }}>生年月日</label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #d5cfc4", backgroundColor: "#faf9f6", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "6px", color: "#4a574c" }}>生まれた時間（任意）</label>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #d5cfc4", backgroundColor: "#faf9f6", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "6px", color: "#4a574c" }}>性別</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #d5cfc4", backgroundColor: "#faf9f6", fontSize: "14px", boxSizing: "border-box" }}
              >
                <option value="女性">女性</option>
                <option value="男性">男性</option>
                <option value="その他">その他</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: "10px", padding: "14px", backgroundColor: "#2d4030", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "15px", fontWeight: "bold", cursor: "pointer" }}
            >
              {loading ? "診断中..." : "診断する"}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "18px", color: "#2d4030", marginBottom: "10px" }}>{result.name} 様の診断結果</h2>
            <div style={{ backgroundColor: "#faf9f6", padding: "20px", borderRadius: "8px", border: "1px solid #e8e4db", marginBottom: "20px" }}>
              <span style={{ fontSize: "12px", color: "#6b7a6d" }}>あなたの本質タイプ</span>
              <h3 style={{ fontSize: "28px", color: "#2d4030", margin: "10px 0" }}>【 {result.elementType} 】</h3>
              <p style={{ fontSize: "14px", fontWeight: "bold", color: "#4a574c" }}>{result.masterInfo?.short_image || ""}</p>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.7", textAlign: "left", marginTop: "15px" }}>
                {result.masterInfo?.description || "まっすぐで芯のある素晴らしい質を持っています。"}
              </p>
            </div>

            <button
              onClick={() => setResult(null)}
              style={{ padding: "10px 20px", backgroundColor: "transparent", border: "1px solid #2d4030", color: "#2d4030", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
            >
              もう一度診断する
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
