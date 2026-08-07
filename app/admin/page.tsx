"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 🔒 管理画面のパスワード（自由に変更してください）
const ADMIN_PASSWORD = "akuxiku82"; 

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [activeTab, setActiveTab] = useState<"users" | "masters">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [masters, setMasters] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editingMaster, setEditingMaster] = useState<any>(null);

  useEffect(() => {
    // ログイン済みの場合のみデータを取得
    if (isAuthenticated) {
      fetchUsers();
      fetchMasters();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("パスワードが違います");
    }
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    if (data) setUsers(data);
  };

  const fetchMasters = async () => {
    const { data } = await supabase.from("element_masters").select("*").order("id");
    if (data) setMasters(data);
  };

  const handleUpdateMaster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaster) return;
    const { error } = await supabase
      .from("element_masters")
      .update({
        short_image: editingMaster.short_image,
        description: editingMaster.description,
      })
      .eq("id", editingMaster.id);

    if (!error) {
      alert(`${editingMaster.id} のマスター情報を更新しました！`);
      setEditingMaster(null);
      fetchMasters();
    } else {
      alert("更新に失敗しました");
    }
  };

  // 🔒 未認証（ログイン前）の画面表示
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f4f1ea", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', serif" }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: "#ffffff", padding: "40px 30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #e2ddd3", textAlign: "center", width: "90%", maxWidth: "360px" }}>
          <span style={{ fontSize: "10px", color: "#6b7a6d", letterSpacing: "0.15em", display: "block", marginBottom: "5px" }}>RESTRICTED AREA</span>
          <h2 style={{ margin: "0 0 20px 0", color: "#2d4030", fontSize: "18px", fontWeight: "500" }}>あこ告 管理画面ログイン</h2>
          
          <input
            type="password"
            placeholder="パスワードを入力"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #d5cfc4", backgroundColor: "#faf9f6", fontSize: "14px", boxSizing: "border-box", marginBottom: "15px", textAlign: "center", outline: "none" }}
          />

          {errorMsg && <p style={{ color: "#c0392b", fontSize: "12px", margin: "-5px 0 15px 0", fontFamily: "sans-serif" }}>{errorMsg}</p>}

          <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#2d4030", color: "#ffffff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>
            ログイン
          </button>
        </form>
      </div>
    );
  }

  // 🔓 認証成功後の管理画面（以前と同じ画面）
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f1ea", color: "#2b332c", fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', serif" }}>
      {/* ヘッダー */}
      <header style={{ backgroundColor: "#ffffff", padding: "18px 30px", borderBottom: "1px solid #e2ddd3", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
        <div>
          <span style={{ fontSize: "10px", color: "#6b7a6d", letterSpacing: "0.15em", display: "block" }}>MANAGEMENT</span>
          <h1 style={{ margin: 0, fontSize: "18px", color: "#2d4030", fontWeight: "500" }}>あこ告 診断管理システム</h1>
        </div>
        <div style={{ fontFamily: "sans-serif" }}>
          <button
            onClick={() => setActiveTab("users")}
            style={{ padding: "8px 18px", marginRight: "10px", borderRadius: "4px", border: "1px solid #2d4030", backgroundColor: activeTab === "users" ? "#2d4030" : "#ffffff", color: activeTab === "users" ? "#ffffff" : "#2d4030", cursor: "pointer", fontSize: "13px" }}
          >
            ユーザー一覧・命式
          </button>
          <button
            onClick={() => setActiveTab("masters")}
            style={{ padding: "8px 18px", marginRight: "15px", borderRadius: "4px", border: "1px solid #2d4030", backgroundColor: activeTab === "masters" ? "#2d4030" : "#ffffff", color: activeTab === "masters" ? "#ffffff" : "#2d4030", cursor: "pointer", fontSize: "13px" }}
          >
            本質タイプマスター設定
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            style={{ padding: "8px 12px", borderRadius: "4px", border: "none", backgroundColor: "#e8e4db", color: "#6b7a6d", cursor: "pointer", fontSize: "12px" }}
          >
            ログアウト
          </button>
        </div>
      </header>

      <main style={{ padding: "35px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* ユーザー一覧 画面 */}
        {activeTab === "users" && (
          <div>
            <h2 style={{ color: "#2d4030", marginBottom: "20px", fontSize: "20px", fontWeight: "500" }}>👥 診断登録ユーザー一覧 ({users.length}名)</h2>
            <div style={{ display: "grid", gridTemplateColumns: selectedUser ? "1fr 1fr" : "1fr", gap: "25px" }}>
              <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "20px", border: "1px solid #e2ddd3", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", fontFamily: "sans-serif" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e8e4db", color: "#2d4030" }}>
                      <th style={{ padding: "12px 10px" }}>お名前</th>
                      <th style={{ padding: "12px 10px" }}>生年月日</th>
                      <th style={{ padding: "12px 10px" }}>本質</th>
                      <th style={{ padding: "12px 10px" }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid #f0ece1" }}>
                        <td style={{ padding: "12px 10px", fontWeight: "bold" }}>{u.name}</td>
                        <td style={{ padding: "12px 10px", color: "#666" }}>{u.birth_date} {u.birth_time || ""}</td>
                        <td style={{ padding: "12px 10px", color: "#2d4030", fontWeight: "bold" }}>【{u.element_type}】</td>
                        <td style={{ padding: "12px 10px" }}>
                          <button
                            onClick={() => setSelectedUser(u)}
                            style={{ backgroundColor: "#2d4030", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                          >
                            詳細・命式
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: "30px", color: "#8a968b" }}>
                          まだ診断データの登録がありません
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {selectedUser && (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "25px", border: "1px solid #d5cfc4", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e8e4db", paddingBottom: "12px" }}>
                    <h3 style={{ margin: 0, color: "#2d4030", fontSize: "18px", fontWeight: "500" }}>📜 {selectedUser.name} 様の命式詳細</h3>
                    <button onClick={() => setSelectedUser(null)} style={{ background: "none", border: "none", color: "#8a968b", cursor: "pointer", fontSize: "16px" }}>✕</button>
                  </div>

                  <div style={{ marginTop: "15px", fontSize: "13px", lineHeight: "1.8", backgroundColor: "#faf9f6", padding: "15px", borderRadius: "6px", border: "1px solid #e8e4db", fontFamily: "sans-serif" }}>
                    <p style={{ margin: "4px 0" }}><strong>生年月日:</strong> {selectedUser.birth_date} ({selectedUser.birth_time || "時間不明"})</p>
                    <p style={{ margin: "4px 0" }}><strong>性別:</strong> {selectedUser.gender}</p>
                    <p style={{ margin: "4px 0" }}><strong>日幹（本質タイプ）:</strong> <span style={{ fontSize: "16px", color: "#2d4030", fontWeight: "bold" }}>【{selectedUser.element_type}】</span></p>
                    <p style={{ margin: "4px 0" }}><strong>天中殺:</strong> {selectedUser.meishiki_data?.tenchusatsu || "子丑"}</p>
                    <p style={{ margin: "4px 0" }}><strong>運勢エネルギー合計:</strong> {selectedUser.meishiki_data?.totalEnergy || 22}</p>
                  </div>

                  <h4 style={{ color: "#2d4030", marginTop: "20px", marginBottom: "10px", fontSize: "14px", fontWeight: "600" }}>🎴 命式表データ</h4>
                  <div style={{ overflowX: "auto", fontFamily: "sans-serif" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "center", backgroundColor: "#faf9f6" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#2d4030", color: "#ffffff" }}>
                          <th style={{ padding: "8px" }}>柱</th><th>十幹</th><th>十二支</th><th>通変星</th><th>蔵干通変星</th><th>十二運星</th><th>エネルギー</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: "1px solid #e8e4db" }}>
                          <td style={{ padding: "8px" }}>年柱</td>
                          <td>{selectedUser.meishiki_data?.pillars?.year?.kan || "甲"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.year?.shi || "寅"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.year?.tsuhen || "正官"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.year?.zokanTsuhen || "印綬"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.year?.juniun || "死"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.year?.energy || 2}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #e8e4db" }}>
                          <td style={{ padding: "8px" }}>月柱</td>
                          <td>{selectedUser.meishiki_data?.pillars?.month?.kan || "辛"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.month?.shi || "未"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.month?.tsuhen || "食神"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.month?.zokanTsuhen || "偏官"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.month?.juniun || "冠帯"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.month?.energy || 10}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "8px" }}>日柱</td>
                          <td>{selectedUser.meishiki_data?.pillars?.day?.kan || "己"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.day?.shi || "未"}</td>
                          <td>-</td>
                          <td>{selectedUser.meishiki_data?.pillars?.day?.zokanTsuhen || "偏官"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.day?.juniun || "冠帯"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.day?.energy || 10}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 本質マスター設定 画面 */}
        {activeTab === "masters" && (
          <div>
            <h2 style={{ color: "#2d4030", marginBottom: "10px", fontSize: "20px", fontWeight: "500" }}>✨ 本質タイプマスター編集（甲〜癸）</h2>
            <p style={{ fontSize: "13px", color: "#6b7a6d", marginBottom: "25px", fontFamily: "sans-serif" }}>
              ここで編集した解説文やイメージテキストは、診断結果画面に即時反映されます。
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {masters.map((m) => (
                <div key={m.id} style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "20px", border: "1px solid #e2ddd3", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0, fontSize: "22px", color: "#2d4030", fontWeight: "500" }}>【 {m.id} 】<span style={{ fontSize: "13px", color: "#8a968b" }}>（{m.name_kana}）</span></h3>
                    <button
                      onClick={() => setEditingMaster(m)}
                      style={{ backgroundColor: "#2d4030", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontFamily: "sans-serif" }}
                    >
                      編集
                    </button>
                  </div>
                  <div style={{ marginTop: "15px", fontSize: "13px", color: "#4a574c", fontFamily: "sans-serif", lineHeight: "1.6" }}>
                    <p style={{ margin: "4px 0" }}><strong>イメージ:</strong> {m.short_image}</p>
                    <p style={{ margin: "4px 0" }}><strong>詳細解説:</strong> {m.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {editingMaster && (
              <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
                <form onSubmit={handleUpdateMaster} style={{ backgroundColor: "#ffffff", border: "1px solid #d5cfc4", borderRadius: "8px", padding: "30px", width: "90%", maxWidth: "500px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
                  <h3 style={{ color: "#2d4030", marginTop: 0, fontSize: "18px", fontWeight: "500" }}>【 {editingMaster.id} 】の文章を編集</h3>
                  
                  <div style={{ marginBottom: "15px", fontFamily: "sans-serif" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "#4a574c", marginBottom: "5px" }}>短いイメージ文</label>
                    <input
                      type="text"
                      value={editingMaster.short_image || ""}
                      onChange={(e) => setEditingMaster({ ...editingMaster, short_image: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d5cfc4", backgroundColor: "#faf9f6", color: "#2b332c", boxSizing: "border-box" }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px", fontFamily: "sans-serif" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "#4a574c", marginBottom: "5px" }}>詳細解説文（メッセージ）</label>
                    <textarea
                      rows={5}
                      value={editingMaster.description || ""}
                      onChange={(e) => setEditingMaster({ ...editingMaster, description: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d5cfc4", backgroundColor: "#faf9f6", color: "#2b332c", boxSizing: "border-box" }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", fontFamily: "sans-serif" }}>
                    <button type="button" onClick={() => setEditingMaster(null)} style={{ padding: "8px 16px", borderRadius: "4px", border: "1px solid #d5cfc4", backgroundColor: "#ffffff", color: "#4a574c", cursor: "pointer" }}>キャンセル</button>
                    <button type="submit" style={{ padding: "8px 16px", borderRadius: "4px", border: "none", backgroundColor: "#2d4030", color: "#ffffff", cursor: "pointer" }}>保存する</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
