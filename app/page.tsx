"use client";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 診断実行時の表示例
    setResult({
      element: {
        id: "癸",
        name_kana: "みずのと",
        short_image: "雨・露・水滴のように静かに潤し恵みを与える優しさ"
      }
    });
  };

  return (
    <main style={{ maxWidth: "400px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      {!result ? (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h2 style={{ textAlign: "center", color: "#4a154b" }}>あこ告 本質タイプ診断</h2>
          <div>
            <label style={{ fontSize: "14px", display: "block" }}>お名前</label>
            <input name="name" required style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "4px", border: "1px solid #ccc" }} />
          </div>
          <div>
            <label style={{ fontSize: "14px", display: "block" }}>生年月日</label>
            <input type="date" name="birth_date" required style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "4px", border: "1px solid #ccc" }} />
          </div>
          <div>
            <label style={{ fontSize: "14px", display: "block" }}>出生時間（分かれば）</label>
            <input type="time" name="birth_time" style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "4px", border: "1px solid #ccc" }} />
          </div>
          <div>
            <label style={{ fontSize: "14px", display: "block" }}>性別</label>
            <select name="gender" style={{ width: "100%", padding: "8px", marginTop: "4px", borderRadius: "4px", border: "1px solid #ccc" }}>
              <option value="女性">女性</option>
              <option value="男性">男性</option>
            </select>
          </div>
          <button type="submit" style={{ background: "#6b21a8", color: "#fff", padding: "12px", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
            診断する
          </button>
        </form>
      ) : (
        <div style={{ background: "#fff", padding: "30px", borderRadius: "10px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <p style={{ color: "#666" }}>あなたの本質タイプは</p>
          <h1 style={{ fontSize: "36px", color: "#6b21a8", margin: "15px 0" }}>
            【 {result.element.id}（{result.element.name_kana}） 】
          </h1>
          <div style={{ background: "#f3e8ff", padding: "15px", borderRadius: "8px", color: "#581c87", fontSize: "14px", lineHeight: "1.6" }}>
            🌙 <strong>イメージ:</strong><br />
            {result.element.short_image}
          </div>
        </div>
      )}
    </main>
  );
}
