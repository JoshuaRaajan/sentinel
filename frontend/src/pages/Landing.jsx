import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useInView, useRevealRoot } from "@/lib/useReveal";
import "./landing.css";

export default function Landing() {
  // Toggle dark scrollbar / body bg only while on Landing.
  useEffect(() => {
    document.body.classList.add("landing");
    return () => document.body.classList.remove("landing");
  }, []);

  // Trailing cursor dot.
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    document.body.appendChild(dot);
    let raf = 0;
    let x = -100,
      y = -100,
      tx = -100,
      ty = -100;
    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target;
      if (t && t.closest && t.closest("a,button,[data-hover]"))
        dot.classList.add("is-hover");
      else dot.classList.remove("is-hover");
    };
    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      dot.style.transform = `translate(${x - 5}px, ${y - 5}px)`;
      raf = requestAnimationFrame(tick);
    };
    document.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      dot.remove();
    };
  }, []);

  const root = useRevealRoot();

  return (
    <div className="landing-dark min-h-screen" ref={root} data-testid="landing-page">
      <Navbar />
      <Hero />
      <Ticker />
      <Story />
      <HowItWorks />
      <TwoViews />
      <Pricing />
      <Testimonials />
      <Footer />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */

function Navbar() {
  return (
    <nav
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{
        background: "rgba(25,25,25,0.78)",
        borderBottom: "1px solid var(--line)",
      }}
      data-testid="landing-navbar"
    >
      <div className="max-w-[1320px] mx-auto h-[68px] px-6 flex items-center">
        <div
          className="data text-[13px] font-bold"
          style={{ letterSpacing: "0.24em", color: "var(--text)" }}
        >
          SENTINEL
        </div>
        <div className="hidden md:flex items-center gap-9 mx-auto">
          {["HOW IT WORKS", "PRICING", "CLIENT PORTAL"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
              className="label transition-colors"
              style={{ color: "var(--muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
              data-testid={`navlink-${l.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {l}
            </a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-5">
          <Link
            to="/app"
            className="label hidden sm:inline transition-colors"
            style={{ color: "var(--text)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
            data-testid="signin-link"
          >
            SIGN IN
          </Link>
          <Link to="/new" className="btn btn-primary" data-testid="cta-start-project-nav">
            <span>START A PROJECT →</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */

function Hero() {
  const [cardRef, cardIn] = useInView({ threshold: 0.25 });

  return (
    <section
      className="relative dotgrid-dark"
      style={{ paddingTop: 64, paddingBottom: 96 }}
      data-testid="hero-section"
    >
      <div className="max-w-[1320px] mx-auto px-6 pt-12 lg:pt-20 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-20 items-center">
        <div>
          <div
            className="r inline-flex items-center gap-2 px-3 py-1.5"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--line)",
              color: "var(--gold)",
              borderRadius: 999,
            }}
            data-testid="hero-badge"
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "var(--gold)",
                display: "inline-block",
              }}
            />
            <span className="label" style={{ color: "var(--gold)" }}>
              / PROJECT INTELLIGENCE FOR AGENCIES
            </span>
          </div>

          <h1
            className="display r mt-8 text-[52px] sm:text-[68px] lg:text-[88px] xl:text-[96px]"
            data-d="1"
            data-testid="hero-headline"
            style={{ color: "var(--text)" }}
          >
            <span style={{ display: "block", whiteSpace: "nowrap" }}>YOU AGREED TO</span>
            <span style={{ display: "block", whiteSpace: "nowrap" }}>BUILD A WEBSITE.</span>
            <span style={{ display: "block", whiteSpace: "nowrap", color: "var(--gold)" }}>
              THEY ADDED 23
            </span>
            <span style={{ display: "block", whiteSpace: "nowrap", color: "var(--gold)" }}>
              MORE THINGS.
            </span>
          </h1>

          <p
            className="r mt-8 text-[18px] leading-relaxed max-w-[540px]"
            data-d="2"
            style={{ color: "var(--muted)" }}
          >
            Sentinel tracks every task against what was agreed. Flags scope creep
            before it costs you. Generates the change order so you don't have to
            have the awkward conversation.
          </p>

          <div
            className="r data mt-5 text-[13px]"
            data-d="3"
            style={{ color: "var(--muted)", letterSpacing: "0.06em" }}
          >
            $29/month. No contracts. Cancel anytime.
          </div>

          <div className="r mt-10 flex flex-wrap items-center gap-4" data-d="4">
            <Link to="/new" className="btn btn-primary" data-testid="cta-start-project">
              <span>START A PROJECT →</span>
            </Link>
            <a
              href="#how-it-works"
              className="btn btn-ghost"
              data-testid="cta-how-it-works"
            >
              <span>SEE HOW IT WORKS →</span>
            </a>
          </div>
        </div>

        {/* Floating animated product card */}
        <div
          ref={cardRef}
          className={`hero-card r-scale go ${cardIn ? "in" : ""}`}
          data-testid="hero-live-panel"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="label" style={{ color: "var(--muted)" }}>
                / LIVE
              </div>
              <div
                className="display mt-2"
                style={{ fontSize: 28, color: "var(--text)" }}
              >
                Lumière Brand Website
              </div>
            </div>
            <span
              className="label"
              style={{
                color: "var(--gold)",
                background: "var(--gold-soft)",
                border: "1px solid rgba(201,168,76,0.25)",
                padding: "6px 10px",
              }}
            >
              AT RISK
            </span>
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between label" style={{ color: "var(--muted)" }}>
              <span>SCOPE USED</span>
              <span style={{ color: "var(--gold)" }}>73% OF AGREED SCOPE</span>
            </div>
            <div
              className="mt-2 relative"
              style={{
                height: 6,
                background: "var(--surface-2)",
                border: "1px solid var(--line)",
              }}
            >
              <div className="scope-fill" />
            </div>
          </div>

          <div className="mt-7" style={{ borderTop: "1px solid var(--line)" }}>
            {[
              { name: "Homepage redesign", h: "8 / 8h", scope: "in", cls: "" },
              { name: "Mobile menu animation", h: "3 / 2h", scope: "in", cls: "" },
              {
                name: "Add chatbot",
                h: "6 / 4h",
                scope: "out",
                cls: "t1",
              },
              {
                name: "Blog section build-out",
                h: "6 / 0h",
                scope: "out",
                cls: "t2",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 py-3"
                style={{
                  borderBottom: "1px solid var(--line)",
                  background:
                    t.scope === "out" ? "rgba(192,57,43,0.06)" : "transparent",
                  paddingLeft: 12,
                  paddingRight: 4,
                  borderLeft:
                    t.scope === "out"
                      ? "2px solid var(--red)"
                      : "2px solid transparent",
                }}
              >
                <span
                  className="text-[14px] truncate flex-1 min-w-0"
                  style={{ color: "var(--text)" }}
                >
                  {t.name}
                </span>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className="data text-[11px]"
                    style={{ color: "var(--muted)", letterSpacing: "0.06em" }}
                  >
                    {t.h}
                  </span>
                  <span
                    className="label"
                    style={
                      t.scope === "out"
                        ? {
                            color: "#ffffff",
                            background: "#c0392b",
                            border: "1px solid #c0392b",
                            padding: "5px 10px",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                            display: "inline-block",
                          }
                        : {
                            color: "#7a9e6e",
                            background: "rgba(122,158,110,0.14)",
                            border: "1px solid rgba(122,158,110,0.45)",
                            padding: "5px 10px",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                            display: "inline-block",
                          }
                    }
                  >
                    {t.scope === "out" ? "OUT OF SCOPE" : "IN SCOPE"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              ["AGREED", "40 HRS"],
              ["USED", "29 HRS"],
              ["REMAINING", "11 HRS"],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  border: "1px solid var(--line)",
                  background: "var(--surface-2)",
                  padding: "12px 14px",
                }}
              >
                <div className="label" style={{ color: "var(--muted)" }}>
                  {k}
                </div>
                <div
                  className="data mt-1 text-[13px]"
                  style={{ color: "var(--text)", letterSpacing: "0.04em" }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-6 px-4 py-3 flex items-center gap-3"
            style={{
              border: "1px solid rgba(192,57,43,0.45)",
              background: "rgba(192,57,43,0.10)",
              color: "var(--red)",
            }}
          >
            <span className="data text-[13px]">/!\</span>
            <span
              className="label"
              style={{ color: "var(--red)", letterSpacing: "0.14em" }}
            >
              2 TASKS OUTSIDE ORIGINAL AGREEMENT — $1,800 UNBILLED
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */

function Ticker() {
  const message = "/ LIVE — $284,737 IN SCOPE CREEP DETECTED THIS MONTH";
  const items = Array.from({ length: 8 }, (_, i) => i);
  return (
    <section
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        padding: "18px 0",
      }}
      data-testid="live-counter-bar"
    >
      <div className="marquee">
        <div className="marquee__track">
          {items.map((i) => (
            <span
              key={`a-${i}`}
              className="label whitespace-nowrap"
              style={{ color: i % 2 ? "var(--muted)" : "var(--gold)" }}
            >
              {message}
            </span>
          ))}
          {items.map((i) => (
            <span
              key={`b-${i}`}
              className="label whitespace-nowrap"
              style={{ color: i % 2 ? "var(--muted)" : "var(--gold)" }}
              aria-hidden
            >
              {message}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */

function Story() {
  const rows = [
    ["WEEK 01", "Can you also change the font?"],
    ["WEEK 02", "Actually redo the homepage layout"],
    ["WEEK 03", "Add an animation to the hero section"],
    ["WEEK 04", "We need a blog section too"],
    ["WEEK 05", "One more small thing — can you add a chatbot?"],
    ["WEEK 06", "Can we redo the mobile version entirely?"],
  ];
  const [barRef, barIn] = useInView({ threshold: 0.4 });

  return (
    <section className="px-6 py-24 lg:py-32" data-testid="story-section">
      <div className="max-w-[1100px] mx-auto">
        <div className="r label" style={{ color: "var(--gold)" }}>
          / CASE FILE
        </div>
        <h2
          className="display r mt-4 text-5xl lg:text-7xl"
          data-d="1"
          style={{ color: "var(--text)" }}
        >
          Here's what actually happened.
        </h2>
        <p
          className="r mt-3 text-[18px]"
          data-d="2"
          style={{ color: "var(--muted)" }}
        >
          A real project. A familiar story.
        </p>

        <div
          className="mt-12"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
          }}
        >
          {rows.map((r, i) => (
            <div
              key={i}
              className="r-left grid grid-cols-[88px_1fr_auto_auto] sm:grid-cols-[110px_1fr_120px_90px] items-center gap-4 px-5 sm:px-7 py-5"
              data-d={(i + 1).toString()}
              style={{
                borderBottom:
                  i < rows.length - 1 ? "1px solid var(--line)" : "none",
              }}
            >
              <span
                className="data text-[11px]"
                style={{ color: "var(--muted)", letterSpacing: "0.16em" }}
              >
                {r[0]}
              </span>
              <span
                className="text-[15px] sm:text-[16px]"
                style={{ color: "var(--text)" }}
              >
                "{r[1]}"
              </span>
              <span
                className="hidden sm:inline label"
                style={{ color: "var(--sage)" }}
              >
                ✓ DONE
              </span>
              <span
                className="hidden sm:inline label pulse-red"
                style={{
                  color: "var(--red)",
                  background: "rgba(192,57,43,0.10)",
                  border: "1px solid rgba(192,57,43,0.4)",
                  padding: "4px 10px",
                  textAlign: "center",
                }}
              >
                FREE
              </span>
            </div>
          ))}
          <div
            ref={barRef}
            className={`story-bar ${barIn ? "go" : ""}`}
            data-testid="story-bar"
          >
            <span />
          </div>
        </div>

        <div className="mt-14">
          <div className="r label" style={{ color: "var(--muted)" }} data-d="1">
            / FINAL TALLY
          </div>
          <h3
            className="display r mt-3 text-4xl lg:text-6xl"
            data-d="2"
            style={{ color: "var(--gold)" }}
          >
            That was $4,700 of unbilled work.
          </h3>
          <p
            className="r mt-5 text-[17px] max-w-[640px]"
            data-d="3"
            style={{ color: "var(--muted)" }}
          >
            Sound familiar? Sentinel would have flagged every single one.
          </p>
          <Link
            to="/new"
            className="r btn btn-primary mt-8"
            data-d="4"
            data-testid="story-cta"
          >
            <span>PROTECT YOUR NEXT PROJECT →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "LOCK THE SCOPE",
      d: "Paste your SOW or describe the project in plain English. Sentinel structures it and locks it as the source of truth.",
    },
    {
      n: "02",
      t: "WORK NORMALLY",
      d: "Add tasks, log hours, track progress exactly as you would. Sentinel watches everything against the original agreement in real time.",
    },
    {
      n: "03",
      t: "SENTINEL FLAGS IT",
      d: "The moment something goes out of scope — you know instantly. Change order ready in one click. Client never sees the internal flags.",
    },
  ];
  return (
    <section
      id="how-it-works"
      className="px-6 py-24 lg:py-32"
      style={{ borderTop: "1px solid var(--line)" }}
      data-testid="how-it-works-section"
    >
      <div className="max-w-[1320px] mx-auto">
        <div className="r label" style={{ color: "var(--gold)" }}>
          / METHOD
        </div>
        <h2
          className="display r mt-4 text-5xl lg:text-7xl max-w-4xl"
          data-d="1"
          style={{ color: "var(--text)" }}
        >
          Three steps. Zero awkward conversations.
        </h2>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="r-scale lift relative overflow-hidden"
              data-d={(i + 1).toString()}
              data-hover
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderLeft: "2px solid var(--gold)",
                padding: "36px 28px 32px",
                minHeight: 320,
              }}
            >
              <div
                aria-hidden
                className="display absolute pointer-events-none select-none"
                style={{
                  top: -32,
                  right: -8,
                  fontSize: 200,
                  lineHeight: 1,
                  color: "rgba(242,237,216,0.04)",
                }}
              >
                {s.n}
              </div>
              <div className="label" style={{ color: "var(--gold)" }}>
                / STEP {s.n}
              </div>
              <h3
                className="mt-4 text-[26px] font-semibold"
                style={{
                  color: "var(--text)",
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: "-0.01em",
                }}
              >
                {s.t}
              </h3>
              <p
                className="mt-5 text-[15px] leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */

function TwoViews() {
  const [leftRef, leftIn] = useInView();
  const [rightRef, rightIn] = useInView();

  return (
    <section
      className="px-6 py-16 lg:py-20"
      style={{ borderTop: "1px solid var(--line)" }}
      data-testid="two-views-section"
    >
      <div className="max-w-[1320px] mx-auto">
        <div className="r label text-center" style={{ color: "var(--gold)" }}>
          / DUAL VIEW
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
          <div
            ref={leftRef}
            className={`split left ${leftIn ? "in" : ""}`}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              padding: "18px 20px",
              height: 480,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div className="label" style={{ color: "var(--red)" }}>
              / WHAT YOU SEE
            </div>
            <div
              className="mt-4 flex items-center justify-between label"
              style={{ color: "var(--muted)" }}
            >
              <span>SCOPE USED</span>
              <span style={{ color: "var(--red)" }}>89%</span>
            </div>
            <div
              className="mt-1.5"
              style={{
                height: 3,
                background: "var(--surface-2)",
                border: "1px solid var(--line)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: leftIn ? "89%" : "0%",
                  background: "var(--red)",
                  transition: "width 1.6s cubic-bezier(.16,1,.3,1) .3s",
                }}
              />
            </div>
            <div
              className="mt-4 space-y-1.5"
              style={{ flex: 1, overflowY: "auto" }}
            >
              {[
                ["Build About + Services", "in"],
                ["Add chatbot", "out", "f1"],
                ["Mobile redesign", "out", "f2"],
                ["Hero animation polish", "in"],
                ["Wire CMS integration", "in"],
                ["Add dark mode toggle", "out", "f1"],
              ].map((t, i) => (
                <div
                  key={i}
                  className={t[1] === "out" ? `split-flag ${t[2] || ""}` : ""}
                  style={{
                    background:
                      t[1] === "out" ? "rgba(192,57,43,0.07)" : "transparent",
                    border: "1px solid var(--line)",
                    borderLeft:
                      t[1] === "out"
                        ? "2px solid var(--red)"
                        : "1px solid var(--line)",
                    padding: "7px 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <span
                    className="truncate"
                    style={{ color: "var(--text)", fontSize: 12 }}
                  >
                    {t[0]}
                  </span>
                  <span
                    className="data"
                    style={
                      t[1] === "out"
                        ? {
                            color: "var(--red)",
                            background: "rgba(192,57,43,0.12)",
                            border: "1px solid rgba(192,57,43,0.45)",
                            padding: "2px 6px",
                            fontSize: 9,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }
                        : {
                            color: "var(--sage)",
                            background: "rgba(122,158,110,0.10)",
                            border: "1px solid rgba(122,158,110,0.35)",
                            padding: "2px 6px",
                            fontSize: 9,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }
                    }
                  >
                    {t[1] === "out" ? "OUT OF SCOPE" : "IN SCOPE"}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="data mt-3"
              style={{
                background: "rgba(192,57,43,0.10)",
                color: "var(--red)",
                border: "1px solid rgba(192,57,43,0.45)",
                padding: "6px 10px",
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              SCOPE CREEP DETECTED — $1,800 UNBILLED
            </div>
          </div>

          <div
            ref={rightRef}
            className={`split right ${rightIn ? "in" : ""}`}
            style={{
              background: "#191919",
              border: "1px solid var(--line)",
              padding: 16,
              height: 480,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div className="label" style={{ color: "var(--muted)" }}>
              / WHAT THEY SEE
            </div>
            <ClientKanban rightIn={rightIn} />
          </div>
        </div>

        <div className="mt-10 text-center">
          <h3
            className="display r text-4xl lg:text-6xl"
            style={{ color: "var(--text)" }}
          >
            They see progress.
          </h3>
          <h3
            className="display r mt-3 text-4xl lg:text-6xl"
            data-d="2"
            style={{ color: "var(--gold)" }}
          >
            You see the truth.
          </h3>
        </div>
      </div>
    </section>
  );
}

/* ── Client kanban (right side of dual view) ────────────────────────── */

const CAT = {
  DESIGN: { bg: "rgba(122,158,110,0.12)", fg: "#7a9e6e" },
  DEVELOPMENT: { bg: "rgba(201,168,76,0.12)", fg: "#c9a84c" },
  REVIEW: { bg: "rgba(100,130,200,0.12)", fg: "#7a9ecc" },
  CONTENT: { bg: "rgba(192,100,57,0.12)", fg: "#c07843" },
};

const AVATARS = {
  JR: { bg: "rgba(122,158,110,0.22)", fg: "#a8c79c" },
  AL: { bg: "rgba(201,168,76,0.22)", fg: "#e1c878" },
  KP: { bg: "rgba(192,120,67,0.22)", fg: "#e0a585" },
};

const PRI = { high: "#c0392b", med: "#c9a84c", low: "#7a9e6e" };

function ClockIcon({ size = 11 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckIcon({ size = 11 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Avatar({ id, size = 22 }) {
  const a = AVATARS[id];
  return (
    <span
      className="data"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: a.bg,
        color: a.fg,
        border: `1px solid ${a.fg}55`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size === 22 ? 9 : 10,
        fontWeight: 600,
        letterSpacing: "0.02em",
        flexShrink: 0,
      }}
    >
      {id}
    </span>
  );
}

function CategoryTag({ cat }) {
  const c = CAT[cat] || CAT.DESIGN;
  return (
    <span
      className="data"
      style={{
        background: c.bg,
        color: c.fg,
        border: `1px solid ${c.fg}33`,
        padding: "2px 6px",
        fontSize: 9,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        fontWeight: 600,
        display: "inline-block",
      }}
    >
      {cat}
    </span>
  );
}

function SubtaskBar({ done, total }) {
  const pct = total ? (done / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          flex: 1,
          height: 3,
          background: "#2a2a2a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${pct}%`,
            background: done === total ? "#7a9e6e" : "rgba(242,237,216,0.55)",
            transition: "width .8s cubic-bezier(.16,1,.3,1)",
          }}
        />
      </div>
      <span
        className="data"
        style={{ fontSize: 9, color: "#8b8b8b", letterSpacing: "0.04em" }}
      >
        {done}/{total}
      </span>
    </div>
  );
}

function KanbanCard({ card, index, rightIn }) {
  const isInProgress = card.col === "ip";
  const done = card.col === "done";
  const pri = PRI[card.prio || "low"];
  return (
    <div
      style={{
        background: "#1e1e1e",
        border: "1px solid #2a2a2a",
        borderLeft: isInProgress ? "2px solid #c9a84c" : "1px solid #2a2a2a",
        padding: "6px 10px",
        opacity: rightIn ? (done ? 0.7 : 1) : 0,
        transform: rightIn ? "translateY(0)" : "translateY(8px)",
        transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${0.45 + index * 0.05}s, transform .7s cubic-bezier(.16,1,.3,1) ${0.45 + index * 0.05}s, border-color .25s, background-color .25s`,
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "#3a3a3a";
        if (isInProgress) e.currentTarget.style.borderLeftColor = "#c9a84c";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "#2a2a2a";
        if (isInProgress) e.currentTarget.style.borderLeftColor = "#c9a84c";
      }}
      data-hover
    >
      <div className="flex items-center justify-between">
        <CategoryTag cat={card.cat} />
        {card.prio && !done && (
          <span
            title={`${card.prio} priority`}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: pri,
              display: "inline-block",
              boxShadow: `0 0 0 2px ${pri}22`,
            }}
          />
        )}
      </div>

      <div
        style={{
          marginTop: 4,
          fontSize: 11,
          lineHeight: 1.2,
          color: "#f2edd8",
          fontWeight: 500,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {card.title}
      </div>

      <div
        className="flex items-center justify-between"
        style={{ marginTop: 4, gap: 6 }}
      >
        <span
          className="data flex items-center gap-1"
          style={{
            fontSize: 9,
            color: done ? "#7a9e6e" : "#8b8b8b",
            letterSpacing: "0.04em",
            flexShrink: 0,
          }}
        >
          {done ? <CheckIcon size={9} /> : <ClockIcon size={9} />}
          <span>{done ? card.doneDate : card.due}</span>
        </span>
        {card.subs && (
          <span
            className="data truncate"
            style={{
              fontSize: 9,
              color: "#8b8b8b",
              letterSpacing: "0.04em",
              flex: 1,
              textAlign: "center",
            }}
          >
            {card.subs[0]}/{card.subs[1]} subtasks
          </span>
        )}
        {card.who && <Avatar id={card.who} size={18} />}
      </div>
    </div>
  );
}

function KanbanColumn({ title, count, cards, rightIn, startIndex }) {
  return (
    <div
      style={{
        background: "#141414",
        border: "1px solid #242424",
        padding: 10,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minHeight: 0,
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 2 }}
      >
        <span
          className="data"
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#f2edd8",
            fontWeight: 600,
          }}
        >
          {title}
        </span>
        <span
          className="data"
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#202020",
            border: "1px solid #2a2a2a",
            color: "#8b8b8b",
            fontSize: 9,
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {count}
        </span>
      </div>
      {cards.map((c, i) => (
        <KanbanCard
          key={c.title}
          card={c}
          index={startIndex + i}
          rightIn={rightIn}
        />
      ))}
    </div>
  );
}

function ClientKanban({ rightIn }) {
  const todoCards = [
    {
      cat: "DEVELOPMENT",
      title: "Build contact form with validation",
      subs: [0, 3],
      due: "May 18",
      prio: "med",
      who: "AL",
      col: "todo",
    },
    {
      cat: "CONTENT",
      title: "Final copywriting review and SEO meta tags",
      due: "May 19",
      prio: "low",
      who: "KP",
      col: "todo",
    },
  ];
  const ipCards = [
    {
      cat: "DESIGN",
      title: "Services page — layout, icons, pricing section",
      subs: [2, 4],
      due: "May 14",
      prio: "high",
      who: "JR",
      col: "ip",
    },
    {
      cat: "DEVELOPMENT",
      title: "Mobile responsiveness pass — all breakpoints",
      subs: [1, 3],
      due: "May 15",
      prio: "high",
      who: "AL",
      col: "ip",
    },
    {
      cat: "REVIEW",
      title: "Client feedback round 2 — homepage revisions",
      due: "May 13",
      prio: "med",
      who: "KP",
      col: "ip",
    },
  ];
  const doneCards = [
    {
      cat: "DESIGN",
      title: "Wireframes — all 8 pages approved",
      subs: [4, 4],
      doneDate: "May 2",
      col: "done",
    },
    {
      cat: "DEVELOPMENT",
      title: "Homepage build — hero, nav, footer",
      subs: [3, 3],
      doneDate: "May 7",
      col: "done",
    },
    {
      cat: "CONTENT",
      title: "Brand guidelines and asset handoff",
      doneDate: "May 5",
      col: "done",
    },
    {
      cat: "DESIGN",
      title: "Logo variations and brand colour palette",
      doneDate: "Apr 28",
      col: "done",
    },
  ];

  return (
    <div
      className="mt-3"
      data-testid="client-kanban"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        gap: 10,
      }}
    >
      {/* Project header */}
      <div
        style={{
          background: "#141414",
          border: "1px solid #242424",
          padding: 10,
          flexShrink: 0,
        }}
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              className="display"
              style={{
                fontSize: 16,
                color: "#f2edd8",
                lineHeight: 1.1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Lumière Brand Website
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
              <span
                className="data flex items-center gap-1"
                style={{
                  background: "rgba(122,158,110,0.12)",
                  color: "#7a9e6e",
                  border: "1px solid rgba(122,158,110,0.45)",
                  padding: "2px 6px",
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#7a9e6e",
                    display: "inline-block",
                  }}
                />
                ON TRACK
              </span>
              <span
                className="data flex items-center gap-1"
                style={{
                  background: "rgba(201,168,76,0.12)",
                  color: "#c9a84c",
                  border: "1px solid rgba(201,168,76,0.45)",
                  padding: "2px 6px",
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                <ClockIcon size={8} />
                DUE MAY 20
              </span>
            </div>
          </div>
          <div className="flex items-center" style={{ flexShrink: 0 }}>
            {["JR", "AL", "KP"].map((id, i) => (
              <span
                key={id}
                style={{
                  marginLeft: i === 0 ? 0 : -5,
                  zIndex: 3 - i,
                  border: "2px solid #141414",
                  borderRadius: "50%",
                  display: "inline-flex",
                }}
              >
                <Avatar id={id} size={20} />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-2.5">
          <div className="flex items-center justify-between">
            <span
              className="data"
              style={{
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8b8b8b",
              }}
            >
              Overall progress
            </span>
            <span
              className="data"
              style={{
                fontSize: 10,
                color: "#f2edd8",
                fontWeight: 600,
              }}
            >
              68%
            </span>
          </div>
          <div
            style={{
              marginTop: 4,
              height: 3,
              background: "#202020",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: rightIn ? "68%" : "0%",
                background:
                  "linear-gradient(90deg, #7a9e6e 0%, #c9a84c 100%)",
                transition: "width 1.6s cubic-bezier(.16,1,.3,1) .3s",
              }}
            />
          </div>
        </div>
      </div>

      {/* Columns */}
      <div
        className="grid grid-cols-3 gap-2"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          alignItems: "start",
        }}
      >
        <KanbanColumn
          title="To Do"
          count={todoCards.length}
          cards={todoCards}
          rightIn={rightIn}
          startIndex={0}
        />
        <KanbanColumn
          title="In Progress"
          count={ipCards.length}
          cards={ipCards}
          rightIn={rightIn}
          startIndex={todoCards.length}
        />
        <KanbanColumn
          title="Done"
          count={doneCards.length}
          cards={doneCards}
          rightIn={rightIn}
          startIndex={todoCards.length + ipCards.length}
        />
      </div>

      {/* Bottom status bar */}
      <div
        className="flex items-center justify-between flex-wrap gap-2"
        style={{
          background: "#141414",
          border: "1px solid #242424",
          padding: "6px 10px",
          flexShrink: 0,
        }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          {[
            ["#c0392b", "2", "BLOCKERS"],
            ["#c9a84c", "3", "IN PROGRESS"],
            ["#7a9e6e", "4", "COMPLETED"],
          ].map(([col, n, lbl]) => (
            <span
              key={lbl}
              className="data flex items-center gap-1.5"
              style={{ fontSize: 9, color: "#8b8b8b", letterSpacing: "0.1em" }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: col,
                  display: "inline-block",
                }}
              />
              <span style={{ color: "#f2edd8", fontWeight: 600 }}>{n}</span>
              <span>{lbl}</span>
            </span>
          ))}
        </div>
        <span
          className="data"
          style={{
            fontSize: 9,
            color: "#8b8b8b",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Updated 2h ago
        </span>
      </div>
    </div>
  );
}



/* ════════════════════════════════════════════════════════════════════════ */

function Pricing() {
  const tiers = [
    {
      name: "SOLO",
      price: "$29",
      sub: "FOR FREELANCERS",
      cta: "START SOLO →",
      featured: false,
      features: [
        "3 active projects",
        "1 user",
        "AI scope detection",
        "Change order generator",
        "T&M calculator",
        "Client portal view",
      ],
      testid: "solo",
    },
    {
      name: "AGENCY",
      price: "$79",
      sub: "MOST POPULAR",
      cta: "START AGENCY →",
      featured: true,
      features: [
        "Unlimited projects",
        "Up to 5 users",
        "Everything in Solo",
        "Team task assignment",
        "Slack scope creep alerts",
        "Priority AI processing",
      ],
      testid: "agency",
    },
    {
      name: "WAR ROOM",
      price: "$199",
      sub: "FOR AGENCIES WHO MEAN IT",
      cta: "JOIN WAR ROOM →",
      featured: false,
      features: [
        "Unlimited everything",
        "Unlimited team seats",
        "White label client portal",
        "Custom branding on change orders",
        "Dedicated Slack channel",
        "API access",
      ],
      testid: "war-room",
    },
  ];

  return (
    <section
      id="pricing"
      className="px-6 py-24 lg:py-32"
      style={{ borderTop: "1px solid var(--line)" }}
      data-testid="pricing-section"
    >
      <div className="max-w-[1320px] mx-auto">
        <div className="r label" style={{ color: "var(--gold)" }}>
          / PRICING
        </div>
        <h2
          className="display r mt-4 text-5xl lg:text-7xl"
          data-d="1"
          style={{ color: "var(--text)" }}
        >
          One tool. Three ways in.
        </h2>
        <p
          className="r mt-4 text-[17px] max-w-2xl"
          data-d="2"
          style={{ color: "var(--muted)" }}
        >
          Every plan includes AI scope detection, change order generation, and
          T&M billing.
        </p>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((t, i) => (
            <div
              key={t.name}
              data-hover
              data-testid={`pricing-${t.testid}`}
              className={`r-scale lift ${t.featured ? "pricing-feature" : ""}`}
              data-d={(i + 1).toString()}
              style={{
                background: t.featured ? "var(--surface-2)" : "var(--surface)",
                border: "1px solid var(--line)",
                padding: "36px 28px",
                transform: t.featured ? "translateY(-8px)" : undefined,
              }}
            >
              <div className="label" style={{ color: "var(--muted)" }}>
                / {t.sub}
              </div>
              <div className="data mt-2 text-[13px]" style={{ color: "var(--text)", letterSpacing: "0.22em" }}>
                {t.name}
              </div>
              <div
                className="display mt-7"
                style={{ fontSize: 64, color: "var(--text)" }}
              >
                {t.price}
              </div>
              <div className="label" style={{ color: "var(--muted)" }}>
                /MONTH
              </div>

              <ul className="mt-8 space-y-3 text-[14px]">
                {t.features.map((f, j) => (
                  <li
                    key={f}
                    className="feature-row flex items-start gap-3"
                    style={{
                      color: "var(--text)",
                      transitionDelay: `${j * 30}ms`,
                    }}
                  >
                    <span
                      style={{
                        color: t.featured ? "var(--gold)" : "var(--sage)",
                        marginTop: 2,
                      }}
                    >
                      /
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/new"
                className={`btn ${t.featured ? "btn-primary" : "btn-ghost"} mt-8 w-full justify-center`}
                style={{ width: "100%", justifyContent: "center" }}
                data-testid={`cta-${t.testid}`}
              >
                <span>{t.cta}</span>
              </Link>
            </div>
          ))}
        </div>

        <p
          className="r mt-12 text-center text-[15px]"
          style={{ color: "var(--muted)" }}
        >
          Used by freelancers and agency owners who are done losing money to
          scope creep.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */

function Testimonials() {
  const cards = [
    {
      tag: "AGY/WEB",
      tagColor: "var(--gold)",
      who: "R. Mehta, Web Agency Owner",
      quote:
        "Caught $2,300 in unbilled work in the first month. The change order email it generates is better than anything I'd write myself.",
    },
    {
      tag: "FRL/DEV",
      tagColor: "var(--sage)",
      who: "S. Kim, Freelance Developer",
      quote:
        "Client added 11 features after sign-off. Sentinel flagged every single one. First time I've ever been paid for everything I actually built.",
    },
    {
      tag: "AGY/DESIGN",
      tagColor: "var(--muted)",
      who: "P. Osei, Brand Design Studio",
      quote:
        "The client portal is the best part. They see a clean professional board. We see exactly where the money is going. Night and day.",
    },
  ];
  return (
    <section
      className="px-6 py-24 lg:py-32"
      style={{ borderTop: "1px solid var(--line)" }}
      data-testid="testimonials-section"
    >
      <div className="max-w-[1320px] mx-auto">
        <div className="r label" style={{ color: "var(--gold)" }}>
          / FROM THE FIELD
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div
              key={i}
              className="r-scale lift"
              data-hover
              data-d={(i + 1).toString()}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                padding: 32,
              }}
            >
              <span
                className="label inline-block"
                style={{
                  color: c.tagColor,
                  borderTop: `2px solid ${c.tagColor}`,
                  paddingTop: 10,
                }}
              >
                {c.tag}
              </span>
              <p
                className="data mt-6 text-[14px] leading-[1.7]"
                style={{ color: "var(--text)" }}
              >
                "{c.quote}"
              </p>
              <div
                className="data mt-8 text-[12px]"
                style={{ color: "var(--muted)", letterSpacing: "0.05em" }}
              >
                — {c.who}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */

function Footer() {
  return (
    <footer
      className="px-6 py-14"
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--line)",
      }}
      data-testid="landing-footer"
    >
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div
            className="data text-[13px] font-bold"
            style={{ color: "var(--text)", letterSpacing: "0.24em" }}
          >
            SENTINEL
          </div>
          <p
            className="mt-4 text-[14px] max-w-xs"
            style={{ color: "var(--muted)" }}
          >
            Project intelligence for agencies who bill what they build.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { l: "How It Works", h: "#how-it-works" },
            { l: "Pricing", h: "#pricing" },
            { l: "Client Portal", to: "/app" },
            { l: "Sign In", to: "/app" },
          ].map((l, i) => {
            const Cls =
              "label transition-colors block hover:text-[var(--gold)]";
            return l.to ? (
              <Link key={i} to={l.to} className={Cls} style={{ color: "var(--muted)" }}>
                {l.l}
              </Link>
            ) : (
              <a key={i} href={l.h} className={Cls} style={{ color: "var(--muted)" }}>
                {l.l}
              </a>
            );
          })}
        </div>
        <div className="md:text-right label" style={{ color: "var(--muted)" }}>
          © 2025 SENTINEL
        </div>
      </div>
    </footer>
  );
}
