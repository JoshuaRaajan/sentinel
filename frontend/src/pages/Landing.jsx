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
      className="px-6 py-24 lg:py-32"
      style={{ borderTop: "1px solid var(--line)" }}
      data-testid="two-views-section"
    >
      <div className="max-w-[1320px] mx-auto">
        <div className="r label text-center" style={{ color: "var(--gold)" }}>
          / DUAL VIEW
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div
            ref={leftRef}
            className={`split left ${leftIn ? "in" : ""}`}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              padding: "32px 28px",
            }}
          >
            <div className="label" style={{ color: "var(--red)" }}>
              / WHAT YOU SEE
            </div>
            <div className="mt-6 flex items-center justify-between label" style={{ color: "var(--muted)" }}>
              <span>SCOPE USED</span>
              <span style={{ color: "var(--red)" }}>89%</span>
            </div>
            <div
              className="mt-2 h-[6px]"
              style={{
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
            <div className="mt-6 space-y-3">
              {[
                ["Build About + Services", "in"],
                ["Add chatbot", "out", "f1"],
                ["Mobile redesign", "out", "f2"],
              ].map((t, i) => (
                <div
                  key={i}
                  className={t[1] === "out" ? `split-flag ${t[2]}` : ""}
                  style={{
                    background:
                      t[1] === "out" ? "rgba(192,57,43,0.07)" : "transparent",
                    border: "1px solid var(--line)",
                    borderLeft:
                      t[1] === "out"
                        ? "2px solid var(--red)"
                        : "1px solid var(--line)",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    className="text-[14px]"
                    style={{ color: "var(--text)" }}
                  >
                    {t[0]}
                  </span>
                  <span
                    className="label"
                    style={
                      t[1] === "out"
                        ? {
                            color: "var(--red)",
                            background: "rgba(192,57,43,0.12)",
                            border: "1px solid rgba(192,57,43,0.45)",
                            padding: "3px 8px",
                          }
                        : {
                            color: "var(--sage)",
                            background: "rgba(122,158,110,0.10)",
                            border: "1px solid rgba(122,158,110,0.35)",
                            padding: "3px 8px",
                          }
                    }
                  >
                    {t[1] === "out" ? "OUT OF SCOPE" : "IN SCOPE"}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="mt-5 px-3 py-2 label"
              style={{
                background: "rgba(192,57,43,0.10)",
                color: "var(--red)",
                border: "1px solid rgba(192,57,43,0.45)",
                letterSpacing: "0.14em",
              }}
            >
              SCOPE CREEP DETECTED — $1,800 UNBILLED
            </div>
          </div>

          <div
            ref={rightRef}
            className={`split right ${rightIn ? "in" : ""}`}
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--line)",
              padding: "32px 28px",
            }}
          >
            <div className="label" style={{ color: "var(--muted)" }}>
              / WHAT THEY SEE
            </div>
            <div
              className="display mt-4"
              style={{ fontSize: 26, color: "var(--text)" }}
            >
              Lumière Brand Website
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {["TO DO", "IN PROGRESS", "DONE"].map((c, i) => (
                <div
                  key={c}
                  style={{
                    border: "1px solid var(--line)",
                    padding: 12,
                    background: "var(--surface)",
                  }}
                >
                  <div className="label" style={{ color: "var(--muted)" }}>
                    {c}
                  </div>
                  <div className="mt-3 space-y-2">
                    <div
                      className="r-scale text-[13px]"
                      style={{
                        color: "var(--text)",
                        border: "1px solid var(--line)",
                        padding: "8px 10px",
                        background: "var(--surface-2)",
                        transition: `all .7s cubic-bezier(.16,1,.3,1) ${0.4 + i * 0.18}s`,
                        opacity: rightIn ? 1 : 0,
                        transform: rightIn ? "translateY(0)" : "translateY(8px)",
                      }}
                    >
                      Build About page
                    </div>
                    {c === "DONE" && (
                      <div
                        className="text-[13px]"
                        style={{
                          color: "var(--text)",
                          border: "1px solid var(--line)",
                          padding: "8px 10px",
                          background: "var(--surface-2)",
                          transition: `all .7s cubic-bezier(.16,1,.3,1) ${0.4 + i * 0.18 + 0.15}s`,
                          opacity: rightIn ? 1 : 0,
                          transform: rightIn ? "translateY(0)" : "translateY(8px)",
                        }}
                      >
                        Wireframes
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div
              className="mt-6 label"
              style={{ color: "var(--sage)", letterSpacing: "0.18em" }}
            >
              STATUS — ON TRACK
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
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
                className="label mt-8"
                style={{ color: "var(--muted)" }}
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
