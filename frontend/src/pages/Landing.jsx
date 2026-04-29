import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import LiveCounter from "@/components/LiveCounter";

export default function Landing() {
  return (
    <div className="bg-canvas text-ink">
      <Navbar />
      <LiveCounter />
      <Hero />
      <Story />
      <HowItWorks />
      <TwoViews />
      <Pricing />
      <Testimonials />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <nav
      className="sticky top-0 z-40 bg-surface border-b border-line"
      data-testid="landing-navbar"
    >
      <div className="max-w-[1400px] mx-auto h-[64px] flex items-center px-6">
        <div className="font-mono text-[13px] font-bold tracking-[0.22em] text-ink">
          SENTINEL
        </div>
        <div className="hidden md:flex items-center gap-8 mx-auto">
          {["HOW IT WORKS", "PRICING", "CLIENT PORTAL"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
              className="font-mono text-[11px] tracking-[0.18em] uppercase text-mute hover:text-ink transition-colors"
              data-testid={`navlink-${l.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {l}
            </a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Link
            to="/app"
            className="hidden sm:inline font-mono text-[11px] tracking-[0.18em] uppercase text-ink hover:text-orange transition-colors"
            data-testid="signin-link"
          >
            SIGN IN
          </Link>
          <Link
            to="/new"
            className="font-mono text-[11px] tracking-[0.18em] uppercase bg-orange text-white px-4 py-2 hover:opacity-90 transition-opacity"
            data-testid="cta-start-project-nav"
          >
            START A PROJECT →
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section
      className="relative dot-grid"
      style={{ minHeight: "calc(100vh - 64px - 40px)" }}
      data-testid="hero-section"
    >
      <div className="max-w-[1400px] mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-10 lg:gap-16">
        <div>
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-mute mb-6">
            / PROJECT INTELLIGENCE FOR AGENCIES
          </div>
          <h1
            className="font-serif text-[52px] sm:text-[72px] lg:text-[96px] leading-[0.95] tracking-tight"
            data-testid="hero-headline"
          >
            <div className="text-ink">YOU AGREED TO</div>
            <div className="text-ink">BUILD A WEBSITE.</div>
            <div className="text-orange">THEY ADDED 23</div>
            <div className="text-orange">MORE THINGS.</div>
          </h1>
          <p className="mt-8 font-sans text-[18px] leading-relaxed text-mute max-w-[520px]">
            Sentinel tracks every task against what was agreed. Flags scope creep
            before it costs you. Generates the change order so you don't have to
            have the awkward conversation.
          </p>
          <div className="mt-4 font-mono text-[13px] tracking-wider uppercase text-mute">
            $29/month. No contracts. Cancel anytime.
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/new"
              className="font-mono text-[12px] tracking-[0.18em] uppercase bg-ink text-canvas px-6 py-4 hover:bg-orange transition-colors"
              data-testid="cta-start-project"
            >
              START A PROJECT →
            </Link>
            <a
              href="#how-it-works"
              className="font-mono text-[12px] tracking-[0.18em] uppercase border border-ink text-ink px-6 py-4 hover:bg-ink hover:text-canvas transition-colors"
              data-testid="cta-how-it-works"
            >
              SEE HOW IT WORKS →
            </a>
          </div>
        </div>
        <div className="lg:pt-2">
          <LiveScopePanel />
        </div>
      </div>
    </section>
  );
}

function LiveScopePanel() {
  const [pct, setPct] = useState(73);
  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => {
        const next = p + (Math.random() < 0.5 ? -0.4 : 0.6);
        return Math.max(70, Math.min(78, next));
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const tasks = [
    { name: "Homepage redesign", h: "8 / 8", scope: "in" },
    { name: "Mobile menu animation", h: "3 / 2", scope: "in" },
    { name: "Add a chatbot to homepage", h: "6 / 4", scope: "out" },
    { name: "Blog section build-out", h: "6 / 0", scope: "out" },
  ];

  return (
    <div
      className="bg-surface border border-line p-6"
      data-testid="hero-live-panel"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-mute">
            / LIVE
          </div>
          <div className="font-serif text-2xl mt-1">Lumière Brand Website</div>
        </div>
        <div className="font-mono text-[10px] tracking-wider uppercase text-amber">
          AT RISK
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-wider uppercase text-mute mb-2">
          <span>SCOPE USED</span>
          <span className="text-amber">{Math.round(pct)}% OF AGREED SCOPE</span>
        </div>
        <div className="w-full h-[6px] bg-decoration relative">
          <div
            className="absolute top-0 left-0 h-full bg-amber transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-6 divide-y divide-line border-y border-line">
        {tasks.map((t, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3"
            style={{
              background: t.scope === "out" ? "rgba(255,77,0,0.05)" : undefined,
              borderLeft: t.scope === "out" ? "3px solid #FF4D00" : "3px solid transparent",
              paddingLeft: 10,
            }}
          >
            <span className="font-sans text-[14px]">{t.name}</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-wider uppercase text-mute">
                {t.h}h
              </span>
              <span
                className="font-mono text-[10px] tracking-wider uppercase px-2 py-1"
                style={
                  t.scope === "out"
                    ? {
                        background: "#FFE7DA",
                        color: "#FF4D00",
                        border: "1px solid #FF4D00",
                      }
                    : {
                        background: "#DCEAE3",
                        color: "#2D6A4F",
                        border: "1px solid #2D6A4F",
                      }
                }
              >
                {t.scope === "out" ? "OUT OF SCOPE" : "IN SCOPE"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 font-mono text-[11px] tracking-wider uppercase">
        <Stat label="AGREED" value="40 HRS" />
        <Stat label="USED" value="29 HRS" />
        <Stat label="REMAINING" value="11 HRS" />
      </div>

      <div
        className="mt-6 px-4 py-3 flex items-start gap-3 font-mono text-[11px] tracking-wider"
        style={{
          background: "#FFE7DA",
          border: "1px solid #FF4D00",
          color: "#FF4D00",
        }}
      >
        <span>/!\</span>
        <span className="leading-relaxed">
          2 TASKS OUTSIDE ORIGINAL AGREEMENT — $1,800 UNBILLED
        </span>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border border-line p-3">
      <div className="text-mute">{label}</div>
      <div className="text-ink mt-1">{value}</div>
    </div>
  );
}

function Story() {
  const rows = [
    ["WEEK 01", "Can you also change the font?"],
    ["WEEK 02", "Actually redo the homepage layout"],
    ["WEEK 03", "Add an animation to the hero section"],
    ["WEEK 04", "We need a blog section too"],
    ["WEEK 05", "One more small thing — can you add a chatbot?"],
    ["WEEK 06", "Can we redo the mobile version entirely?"],
  ];
  return (
    <section className="bg-surface border-y border-line" data-testid="story-section">
      <div className="max-w-[1100px] mx-auto px-6 py-24">
        <h2 className="font-serif text-5xl lg:text-6xl tracking-tight">
          Here's what actually happened.
        </h2>
        <p className="mt-3 font-sans text-[18px] text-mute">
          A real project. A familiar story.
        </p>
        <div className="mt-12 border-t border-line">
          {rows.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-[100px_1fr_80px_80px] sm:grid-cols-[110px_1fr_100px_100px] gap-4 items-center py-5 border-b border-line font-mono text-[11px] sm:text-[12px] tracking-wider uppercase"
            >
              <span className="text-mute">{r[0]}</span>
              <span className="text-ink truncate">"{r[1]}"</span>
              <span className="text-green hidden sm:inline">✓ DONE</span>
              <span className="text-mute hidden sm:inline">FREE</span>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t-[6px] border-orange pt-10">
          <h3 className="font-serif text-4xl lg:text-5xl text-ink">
            That was $4,700 of unbilled work.
          </h3>
          <p className="mt-4 font-sans text-[17px] text-mute max-w-[640px]">
            Sound familiar? Sentinel would have flagged every single one.
          </p>
          <Link
            to="/new"
            className="mt-8 inline-block font-mono text-[12px] tracking-[0.18em] uppercase bg-orange text-white px-6 py-4 hover:opacity-90 transition-opacity"
            data-testid="story-cta"
          >
            PROTECT YOUR NEXT PROJECT →
          </Link>
        </div>
      </div>
    </section>
  );
}

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
      className="bg-canvas"
      data-testid="how-it-works-section"
    >
      <div className="max-w-[1300px] mx-auto px-6 py-24">
        <h2 className="font-serif text-5xl lg:text-6xl tracking-tight max-w-3xl">
          Three steps. Zero awkward conversations.
        </h2>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          <div
            aria-hidden
            className="hidden md:block absolute left-0 right-0 top-[80px] h-px bg-line"
          />
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div
                aria-hidden
                className="font-serif absolute -top-10 -left-2 text-[180px] leading-none pointer-events-none select-none"
                style={{ color: "#F2F0EB" }}
              >
                {s.n}
              </div>
              <div className="relative">
                <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-orange">
                  / {s.n}
                </div>
                <h3 className="mt-3 font-serif text-3xl text-ink">{s.t}</h3>
                <p className="mt-4 font-sans text-[15px] leading-relaxed text-mute max-w-sm">
                  {s.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TwoViews() {
  return (
    <section className="border-y border-line" data-testid="two-views-section">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="bg-canvas px-6 py-20 md:px-12 md:border-r border-line">
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-orange">
            / WHAT YOU SEE
          </div>
          <div className="mt-8 bg-surface border border-line p-5">
            <div className="flex items-center justify-between font-mono text-[10px] tracking-wider uppercase text-mute">
              <span>SCOPE USED</span>
              <span className="text-orange">89%</span>
            </div>
            <div className="mt-2 w-full h-[6px] bg-decoration relative">
              <div className="absolute top-0 left-0 h-full bg-orange w-[89%]" />
            </div>
            <div className="mt-5 space-y-3">
              {[
                ["Build About + Services", "in"],
                ["Add chatbot", "out"],
                ["Mobile redesign", "out"],
              ].map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border border-line px-3 py-2"
                  style={{
                    background: t[1] === "out" ? "rgba(255,77,0,0.05)" : undefined,
                    borderLeft: t[1] === "out" ? "3px solid #FF4D00" : "1px solid #E8E4DC",
                  }}
                >
                  <span className="font-sans text-[14px]">{t[0]}</span>
                  <span
                    className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5"
                    style={
                      t[1] === "out"
                        ? { background: "#FFE7DA", color: "#FF4D00", border: "1px solid #FF4D00" }
                        : { background: "#DCEAE3", color: "#2D6A4F", border: "1px solid #2D6A4F" }
                    }
                  >
                    {t[1] === "out" ? "OUT OF SCOPE" : "IN SCOPE"}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="mt-5 px-3 py-2 font-mono text-[11px] tracking-wider"
              style={{ background: "#FFE7DA", color: "#FF4D00", border: "1px solid #FF4D00" }}
            >
              SCOPE CREEP DETECTED — $1,800 UNBILLED
            </div>
          </div>
        </div>
        <div className="bg-surface px-6 py-20 md:px-12">
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-mute">
            / WHAT THEY SEE
          </div>
          <div className="mt-8 bg-surface border border-line p-5">
            <div className="font-serif text-xl">Lumière Brand Website</div>
            <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-[10px] tracking-wider uppercase">
              {["TO DO", "IN PROGRESS", "DONE"].map((c) => (
                <div key={c} className="border border-line p-3">
                  <div className="text-mute">{c}</div>
                  <div className="mt-2 space-y-2">
                    <div className="border border-line p-2 font-sans text-[12px] text-ink">
                      Build About page
                    </div>
                    {c === "DONE" && (
                      <div className="border border-line p-2 font-sans text-[12px] text-ink">
                        Wireframes
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 font-mono text-[10px] tracking-wider uppercase text-mute">
              STATUS — ON TRACK
            </div>
          </div>
        </div>
      </div>
      <div className="bg-canvas px-6 py-16 text-center">
        <h3 className="font-serif text-4xl lg:text-5xl text-ink">
          They see progress.
        </h3>
        <h3 className="font-serif text-4xl lg:text-5xl text-orange mt-2">
          You see the truth.
        </h3>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "SOLO",
      price: "$29",
      sub: "FOR FREELANCERS",
      cta: "START SOLO →",
      ctaClass: "bg-ink text-canvas hover:bg-orange",
      features: [
        "3 active projects",
        "1 user",
        "AI scope detection",
        "Change order generator",
        "T&M calculator",
        "Client portal view",
      ],
    },
    {
      name: "AGENCY",
      price: "$79",
      sub: "MOST POPULAR",
      featured: true,
      cta: "START AGENCY →",
      ctaClass: "bg-orange text-white hover:opacity-90",
      features: [
        "Unlimited projects",
        "Up to 5 users",
        "Everything in Solo",
        "Team task assignment",
        "Slack scope creep alerts",
        "Priority AI processing",
      ],
    },
    {
      name: "WAR ROOM",
      price: "$199",
      sub: "FOR AGENCIES WHO MEAN IT",
      cta: "JOIN WAR ROOM →",
      ctaClass: "bg-ink text-canvas hover:bg-orange",
      features: [
        "Unlimited everything",
        "Unlimited team seats",
        "White label client portal",
        "Custom branding on change orders",
        "Dedicated Slack channel",
        "API access",
      ],
    },
  ];
  return (
    <section
      id="pricing"
      className="bg-canvas border-t border-line"
      data-testid="pricing-section"
    >
      <div className="max-w-[1300px] mx-auto px-6 py-24">
        <h2 className="font-serif text-5xl lg:text-6xl tracking-tight">
          One tool. Three ways in.
        </h2>
        <p className="mt-3 font-sans text-[17px] text-mute max-w-2xl">
          Every plan includes AI scope detection, change order generation, and
          T&M billing.
        </p>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className="bg-surface border border-line p-8 mb-6 md:mb-0"
              style={{
                borderTop: t.featured ? "3px solid #FF4D00" : "1px solid #E8E4DC",
              }}
              data-testid={`pricing-${t.name.toLowerCase().replace(" ", "-")}`}
            >
              <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-mute">
                / {t.sub}
              </div>
              <div className="mt-2 font-mono text-[13px] tracking-[0.22em] uppercase text-ink">
                {t.name}
              </div>
              <div className="mt-6 font-serif text-6xl text-ink">{t.price}</div>
              <div className="font-mono text-[11px] tracking-wider uppercase text-mute">
                /MONTH
              </div>
              <ul className="mt-8 space-y-3 font-sans text-[14px] text-ink">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-orange mt-1">/</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/new"
                className={`mt-8 inline-block w-full text-center font-mono text-[11px] tracking-[0.18em] uppercase px-4 py-3 transition-colors ${t.ctaClass}`}
                data-testid={`cta-${t.name.toLowerCase().replace(" ", "-")}`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-10 font-sans text-[15px] text-mute text-center">
          Used by freelancers and agency owners who are done losing money to
          scope creep.
        </p>
      </div>
    </section>
  );
}

function Testimonials() {
  const cards = [
    {
      tag: "AGY/WEB",
      who: "R. Mehta, Web Agency Owner",
      quote:
        "Caught $2,300 in unbilled work in the first month. The change order email it generates is better than anything I'd write myself.",
    },
    {
      tag: "FRL/DEV",
      who: "S. Kim, Freelance Developer",
      quote:
        "Client added 11 features after sign-off. Sentinel flagged every single one. First time I've ever been paid for everything I actually built.",
    },
    {
      tag: "AGY/DESIGN",
      who: "P. Osei, Brand Design Studio",
      quote:
        "The client portal is the best part. They see a clean professional board. We see exactly where the money is going. Night and day.",
    },
  ];
  return (
    <section className="bg-surface border-t border-line" data-testid="testimonials-section">
      <div className="max-w-[1300px] mx-auto px-6 py-24">
        <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-mute">
          / FROM THE FIELD
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div key={i} className="border border-line p-8 bg-surface">
              <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-orange">
                {c.tag}
              </div>
              <p className="mt-6 font-mono text-[13px] leading-[1.7] text-ink">
                "{c.quote}"
              </p>
              <div className="mt-8 font-mono text-[10px] tracking-wider uppercase text-mute">
                — {c.who}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-canvas" data-testid="landing-footer">
      <div className="max-w-[1300px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="font-mono text-[13px] font-bold tracking-[0.22em] text-ink">
            SENTINEL
          </div>
          <p className="mt-4 font-sans text-[14px] text-mute max-w-xs">
            Project intelligence for agencies who bill what they build.
          </p>
        </div>
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-mute space-y-2">
          <a className="block hover:text-ink" href="#how-it-works">
            How It Works
          </a>
          <a className="block hover:text-ink" href="#pricing">
            Pricing
          </a>
          <Link to="/app" className="block hover:text-ink">
            Client Portal
          </Link>
          <Link to="/app" className="block hover:text-ink">
            Sign In
          </Link>
        </div>
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-mute md:text-right">
          © 2025 SENTINEL
        </div>
      </div>
    </footer>
  );
}
