import { useState, useEffect, useRef } from "react";

const questions = [
  { id: 1, a: "🏖️ Never work again but live on a beach with no internet", b: "💰 Make $1M/year but work 80hrs/week forever", category: "Life" },
  { id: 2, a: "🐉 Ride a dragon once", b: "🦁 Have a lion as a loyal pet forever", category: "Fantasy" },
  { id: 3, a: "⏰ Go back 10 years knowing what you know now", b: "⚡ Skip 10 years into the future", category: "Time" },
  { id: 4, a: "🌍 Travel anywhere free, but always alone", b: "🏠 Stay home forever but with your best people", category: "Life" },
  { id: 5, a: "🧠 Be the smartest person in any room", b: "😍 Be the most attractive person in any room", category: "Power" },
  { id: 6, a: "🔇 Lose the ability to speak", b: "🙈 Lose the ability to read", category: "Senses" },
  { id: 7, a: "🦸 Have invisibility", b: "🚀 Have the power to fly", category: "Power" },
  { id: 8, a: "🎵 Every song you hear gets stuck in your head for 24 hrs", b: "📱 Your search history is public to everyone you know", category: "Torture" },
  { id: 9, a: "🍕 Eat your favorite food for every meal forever", b: "🍽️ Try a new random food every meal but never repeat", category: "Food" },
  { id: 10, a: "💤 Only need 2 hours of sleep per night", b: "💪 Never get sick or injured again", category: "Body" },
];

const AD_PLACEHOLDER = () => (
  <div style={{
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    border: "1px solid #ffd70033",
    borderRadius: "12px",
    padding: "12px 20px",
    textAlign: "center",
    fontSize: "11px",
    color: "#ffd700aa",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontFamily: "'Courier New', monospace",
    marginBottom: "16px",
  }}>
    📢 Advertisement · <span style={{ color: "#ffd700" }}>Your ad here</span> · Monetize this slot
  </div>
);

const PREMIUM_PERKS = [
  "No ads, ever",
  "Unlock 500+ exclusive questions",
  "See your full vote history",
  "Create & share custom questions",
  "Advanced stats & analytics",
];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [votes, setVotes] = useState({}); // { qId: { a: 120, b: 80 } }
  const [userChoice, setUserChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [streak, setStreak] = useState(0);
  const [animateIn, setAnimateIn] = useState(true);
  const [choiceAnim, setChoiceAnim] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const totalAnswered = Object.keys(votes).length;

  const q = questions[current];

  // Simulate existing votes
  useEffect(() => {
    const fake = {};
    questions.forEach(q => {
      const total = Math.floor(Math.random() * 8000) + 2000;
      const aPct = 30 + Math.random() * 40;
      fake[q.id] = { a: Math.floor(total * aPct / 100), b: Math.floor(total * (1 - aPct / 100)) };
    });
    setVotes(fake);
  }, []);

  const handleVote = (side) => {
    if (userChoice) return;
    setChoiceAnim(side);
    setUserChoice(side);
    setVotes(prev => ({
      ...prev,
      [q.id]: {
        ...prev[q.id],
        [side]: (prev[q.id]?.[side] || 0) + 1,
      }
    }));
    setTimeout(() => setShowResult(true), 400);
    setStreak(s => s + 1);
  };

  const handleNext = () => {
    if (totalAnswered >= 3 && !isPremium && (current + 1) % 5 === 4) {
      setShowPremium(true);
      return;
    }
    setAnimateIn(false);
    setTimeout(() => {
      setCurrent(c => (c + 1) % questions.length);
      setUserChoice(null);
      setShowResult(false);
      setChoiceAnim(null);
      setAnimateIn(true);
    }, 250);
  };

  const v = votes[q?.id] || { a: 0, b: 0 };
  const total = v.a + v.b;
  const aPct = total ? Math.round(v.a / total * 100) : 50;
  const bPct = 100 - aPct;

  const styles = {
    app: {
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'Georgia', serif",
      color: "#f0e6d3",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0 16px 40px",
      position: "relative",
      overflow: "hidden",
    },
    noise: {
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
      pointerEvents: "none", zIndex: 0,
    },
    header: {
      width: "100%", maxWidth: "560px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "20px 0 10px",
      borderBottom: "1px solid #ffffff11",
      marginBottom: "8px",
      position: "relative", zIndex: 1,
    },
    logo: {
      fontSize: "18px", fontWeight: "bold",
      letterSpacing: "0.05em",
      color: "#ffd700",
      fontFamily: "'Georgia', serif",
    },
    streakBadge: {
      background: "#ffd70022",
      border: "1px solid #ffd70055",
      borderRadius: "20px",
      padding: "4px 12px",
      fontSize: "12px",
      color: "#ffd700",
      letterSpacing: "1px",
    },
    premiumBtn: {
      background: "linear-gradient(135deg, #ffd700, #ff8c00)",
      color: "#0a0a0f",
      border: "none",
      borderRadius: "20px",
      padding: "6px 14px",
      fontSize: "11px",
      fontWeight: "bold",
      cursor: "pointer",
      letterSpacing: "1px",
      textTransform: "uppercase",
    },
    card: {
      width: "100%", maxWidth: "560px",
      background: "linear-gradient(160deg, #111118 0%, #0d0d14 100%)",
      border: "1px solid #ffffff18",
      borderRadius: "20px",
      padding: "28px 24px",
      position: "relative",
      zIndex: 1,
      transition: "opacity 0.25s, transform 0.25s",
      opacity: animateIn ? 1 : 0,
      transform: animateIn ? "translateY(0)" : "translateY(12px)",
      boxShadow: "0 20px 60px #00000088",
    },
    category: {
      fontSize: "10px",
      letterSpacing: "3px",
      textTransform: "uppercase",
      color: "#ffd70099",
      marginBottom: "16px",
      fontFamily: "'Courier New', monospace",
    },
    title: {
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "24px",
      color: "#f0e6d3",
      lineHeight: 1.3,
    },
    choicesRow: {
      display: "flex",
      gap: "12px",
      marginBottom: "20px",
    },
    choiceBtn: (side, chosen) => ({
      flex: 1,
      padding: "20px 14px",
      borderRadius: "14px",
      border: userChoice === side
        ? "2px solid #ffd700"
        : userChoice
          ? "2px solid #ffffff11"
          : "2px solid #ffffff22",
      background: userChoice === side
        ? "linear-gradient(135deg, #ffd70022, #ff8c0011)"
        : userChoice
          ? "#ffffff06"
          : "#ffffff0d",
      color: userChoice && userChoice !== side ? "#ffffff44" : "#f0e6d3",
      fontSize: "14px",
      lineHeight: 1.5,
      cursor: userChoice ? "default" : "pointer",
      textAlign: "center",
      transition: "all 0.3s",
      transform: choiceAnim === side ? "scale(1.03)" : "scale(1)",
    }),
    resultBar: (pct, side) => ({
      height: "6px",
      borderRadius: "3px",
      background: side === "a"
        ? `linear-gradient(90deg, #ffd700 ${pct}%, #ffffff11 ${pct}%)`
        : `linear-gradient(90deg, #ff6b6b ${pct}%, #ffffff11 ${pct}%)`,
      marginTop: "8px",
      transition: "all 0.8s cubic-bezier(.4,0,.2,1)",
    }),
    pctLabel: (side) => ({
      fontSize: "24px",
      fontWeight: "bold",
      color: side === "a" ? "#ffd700" : "#ff6b6b",
      fontFamily: "'Courier New', monospace",
    }),
    nextBtn: {
      width: "100%",
      padding: "16px",
      background: "linear-gradient(135deg, #ffd700, #ff8c00)",
      color: "#0a0a0f",
      border: "none",
      borderRadius: "14px",
      fontSize: "15px",
      fontWeight: "bold",
      cursor: "pointer",
      letterSpacing: "1px",
      marginTop: "8px",
      transition: "transform 0.15s",
    },
    overlay: {
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "#00000099",
      backdropFilter: "blur(8px)",
      zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    },
    modal: {
      background: "linear-gradient(160deg, #13131f, #0d0d14)",
      border: "1px solid #ffd70044",
      borderRadius: "24px",
      padding: "36px 28px",
      maxWidth: "400px",
      width: "100%",
      textAlign: "center",
      boxShadow: "0 0 80px #ffd70022",
    },
    shareRow: {
      display: "flex", gap: "10px", justifyContent: "center", marginTop: "16px", flexWrap: "wrap",
    },
    shareBtn: (color) => ({
      padding: "10px 20px",
      background: color,
      border: "none",
      borderRadius: "10px",
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer",
      fontSize: "13px",
    }),
  };

  return (
    <div style={styles.app}>
      <div style={styles.noise} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>⚡ WYR</div>
        <div style={styles.streakBadge}>🔥 {streak} streak</div>
        {!isPremium && (
          <button style={styles.premiumBtn} onClick={() => setShowPremium(true)}>
            Go Pro
          </button>
        )}
        {isPremium && (
          <div style={{ ...styles.streakBadge, borderColor: "#ffd700", color: "#ffd700" }}>✨ PRO</div>
        )}
      </div>

      {/* Progress */}
      <div style={{ width: "100%", maxWidth: "560px", marginBottom: "16px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: "3px", borderRadius: "2px",
              background: i < current ? "#ffd700" : i === current ? "#ffd70055" : "#ffffff11",
              transition: "background 0.4s",
            }} />
          ))}
        </div>
        <div style={{ fontSize: "10px", color: "#ffffff44", marginTop: "6px", letterSpacing: "1px", fontFamily: "monospace" }}>
          {current + 1} / {questions.length}
        </div>
      </div>

      {/* Ad (top, hidden for premium) */}
      {!isPremium && <div style={{ width: "100%", maxWidth: "560px", position: "relative", zIndex: 1 }}><AD_PLACEHOLDER /></div>}

      {/* Question Card */}
      <div style={styles.card}>
        <div style={styles.category}>#{q.category}</div>
        <div style={styles.title}>Would You Rather…</div>

        <div style={styles.choicesRow}>
          {/* Option A */}
          <div style={{ flex: 1 }}>
            <button style={styles.choiceBtn("a")} onClick={() => handleVote("a")}>
              {q.a}
            </button>
            {showResult && (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <div style={styles.pctLabel("a")}>{aPct}%</div>
                <div style={styles.resultBar(aPct, "a")} />
                <div style={{ fontSize: "10px", color: "#ffffff44", marginTop: "4px" }}>
                  {v.a.toLocaleString()} votes
                </div>
              </div>
            )}
          </div>

          {/* VS divider */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", gap: "6px",
          }}>
            <div style={{
              fontSize: "11px", fontWeight: "bold", color: "#ffd70099",
              letterSpacing: "2px", writingMode: "vertical-rl",
              fontFamily: "'Courier New', monospace",
            }}>VS</div>
          </div>

          {/* Option B */}
          <div style={{ flex: 1 }}>
            <button style={styles.choiceBtn("b")} onClick={() => handleVote("b")}>
              {q.b}
            </button>
            {showResult && (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <div style={styles.pctLabel("b")}>{bPct}%</div>
                <div style={styles.resultBar(bPct, "b")} />
                <div style={{ fontSize: "10px", color: "#ffffff44", marginTop: "4px" }}>
                  {v.b.toLocaleString()} votes
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Result message */}
        {showResult && (
          <div style={{
            background: "#ffffff08", borderRadius: "10px", padding: "10px 14px",
            fontSize: "12px", color: "#f0e6d3aa", marginBottom: "14px", textAlign: "center",
            border: "1px solid #ffffff11",
          }}>
            {userChoice === "a"
              ? `You're with ${aPct}% of voters 🎉`
              : `Bold choice — only ${bPct}% picked this 👀`}
          </div>
        )}

        {/* Actions */}
        {showResult && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ ...styles.nextBtn, flex: 1 }} onClick={handleNext}>
              Next Question →
            </button>
            <button
              style={{
                padding: "16px", borderRadius: "14px",
                background: "#ffffff11", border: "1px solid #ffffff22",
                color: "#f0e6d3", cursor: "pointer", fontSize: "18px",
              }}
              onClick={() => setShowShare(true)}
            >
              📤
            </button>
          </div>
        )}
      </div>

      {/* Bottom ad */}
      {!isPremium && (
        <div style={{ width: "100%", maxWidth: "560px", marginTop: "20px", position: "relative", zIndex: 1 }}>
          <AD_PLACEHOLDER />
        </div>
      )}

      {/* Footer stats */}
      <div style={{
        marginTop: "20px", fontSize: "11px", color: "#ffffff33",
        fontFamily: "'Courier New', monospace", letterSpacing: "2px",
        textAlign: "center", position: "relative", zIndex: 1,
      }}>
        {(Math.floor(Math.random() * 2000) + 8000).toLocaleString()} PLAYERS ONLINE NOW
      </div>

      {/* Premium Modal */}
      {showPremium && (
        <div style={styles.overlay} onClick={() => setShowPremium(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>✨</div>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#ffd700", marginBottom: "6px" }}>
              WYR Pro
            </div>
            <div style={{ fontSize: "13px", color: "#f0e6d3aa", marginBottom: "20px" }}>
              The ultimate Would You Rather experience
            </div>
            <div style={{ textAlign: "left", marginBottom: "24px" }}>
              {PREMIUM_PERKS.map((p, i) => (
                <div key={i} style={{
                  padding: "9px 0",
                  borderBottom: "1px solid #ffffff11",
                  fontSize: "13px", color: "#f0e6d3cc",
                  display: "flex", gap: "10px", alignItems: "center",
                }}>
                  <span style={{ color: "#ffd700" }}>✓</span> {p}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
              <button
                style={{
                  flex: 1, padding: "14px",
                  background: "linear-gradient(135deg, #ffd700, #ff8c00)",
                  border: "none", borderRadius: "12px",
                  color: "#0a0a0f", fontWeight: "bold", cursor: "pointer", fontSize: "14px",
                }}
                onClick={() => { setIsPremium(true); setShowPremium(false); }}
              >
                $4.99 / month
              </button>
              <button
                style={{
                  flex: 1, padding: "14px",
                  background: "#ffd70011",
                  border: "2px solid #ffd70033", borderRadius: "12px",
                  color: "#ffd700", fontWeight: "bold", cursor: "pointer", fontSize: "14px",
                }}
                onClick={() => { setIsPremium(true); setShowPremium(false); }}
              >
                $29.99 / year 🔥
              </button>
            </div>
            <div style={{ fontSize: "11px", color: "#ffffff33" }}>
              Cancel anytime · No commitment
            </div>
            <button
              onClick={() => setShowPremium(false)}
              style={{
                marginTop: "14px", background: "none", border: "none",
                color: "#ffffff44", cursor: "pointer", fontSize: "12px",
              }}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShare && (
        <div style={styles.overlay} onClick={() => setShowShare(false)}>
          <div style={{ ...styles.modal }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: "26px", marginBottom: "10px" }}>📤</div>
            <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "6px" }}>
              Share this question
            </div>
            <div style={{ fontSize: "12px", color: "#f0e6d3aa", marginBottom: "20px" }}>
              "{q.a.slice(0, 30)}…" vs "{q.b.slice(0, 30)}…"
            </div>
            <div style={styles.shareRow}>
              <button style={styles.shareBtn("#1DA1F2")} onClick={() => setShowShare(false)}>𝕏 Twitter</button>
              <button style={styles.shareBtn("#4267B2")} onClick={() => setShowShare(false)}>Facebook</button>
              <button style={styles.shareBtn("#25D366")} onClick={() => setShowShare(false)}>WhatsApp</button>
              <button style={styles.shareBtn("#E1306C")} onClick={() => setShowShare(false)}>Instagram</button>
            </div>
            <button
              onClick={() => setShowShare(false)}
              style={{ marginTop: "20px", background: "none", border: "none", color: "#ffffff44", cursor: "pointer", fontSize: "12px" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
