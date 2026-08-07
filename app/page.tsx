"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { calculateMeishiki } from "@/lib/meishiki";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const birthDate = formData.get("birth_date") as string;
    const birthTime = formData.get("birth_time") as string;
    const gender = formData.get("gender") as string;

    const meishiki = calculateMeishiki(birthDate, birthTime);

    const { data: masterData } = await supabase
      .from("element_masters")
      .select("*")
      .eq("id", meishiki.nikkan)
      .single();

    await supabase.from("users").insert([
      {
        name,
        birth_date: birthDate,
        birth_time: birthTime || null,
        gender,
        element_type: meishiki.nikkan,
        meishiki_data: meishiki,
      },
    ]);

    setResult({
      name,
      meishiki,
      master: masterData || {
        id: meishiki.nikkan,
        name_kana: "みずのと",
        short_image: "雨・露・水滴のように静かに潤し恵みを与える優しさ",
        description: "静かに深く周りを満たしていく温かい包容力を持っています。"
      }
    });
    setLoading(false);
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f4f1ea", padding: "40px 20px", fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', serif", color: "#2b332c", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {!result ? (
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "420px", backgroundColor: "#ffffff", padding: "35px 30px", borderRadius: "12px", border: "1px solid #e2ddd3", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <p style={{ letterSpacing: "0.15em", fontSize: "11px", color: "#6b7a6d", margin: "0 0 6px 0", textTransform: "uppercase" }}>Personal Diagnosis</p>
            <h1 style={{ fontSize: "22px", color: "#2d4030", margin: 0, fontWeight: "500", letterSpacing: "0.05em" }}>本当の「ワタシ」を取り戻す診断</h1>
            <div style={{ width: "40px", height: "1px", backgroundColor: "#2d4030", margin: "15px auto 0" }}></div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "#4a574c", display: "block", marginBottom: "6px", letterSpacing: "0.05em" }}>お名前</label>
              <input name="name" required placeholder="山田 太郎" style={{ width: "100%", padding: "12px", borderRadius: "4px", border: "1px solid #d5cfc4", backgroundColor: "#faf9f6", color: "#2b332c", boxSizing: "border-box", fontSize: "14px", fontFamily: "sans-serif" }} />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "#4a574c", display: "block", marginBottom: "6px", letterSpacing: "0.05em" }}>生年月日</label>
              <input type="date" name="birth_date" required style={{ width: "100%", padding: "12px", borderRadius: "4px", border: "1px solid #d5cfc4", backgroundColor: "#faf9f6", color: "#2b332c", boxSizing: "border-box", fontSize: "14px", fontFamily: "sans-serif" }} />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "#4a574c", display: "block", marginBottom: "6px", letterSpacing: "0.05em" }}>出生時間（分かれば）</label>
              <input type="time" name="birth_time" style={{ width: "100%", padding: "12px", borderRadius: "4px", border: "1px solid #d5cfc4", backgroundColor: "#faf9f6", color: "#2b332c", boxSizing: "border-box", fontSize: "14px", fontFamily: "sans-serif" }} />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "#4a574c", display: "block", marginBottom: "6px", letterSpacing: "0.05em" }}>性別</label>
              <select name="gender" style={{ width: "100%", padding: "12px", borderRadius: "4px", border: "1px solid #d5cfc4", backgroundColor: "#faf9f6", color: "#2b332c", boxSizing: "border-box", fontSize: "14px", fontFamily: "sans-serif" }}>
                <option value="女性">女性</option>
                <option value="男性">男性</option>
              </select>
            </div>

            <button type="submit" disabled={loading} style={{ marginTop: "10px", backgroundColor: "#2d4030", color: "#ffffff", padding: "14px", border: "none", borderRadius: "4px", fontSize: "15px", cursor: "pointer", letterSpacing: "0.1em", transition: "background 0.3s" }}>
              {loading ? "診断中..." : "本質タイプを診断する ➔"}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ width: "100%", maxWidth: "450px", backgroundColor: "#ffffff", padding: "35px 30px", borderRadius: "12px", border: "1px solid #e2ddd3", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#6b7a6d", margin: 0, textAlign: "center", fontSize: "13px", letterSpacing: "0.05em" }}>{result.name} 様の本質タイプ</p>
          <h2 style={{ fontSize: "36px", color: "#2d4030", margin: "12px 0 4px 0", textAlign: "center", fontWeight: "500" }}>
            【 {result.master.id} 】
          </h2>
          <p style={{ textAlign: "center", color: "#8a968b", fontSize: "13px", margin: "0 0 25px 0" }}>（{result.master.name_kana}）</p>

          <div style={{ backgroundColor: "#faf9f6", padding: "20px", borderRadius: "8px", border: "1px solid #e8e4db", margin: "20px 0" }}>
            <p style={{ color: "#2d4030", fontWeight: "600", fontSize: "13px", marginTop: 0, letterSpacing: "0.05em" }}>🌿 自然界のイメージ</p>
            <p style={{ color: "#4a574c", fontSize: "13px", lineHeight: "1.7", margin: "6px 0 0 0", fontFamily: "sans-serif" }}>{result.master.short_image}</p>
            <div style={{ width: "100%", height: "1px", backgroundColor: "#e8e4db", margin: "15px 0" }}></div>
            <p style={{ color: "#2d4030", fontWeight: "600", fontSize: "13px", letterSpacing: "0.05em" }}>✨ メッセージ</p>
            <p style={{ color: "#4a574c", fontSize: "13px", lineHeight: "1.8", whiteSpace: "pre-wrap", margin: "6px 0 0 0", fontFamily: "sans-serif" }}>{result.master.description}</p>
          </div>

          <button onClick={() => setResult(null)} style={{ width: "100%", padding: "12px", backgroundColor: "#faf9f6", border: "1px solid #d5cfc4", color: "#4a574c", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}>
            もう一度診断する
          </button>
        </div>
      )}
    </main>
  );
}
