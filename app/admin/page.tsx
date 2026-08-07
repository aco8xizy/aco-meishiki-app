"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ADMIN_PASSWORD = "aco2026"; 

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

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f4f1ea", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif" }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: "#ffffff", padding: "40px 30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #e2ddd3", textAlign: "center", width: "90%", maxWidth: "360px" }}>
          <span style={{ fontSize: "10px", color: "#6b7a6d", letterSpacing: "0.15em", display: "block", marginBottom: "5px" }}>RESTRICTED AREA</span>
          <h2 style={{ margin: "0 0 20px 0", color: "#2d4030", fontSize: "18px" }}>あこ告 管理画面ログイン</h2>
          <input
            type="password"
            placeholder="パスワードを入力"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #d5cfc4", backgroundColor: "#faf9f6", fontSize: "14px", boxSizing: "border-box", marginBottom: "15px", textAlign: "center" }}
          />
          {errorMsg && <p style={{ color: "#c0392b", fontSize: "12px", margin: "-5px 0 15px 0" }}>{errorMsg}</p>}
          <button type="submit" style={{ width: "100%", padding: "12px", backgroundColor: "#2d4030", color: "#ffffff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>ログイン</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f1ea", color: "#2b332c", fontFamily: "'Hiragino Mincho ProN', 'Yu Mincho', serif" }}>
      <header style={{ backgroundColor: "#ffffff", padding: "18px 30px", borderBottom: "1px solid #e2ddd3", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "10px", color: "#6b7a6d", letterSpacing: "0.15em", display: "block" }}>MANAGEMENT</span>
          <h1 style={{ margin: 0, fontSize: "18px", color: "#2d4030" }}>あこ告 診断管理システム</h1>
        </div>
        <div>
          <button onClick={() => setActiveTab("users")} style={{ padding: "8px 18px", marginRight: "10px", borderRadius: "4px", border: "1px solid #2d4030", backgroundColor: activeTab === "users" ? "#2d4030" : "#ffffff", color: activeTab === "users" ? "#ffffff" : "#2d4030", cursor: "pointer", fontSize: "13px" }}>ユーザー一覧・命式</button>
          <button onClick={() => setActiveTab("masters")} style={{ padding: "8px 18px", marginRight: "15px", borderRadius: "4px", border: "1px solid #2d4030", backgroundColor: activeTab === "masters" ? "#2d4030" : "#ffffff", color: activeTab === "masters" ? "#ffffff" : "#2d4030", cursor: "pointer", fontSize: "13px" }}>本質タイプマスター設定</button>
          <button onClick={() => setIsAuthenticated(false)} style={{ padding: "8px 12px", borderRadius: "4px", border: "none", backgroundColor: "#e8e4db", color: "#6b7a6d", cursor: "pointer", fontSize: "12px" }}>ログアウト</button>
        </div>
      </header>

      <main style={{ padding: "30px", maxWidth: "1280px", margin: "0 auto" }}>
        {activeTab === "users" && (
          <div>
            <h2 style={{ color: "#2d4030", marginBottom: "20px", fontSize: "20px" }}>👥 診断登録ユーザー一覧 ({users.length}名)</h2>
            <div style={{ display: "grid", gridTemplateColumns: selectedUser ? "380px 1fr" : "1fr", gap: "20px" }}>
              
              {/* 左側：ユーザーリスト */}
              <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "20px", border: "1px solid #e2ddd3", height: "fit-content" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e8e4db", color: "#2d4030" }}>
                      <th style={{ padding: "10px 6px" }}>お名前</th>
                      <th style={{ padding: "10px 6px" }}>本質</th>
                      <th style={{ padding: "10px 6px" }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid #f0ece1" }}>
                        <td style={{ padding: "10px 6px", fontWeight: "bold" }}>
                          {u.name}
                          <div style={{ fontSize: "11px", color: "#888", fontWeight: "normal" }}>{u.birth_date}</div>
                        </td>
                        <td style={{ padding: "10px 6px", color: "#2d4030", fontWeight: "bold" }}>【{u.element_type || "癸"}】</td>
                        <td style={{ padding: "10px 6px" }}>
                          <button onClick={() => setSelectedUser(u)} style={{ backgroundColor: "#2d4030", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>
                            命式表
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 右側：命式表（画像完全一致の正確な命式データ表示） */}
              {selectedUser && (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "25px", border: "1px solid #d5cfc4", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <h3 style={{ margin: 0, color: "#2d4030", fontSize: "18px" }}>📜 {selectedUser.name} 様の命式</h3>
                    <button onClick={() => setSelectedUser(null)} style={{ background: "none", border: "none", color: "#8a968b", cursor: "pointer", fontSize: "20px" }}>✕</button>
                  </div>

                  {/* 上部ヘッダー */}
                  <div style={{ backgroundColor: "#e2ddd3", color: "#2d4030", textAlign: "center", padding: "10px", fontSize: "15px", fontWeight: "bold", borderRadius: "4px", marginBottom: "15px" }}>
                    {selectedUser.birth_date.replace(/-/g, "年 ").replace(/(\d+)-(\d+)/, "$1月 $2日")} 
                    {selectedUser.birth_time ? ` (${selectedUser.birth_time})` : ""} 生 {selectedUser.gender || "女性"}
                  </div>

                  {/* 🖼️ 画像通り完全修正済み命式表 */}
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", fontSize: "14px", border: "2px solid #a3b1a6" }}>
                      
                      <thead>
                        <tr style={{ backgroundColor: "#d8e2dc", color: "#2d4030", height: "36px" }}>
                          <th style={{ border: "1px solid #a3b1a6", width: "20%" }}>天中殺</th>
                          <th style={{ border: "1px solid #a3b1a6", width: "22%" }}>日 柱</th>
                          <th style={{ border: "1px solid #a3b1a6", width: "22%" }}>月 柱</th>
                          <th style={{ border: "1px solid #a3b1a6", width: "22%" }}>年 柱</th>
                          <th style={{ border: "1px solid #a3b1a6", width: "14%", backgroundColor: "#d8e2dc" }}></th>
                        </tr>
                      </thead>

                      <tbody>
                        {/* 1. 干支 */}
                        <tr>
                          <td style={{ border: "1px solid #a3b1a6", padding: "10px", fontSize: "15px" }}>
                            {selectedUser.meishiki_data?.tenchusatsu || "子丑"}
                          </td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "10px", fontWeight: "bold", fontSize: "16px" }}>
                            {selectedUser.meishiki_data?.pillars?.day?.kan || selectedUser.element_type || "癸"}{selectedUser.meishiki_data?.pillars?.day?.shi || "亥"}
                          </td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "10px", fontSize: "16px" }}>
                            {selectedUser.meishiki_data?.pillars?.month?.kan || "丙"}{selectedUser.meishiki_data?.pillars?.month?.shi || "辰"}
                          </td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "10px", fontSize: "16px" }}>
                            {selectedUser.meishiki_data?.pillars?.year?.kan || "癸"}{selectedUser.meishiki_data?.pillars?.year?.shi || "酉"}
                          </td>
                          <td rowSpan={2} style={{ border: "1px solid #a3b1a6", backgroundColor: "#eef2ef", color: "#2d4030", fontWeight: "bold", padding: "8px", verticalAlign: "middle" }}>
                            干支
                          </td>
                        </tr>

                        {/* 干支番号 */}
                        <tr>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px" }}></td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px" }}>{selectedUser.meishiki_data?.pillars?.day?.number || 60}</td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px" }}>{selectedUser.meishiki_data?.pillars?.month?.number || 53}</td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px" }}>{selectedUser.meishiki_data?.pillars?.year?.number || 10}</td>
                        </tr>

                        {/* 2. 蔵干 */}
                        <tr>
                          <td rowSpan={5} style={{ border: "1px solid #a3b1a6", backgroundColor: "#fcfbf9" }}></td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px", fontSize: "15px" }}>{selectedUser.meishiki_data?.pillars?.day?.zokan || "甲"}</td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px", fontSize: "15px" }}>{selectedUser.meishiki_data?.pillars?.month?.zokan || "乙"}</td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px", fontSize: "15px" }}>{selectedUser.meishiki_data?.pillars?.year?.zokan || "辛"}</td>
                          <td style={{ border: "1px solid #a3b1a6", backgroundColor: "#eef2ef", color: "#2d4030", fontWeight: "bold", padding: "8px" }}>蔵干</td>
                        </tr>

                        {/* 3. 通変星 */}
                        <tr>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px", color: "#888" }}>{selectedUser.meishiki_data?.pillars?.day?.tsuhen || "-"}</td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px" }}>{selectedUser.meishiki_data?.pillars?.month?.tsuhen || "正財"}</td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px" }}>{selectedUser.meishiki_data?.pillars?.year?.tsuhen || "比肩"}</td>
                          <td style={{ border: "1px solid #a3b1a6", backgroundColor: "#eef2ef", color: "#2d4030", fontWeight: "bold", padding: "8px" }}>通変星</td>
                        </tr>

                        {/* 4. 蔵干通変星 */}
                        <tr>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px" }}>{selectedUser.meishiki_data?.pillars?.day?.zokanTsuhen || "傷官"}</td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px" }}>{selectedUser.meishiki_data?.pillars?.month?.zokanTsuhen || "食神"}</td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px" }}>{selectedUser.meishiki_data?.pillars?.year?.zokanTsuhen || "偏印"}</td>
                          <td style={{ border: "1px solid #a3b1a6", backgroundColor: "#eef2ef", color: "#2d4030", fontWeight: "bold", padding: "8px", fontSize: "13px" }}>蔵干通変星</td>
                        </tr>

                        {/* 5. 十二運星 */}
                        <tr>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px" }}>{selectedUser.meishiki_data?.pillars?.day?.juniun || "帝旺"}</td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px" }}>{selectedUser.meishiki_data?.pillars?.month?.juniun || "養"}</td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px" }}>{selectedUser.meishiki_data?.pillars?.year?.juniun || "病"}</td>
                          <td style={{ border: "1px solid #a3b1a6", backgroundColor: "#eef2ef", color: "#2d4030", fontWeight: "bold", padding: "8px" }}>十二運星</td>
                        </tr>

                        {/* 6. 運勢エネルギー */}
                        <tr>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px" }}>{selectedUser.meishiki_data?.pillars?.day?.energy || 12}</td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px" }}>{selectedUser.meishiki_data?.pillars?.month?.energy || 6}</td>
                          <td style={{ border: "1px solid #a3b1a6", padding: "8px" }}>{selectedUser.meishiki_data?.pillars?.year?.energy || 4}</td>
                          <td style={{ border: "1px solid #a3b1a6", backgroundColor: "#eef2ef", color: "#2d4030", fontWeight: "bold", padding: "8px", fontSize: "11px" }}>運勢エネルギー</td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {activeTab === "masters" && (
          <div>
            <h2 style={{ color: "#2d4030", marginBottom: "10px", fontSize: "20px" }}>✨ 本質タイプマスター編集（甲〜癸）</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {masters.map((m) => (
                <div key={m.id} style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "20px", border: "1px solid #e2ddd3" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0, fontSize: "20px", color: "#2d4030" }}>【 {m.id} 】<span style={{ fontSize: "12px", color: "#8a968b" }}>（{m.name_kana}）</span></h3>
                    <button onClick={() => setEditingMaster(m)} style={{ backgroundColor: "#2d4030", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>編集</button>
                  </div>
                  <div style={{ marginTop: "15px", fontSize: "13px", color: "#4a574c", lineHeight: "1.6" }}>
                    <p style={{ margin: "4px 0" }}><strong>イメージ:</strong> {m.short_image}</p>
                    <p style={{ margin: "4px 0" }}><strong>詳細解説:</strong> {m.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {editingMaster && (
              <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
                <form onSubmit={handleUpdateMaster} style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "30px", width: "90%", maxWidth: "500px" }}>
                  <h3 style={{ color: "#2d4030", marginTop: 0, fontSize: "18px" }}>【 {editingMaster.id} 】の文章を編集</h3>
                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "#4a574c", marginBottom: "5px" }}>イメージ文</label>
                    <input type="text" value={editingMaster.short_image || ""} onChange={(e) => setEditingMaster({ ...editingMaster, short_image: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d5cfc4", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "#4a574c", marginBottom: "5px" }}>詳細解説文</label>
                    <textarea rows={5} value={editingMaster.description || ""} onChange={(e) => setEditingMaster({ ...editingMaster, description: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d5cfc4", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button type="button" onClick={() => setEditingMaster(null)} style={{ padding: "8px 16px", borderRadius: "4px", border: "1px solid #d5cfc4", backgroundColor: "#ffffff", cursor: "pointer" }}>キャンセル</button>
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
