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

    // 命式計算
    const meishiki = calculateMeishiki(birthDate, birthTime);

    // Supabaseから本質マスターの最新文章を取得
    const { data: masterData } = await supabase
      .from("element_masters")
      .select("*")
      .eq("id", meishiki.nikkan)
      .single();

    // ユーザーデータをSupabaseに自動保存
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
    <main style={{ minHeight: "100vh", backgroundColor: "#1e1b2e", padding: "40px 20px", fontFamily: "sans-serif", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {!result ? (
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "420px", background: "linear-gradient(135deg, #2e1065 0%, #3b0764 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #d97706", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
          <h1 style={{ textAlign: "center", color: "#fef08a", fontSize: "22px", margin: "0 0 8px 0" }}>あこ告 本質タイプ診断</h1>
          <p style={{ textAlign: "center", color: "#c084fc", fontSize: "13px", margin: "0 0 25px 0" }}>愛され四柱推命</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ fontSize: "13px", color: "#e9d5ff", display: "block", marginBottom: "4px" }}>お名前</label>
              <input name="name" required placeholder="山田 太郎" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #581c87", backgroundColor: "#1e1b2e", color: "#fff", boxSizing: "border-box" }} />
            </div>

            <div>
              <label style={{ fontSize: "13px", color: "#e9d5ff", display: "block", marginBottom: "4px" }}>生年月日</label>
              <input type="date" name="birth_date" required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #581c87", backgroundColor: "#1e1b2e", color: "#fff", boxSizing: "border-box" }} />
            </div>

            <div>
              <label style={{ fontSize: "13px", color: "#e9d5ff", display: "block", marginBottom: "4px" }}>出生時間（分かれば）</label>
              <input type="time" name="birth_time" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #581c87", backgroundColor: "#1e1b2e", color: "#fff", boxSizing: "border-box" }} />
            </div>

            <div>
              <label style={{ fontSize: "13px", color: "#e9d5ff", display: "block", marginBottom: "4px" }}>性別</label>
              <select name="gender" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #581c87", backgroundColor: "#1e1b2e", color: "#fff", boxSizing: "border-box" }}>
                <option value="女性">女性</option>
                <option value="男性">男性</option>
              </select>
            </div>

            <button type="submit" disabled={loading} style={{ marginTop: "10px", background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", color: "#fff", padding: "14px", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", boxShadow: "0 4px 12px rgba(217,119,6,0.4)" }}>
              {loading ? "診断中..." : "本質タイプを診断する ✨"}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ width: "100%", maxWidth: "450px", background: "linear-gradient(135deg, #2e1065 0%, #3b0764 100%)", padding: "30px", borderRadius: "16px", border: "2px solid #d97706", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
          <p style={{ color: "#c084fc", margin: 0, textAlign: "center" }}>{result.name} 様の本質は</p>
          <h2 style={{ fontSize: "40px", color: "#fef08a", margin: "15px 0", textAlign: "center" }}>
            【 {result.master.id} 】
          </h2>
          <p style={{ textAlign: "center", color: "#e9d5ff", fontSize: "14px", marginTop="-10px" }}>（{result.master.name_kana}）</p>

          <div style={{ backgroundColor: "#1e1b2e", padding: "20px", borderRadius: "10px", border: "1px solid #581c87", margin: "20px 0" }}>
            <p style={{ color: "#fef08a", fontWeight: "bold", fontSize: "14px", marginTop: 0 }}>🌙 自然界のイメージ</p>
            <p style={{ color: "#fff", fontSize: "14px", lineHeight: "1.6" }}>{result.master.short_image}</p>
            <hr style={{ borderColor: "#3b0764", margin: "15px 0" }} />
            <p style={{ color: "#fef08a", fontWeight: "bold", fontSize: "14px" }}>✨ 「あこ告」メッセージ</p>
            <p style={{ color: "#e9d5ff", fontSize: "13px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{result.master.description}</p>
          </div>

          <button onClick={() => setResult(null)} style={{ width: "100%", padding: "10px", backgroundColor: "#4c1d95", border: "none", color: "#fff", borderRadius: "6px", cursor: "pointer" }}>
            もう一度診断する
          </button>
        </div>
      )}
    </main>
  );
}
