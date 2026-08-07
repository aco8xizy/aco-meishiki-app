"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"users" | "masters">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [masters, setMasters] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editingMaster, setEditingMaster] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
    fetchMasters();
  }, []);

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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1e1b2e", color: "#f3e8ff", fontFamily: "sans-serif" }}>
      {/* ヘッダー */}
      <header style={{ backgroundColor: "#2e1065", padding: "15px 30px", borderBottom: "1px solid #581c87", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: "20px", color: "#fef08a" }}>🌙 あこ告 管理画面</h1>
        <div>
          <button
            onClick={() => setActiveTab("users")}
            style={{ padding: "8px 16px", marginRight: "10px", borderRadius: "6px", border: "none", backgroundColor: activeTab === "users" ? "#d97706" : "#4c1d95", color: "#fff", cursor: "pointer", fontWeight: "bold" }}
          >
            ユーザー一覧・命式
          </button>
          <button
            onClick={() => setActiveTab("masters")}
            style={{ padding: "8px 16px", borderRadius: "6px", border: "none", backgroundColor: activeTab === "masters" ? "#d97706" : "#4c1d95", color: "#fff", cursor: "pointer", fontWeight: "bold" }}
          >
            本質タイプマスター設定（甲〜癸）
          </button>
        </div>
      </header>

      <main style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* ユーザー一覧 画面 */}
        {activeTab === "users" && (
          <div>
            <h2 style={{ color: "#fef08a", marginBottom: "20px" }}>👥 診断登録ユーザー一覧 ({users.length}名)</h2>
            <div style={{ display: "grid", gridTemplateColumns: selectedUser ? "1fr 1fr" : "1fr", gap: "20px" }}>
              {/* 一覧テーブル */}
              <div style={{ backgroundColor: "#2e1065", borderRadius: "10px", padding: "20px", border: "1px solid #581c87" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #581c87", color: "#c084fc" }}>
                      <th style={{ padding: "10px" }}>お名前</th>
                      <th style={{ padding: "10px" }}>生年月日</th>
                      <th style={{ padding: "10px" }}>本質</th>
                      <th style={{ padding: "10px" }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid #3b0764" }}>
                        <td style={{ padding: "10px", fontWeight: "bold" }}>{u.name}</td>
                        <td style={{ padding: "10px" }}>{u.birth_date} {u.birth_time || ""}</td>
                        <td style={{ padding: "10px", color: "#fef08a" }}>【{u.element_type}】</td>
                        <td style={{ padding: "10px" }}>
                          <button
                            onClick={() => setSelectedUser(u)}
                            style={{ backgroundColor: "#7e22ce", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                          >
                            詳細・命式画像
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: "20px", color: "#a855f7" }}>
                          まだ診断データの登録がありません
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ユーザー詳細 & 命式確認画面 */}
              {selectedUser && (
                <div style={{ backgroundColor: "#2e1065", borderRadius: "10px", padding: "20px", border: "2px solid #d97706" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0, color: "#fef08a" }}>📜 {selectedUser.name} 様の命式詳細</h3>
                    <button onClick={() => setSelectedUser(null)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>✕ 閉じる</button>
                  </div>

                  <div style={{ marginTop: "15px", fontSize: "14px", lineHeight: "1.8", backgroundColor: "#3b0764", padding: "15px", borderRadius: "8px" }}>
                    <p><strong>生年月日:</strong> {selectedUser.birth_date} ({selectedUser.birth_time || "時間不明"})</p>
                    <p><strong>性別:</strong> {selectedUser.gender}</p>
                    <p><strong>日幹（本質タイプ）:</strong> <span style={{ fontSize: "18px", color: "#fef08a" }}>【{selectedUser.element_type}】</span></p>
                    <p><strong>天中殺:</strong> {selectedUser.meishiki_data?.tenchusatsu || "子丑"}</p>
                    <p><strong>運勢エネルギー合計:</strong> {selectedUser.meishiki_data?.totalEnergy || 22}</p>
                  </div>

                  <h4 style={{ color: "#c084fc", marginTop: "20px" }}>🎴 命式表データ</h4>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "center", backgroundColor: "#3b0764" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#4c1d95", color: "#fef08a" }}>
                          <th>柱</th><th>十幹</th><th>十二支</th><th>通変星</th><th>蔵干通変星</th><th>十二運星</th><th>エネルギー</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>年柱</td>
                          <td>{selectedUser.meishiki_data?.pillars?.year?.kan || "甲"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.year?.shi || "寅"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.year?.tsuhen || "正官"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.year?.zokanTsuhen || "印綬"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.year?.juniun || "死"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.year?.energy || 2}</td>
                        </tr>
                        <tr>
                          <td>月柱</td>
                          <td>{selectedUser.meishiki_data?.pillars?.month?.kan || "辛"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.month?.shi || "未"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.month?.tsuhen || "食神"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.month?.zokanTsuhen || "偏官"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.month?.juniun || "冠帯"}</td>
                          <td>{selectedUser.meishiki_data?.pillars?.month?.energy || 10}</td>
                        </tr>
                        <tr>
                          <td>日柱</td>
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
            <h2 style={{ color: "#fef08a", marginBottom: "20px" }}>✨ 本質タイプマスター編集（甲〜癸）</h2>
            <p style={{ fontSize: "14px", color: "#c084fc", marginBottom: "20px" }}>
              ここで編集した解説文やイメージテキストは、診断結果画面に即時反映されます。
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {masters.map((m) => (
                <div key={m.id} style={{ backgroundColor: "#2e1065", borderRadius: "10px", padding: "20px", border: "1px solid #581c87" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0, fontSize: "24px", color: "#fef08a" }}>【 {m.id} 】<span style={{ fontSize: "14px", color: "#c084fc" }}>（{m.name_kana}）</span></h3>
                    <button
                      onClick={() => setEditingMaster(m)}
                      style={{ backgroundColor: "#d97706", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                    >
                      編集
                    </button>
                  </div>
                  <div style={{ marginTop: "15px", fontSize: "13px", color: "#e9d5ff" }}>
                    <p><strong>イメージ:</strong> {m.short_image}</p>
                    <p><strong>詳細解説:</strong> {m.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 編集モーダル */}
            {editingMaster && (
              <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
                <form onSubmit={handleUpdateMaster} style={{ backgroundColor: "#2e1065", border: "2px solid #fef08a", borderRadius: "12px", padding: "30px", width: "90%", maxWidth: "500px" }}>
                  <h3 style={{ color: "#fef08a", marginTop: 0 }}>【 {editingMaster.id} 】の文章を編集</h3>
                  
                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", fontSize: "14px", marginBottom: "5px" }}>短いイメージ文</label>
                    <input
                      type="text"
                      value={editingMaster.short_image || ""}
                      onChange={(e) => setEditingMaster({ ...editingMaster, short_image: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #581c87", backgroundColor: "#1e1b2e", color: "#fff" }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "14px", marginBottom: "5px" }}>詳細解説文（「あこ告」の世界観）</label>
                    <textarea
                      rows={5}
                      value={editingMaster.description || ""}
                      onChange={(e) => setEditingMaster({ ...editingMaster, description: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #581c87", backgroundColor: "#1e1b2e", color: "#fff" }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button type="button" onClick={() => setEditingMaster(null)} style={{ padding: "10px 20px", borderRadius: "6px", border: "none", backgroundColor: "#4c1d95", color: "#fff", cursor: "pointer" }}>キャンセル</button>
                    <button type="submit" style={{ padding: "10px 20px", borderRadius: "6px", border: "none", backgroundColor: "#d97706", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>保存する</button>
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
