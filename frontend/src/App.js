import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#050e1a",
    color: "#e2e8f0",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 28px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(8,18,34,0.95)",
    backdropFilter: "blur(12px)",
    flexShrink: 0,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #00d4a0, #0094d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  },
  logoText: {
    fontSize: "17px",
    fontWeight: "700",
    letterSpacing: "-0.3px",
    color: "#f1f5f9",
  },
  logoBadge: {
    fontSize: "10px",
    background: "rgba(0,212,160,0.15)",
    color: "#00d4a0",
    border: "1px solid rgba(0,212,160,0.3)",
    borderRadius: "4px",
    padding: "2px 6px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#00d4a0",
    boxShadow: "0 0 8px rgba(0,212,160,0.6)",
  },
  statusText: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
  },
  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(255,255,255,0.1) transparent",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    padding: "60px 20px",
    textAlign: "center",
  },
  emptyIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, rgba(0,212,160,0.15), rgba(0,148,212,0.15))",
    border: "1px solid rgba(0,212,160,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#f1f5f9",
    margin: 0,
  },
  emptySubtitle: {
    fontSize: "14px",
    color: "#475569",
    maxWidth: "320px",
    lineHeight: "1.6",
    margin: 0,
  },
  suggestionChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "center",
    marginTop: "8px",
  },
  chip: {
    padding: "7px 14px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "#94a3b8",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  userBubble: {
    display: "flex",
    justifyContent: "flex-end",
  },
  userText: {
    maxWidth: "70%",
    background: "linear-gradient(135deg, #00b87a, #0088c4)",
    padding: "12px 16px",
    borderRadius: "18px 18px 4px 18px",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#fff",
    fontWeight: "450",
  },
  botWrapper: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  botAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #00d4a0, #0094d4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    flexShrink: 0,
    marginTop: "2px",
  },
  botCard: {
    flex: 1,
    background: "rgba(14,28,50,0.7)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "4px 18px 18px 18px",
    padding: "18px 20px",
    maxWidth: "calc(100% - 44px)",
  },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    color: "#00d4a0",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  overview: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#cbd5e1",
    marginBottom: "18px",
  },
  insightsList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 18px 0",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  insightItem: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    fontSize: "13.5px",
    lineHeight: "1.6",
    color: "#94a3b8",
  },
  insightBullet: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#00d4a0",
    marginTop: "6px",
    flexShrink: 0,
  },
  trialsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "18px",
  },
  trialTag: {
    padding: "8px 12px",
    background: "rgba(0,148,212,0.08)",
    border: "1px solid rgba(0,148,212,0.2)",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#7dd3fc",
    lineHeight: "1.5",
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.06)",
    margin: "14px 0",
  },
  sourcesGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  sourceLink: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "7px 10px",
    borderRadius: "7px",
    background: "rgba(255,255,255,0.03)",
    textDecoration: "none",
    fontSize: "13px",
    color: "#7dd3fc",
    transition: "background 0.15s",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  sourceYear: {
    marginLeft: "auto",
    fontSize: "11px",
    color: "#475569",
    flexShrink: 0,
  },
  loadingBubble: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  loadingDots: {
    display: "flex",
    gap: "4px",
    padding: "14px 18px",
    background: "rgba(14,28,50,0.7)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "4px 18px 18px 18px",
  },
  dot: (delay) => ({
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#00d4a0",
    animation: `pulse 1.4s ${delay}s infinite`,
  }),
  inputArea: {
    padding: "16px 20px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(8,18,34,0.95)",
    flexShrink: 0,
  },
  diseaseRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  diseaseLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600",
    letterSpacing: "0.4px",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  diseaseInput: {
    flex: 1,
    padding: "8px 12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    color: "#e2e8f0",
    fontSize: "13px",
    outline: "none",
    maxWidth: "280px",
  },
  queryRow: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-end",
  },
  queryInput: {
    flex: 1,
    padding: "13px 16px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#f1f5f9",
    fontSize: "14px",
    outline: "none",
    resize: "none",
    fontFamily: "inherit",
    lineHeight: "1.5",
  },
  sendBtn: (disabled) => ({
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    background: disabled
      ? "rgba(0,212,160,0.2)"
      : "linear-gradient(135deg, #00b87a, #0088c4)",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s",
  }),
};

const SUGGESTIONS = [
  "Latest treatments for Type 2 Diabetes",
  "CRISPR therapy in cancer",
  "mRNA vaccine mechanisms",
  "Alzheimer's drug trials 2024",
];

export default function App() {
  const [query, setQuery] = useState("");
  const [disease, setDisease] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendQuery = async (text) => {
  const q = text || query;
  if (!q.trim()) return;

  setMessages((prev) => [...prev, { type: "user", text: q }]);
  setQuery("");
  setLoading(true);

  const API_URL = "https://curalink-1-ltoq.onrender.com/api/query";

  try {

    let res;

    try {
      res = await axios.post(API_URL, {
        userId: "user1",
        disease,
        query: q,
      });
    } catch (err) {
      console.log("Retrying request...");
      await new Promise((r) => setTimeout(r, 2000)); // wait 2 sec

      res = await axios.post(API_URL, {
        userId: "user1",
        disease,
        query: q,
      });
    }

    setMessages((prev) => [...prev, { type: "bot", data: res.data }]);
  } catch (err) {
    console.error("FINAL ERROR:", err);

    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        data: {
          overview:
            "⚠️ Server is waking up (first request may take 30–60 seconds). Please try again.",
          insights: [],
          clinical_trials_summary: [],
          sources: [],
        },
      },
    ]);
  }

  setLoading(false);
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuery();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .chip:hover { background: rgba(0,212,160,0.08) !important; border-color: rgba(0,212,160,0.3) !important; color: #00d4a0 !important; }
        .source-link:hover { background: rgba(0,148,212,0.08) !important; }
        .send-btn:hover:not(:disabled) { opacity: 0.88; transform: scale(0.97); }
        textarea::placeholder, input::placeholder { color: #334155; }
      `}</style>

      <div style={styles.root}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🧬</div>
            <span style={styles.logoText}>Curalink</span>
            <span style={styles.logoBadge}>AI</span>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.statusDot} />
            <span style={styles.statusText}>Online</span>
          </div>
        </div>

        {/* Chat */}
        <div style={styles.chatArea}>
          {messages.length === 0 && !loading && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🔬</div>
              <p style={styles.emptyTitle}>Medical Research Assistant</p>
              <p style={styles.emptySubtitle}>
                Ask about treatments, clinical trials, drug mechanisms, or the latest
                medical research findings.
              </p>
              <div style={styles.suggestionChips}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="chip"
                    style={styles.chip}
                    onClick={() => sendQuery(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i}>
              {msg.type === "user" && (
                <div style={styles.userBubble}>
                  <div style={styles.userText}>{msg.text}</div>
                </div>
              )}

              {msg.type === "bot" && (
                <div style={styles.botWrapper}>
                  <div style={styles.botAvatar}>🧬</div>
                  <div style={styles.botCard}>
                    {/* Overview */}
                    {msg.data.overview && (
                      <>
                        <div style={styles.sectionLabel}>
                          <span>📌</span> Overview
                        </div>
                        <p style={styles.overview}>{msg.data.overview}</p>
                        {msg.data.sources?.length > 0 && (
                          <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "11px",
                            color: "#00d4a0",
                            background: "rgba(0,212,160,0.08)",
                            border: "1px solid rgba(0,212,160,0.2)",
                            borderRadius: "20px",
                            padding: "3px 10px",
                            marginBottom: "14px",
                            fontWeight: "600",
                            letterSpacing: "0.3px",
                          }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00d4a0", display: "inline-block" }} />
                            Based on {msg.data.sources.length} research paper{msg.data.sources.length !== 1 ? "s" : ""}
                          </div>
                        )}
                      </>
                    )}

                    {/* Insights */}
                    {msg.data.insights?.length > 0 && (
                      <>
                        <div style={styles.sectionLabel}>
                          <span>💡</span> Key Insights
                        </div>
                        <ul style={styles.insightsList}>
                          {msg.data.insights.map((item, idx) => (
                            <li key={idx} style={styles.insightItem}>
                              <div style={styles.insightBullet} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {/* Trials */}
                    <div style={styles.divider} />
                    <div style={styles.sectionLabel}>
                      <span>🧪</span> Clinical Trials
                    </div>
                    {msg.data.clinical_trials_summary?.length > 0 ? (
                      <div style={styles.trialsGrid}>
                        {msg.data.clinical_trials_summary.map((t, idx) => (
                          <div key={idx} style={styles.trialTag}>
                            {t}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        fontSize: "13px",
                        color: "#475569",
                        padding: "10px 12px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px dashed rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        marginBottom: "4px",
                      }}>
                        No relevant clinical trials found for this query.
                      </div>
                    )}

                    {/* Sources */}
                    {msg.data.sources?.length > 0 && (
                      <>
                        <div style={styles.divider} />
                        <div style={styles.sectionLabel}>
                          <span>📚</span> Sources
                        </div>
                        <div style={styles.sourcesGrid}>
                          {msg.data.sources.map((s, idx) => (
                            <a
                              key={idx}
                              href={s.url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="source-link"
                              style={styles.sourceLink}
                            >
                              <span>↗</span>
                              <span style={{ flex: 1 }}>{s.title}</span>
                              {s.year && (
                                <span style={styles.sourceYear}>{s.year}</span>
                              )}
                            </a>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={styles.loadingBubble}>
              <div style={styles.botAvatar}>🧬</div>
              <div style={styles.loadingDots}>
                <div style={styles.dot(0)} />
                <div style={styles.dot(0.2)} />
                <div style={styles.dot(0.4)} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div style={styles.inputArea}>
          <div style={styles.diseaseRow}>
            <span style={styles.diseaseLabel}>Disease Filter</span>
            <input
              placeholder="e.g. Diabetes, Cancer, Alzheimer's..."
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              style={styles.diseaseInput}
            />
          </div>
          <div style={styles.queryRow}>
            <textarea
              rows={1}
              placeholder="Ask about treatments, trials, mechanisms..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.queryInput}
            />
            <button
              className="send-btn"
              style={styles.sendBtn(!query.trim() || loading)}
              onClick={() => sendQuery()}
              disabled={!query.trim() || loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}