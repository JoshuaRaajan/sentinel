import { useEffect, useRef, useState } from "react";
import { generateChangeOrder } from "@/lib/api";
import { fmtUsd } from "@/lib/scope";
import { toast } from "sonner";

export default function ChangeOrderModal({ open, onClose, project, task }) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [typed, setTyped] = useState("");
  const [error, setError] = useState(null);
  const cancelRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    cancelRef.current = false;
    setText("");
    setTyped("");
    setError(null);
    setLoading(true);
    (async () => {
      try {
        const email = await generateChangeOrder({
          projectName: project.name,
          clientName: project.client,
          taskName: task.name,
          taskDescription: task.scopeReason || "",
          originalSow: project.scopeText || "",
          estimatedHours: Number(task.estHours) || Number(task.actualHours) || 0,
          hourlyRate: project.rate,
          timelineImpactDays: null,
        });
        if (cancelRef.current) return;
        setText(email);
        setLoading(false);
      } catch (e) {
        if (cancelRef.current) return;
        setError(
          e?.response?.data?.detail ||
            "Could not generate change order. Check the LLM key.",
        );
        setLoading(false);
      }
    })();
    return () => {
      cancelRef.current = true;
    };
  }, [open, project, task]);

  // Typewriter effect over the rendered text.
  useEffect(() => {
    if (!text) return;
    let i = 0;
    setTyped("");
    const id = setInterval(() => {
      i += Math.max(2, Math.floor(text.length / 600));
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 14);
    return () => clearInterval(id);
  }, [text]);

  if (!open) return null;
  const cost = fmtUsd((task.estHours || task.actualHours || 0) * project.rate);

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-ink/60 p-0 sm:p-6"
      onClick={onClose}
      data-testid="change-order-modal"
    >
      <div
        className="bg-surface w-full max-w-3xl border border-line flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "100vh" }}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-orange">
              / CHANGE ORDER
            </div>
            <div className="font-serif text-2xl text-ink mt-1">
              {project.name} — {task.name}
            </div>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-[11px] tracking-wider uppercase text-mute hover:text-ink"
            data-testid="change-order-close"
          >
            CLOSE ✕
          </button>
        </div>

        <div className="px-6 py-3 border-b border-line bg-decoration font-mono text-[11px] tracking-wider uppercase text-mute flex flex-wrap gap-x-6 gap-y-1">
          <span>EST {task.estHours || task.actualHours || 0}H</span>
          <span>RATE ${project.rate}/H</span>
          <span className="text-orange">UNBILLED {cost}</span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 font-mono text-[13px] leading-[1.7] text-ink whitespace-pre-wrap">
          {loading && (
            <div className="text-mute" data-testid="change-order-loading">
              / SENTINEL IS WRITING YOUR CHANGE ORDER...
            </div>
          )}
          {error && (
            <div className="text-orange" data-testid="change-order-error">
              {error}
            </div>
          )}
          {!loading && !error && (
            <div data-testid="change-order-body">
              <span className={typed.length < text.length ? "caret" : ""}>
                {typed}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-line px-6 py-4 flex flex-wrap items-center gap-3">
          <button
            disabled={loading || !text}
            onClick={() => {
              navigator.clipboard.writeText(text);
              toast("Change order copied to clipboard");
            }}
            className="font-mono text-[11px] tracking-wider uppercase px-4 py-2 border border-ink bg-ink text-canvas disabled:opacity-40 hover:bg-orange hover:border-orange transition-colors"
            data-testid="change-order-copy"
          >
            COPY CHANGE ORDER →
          </button>
          <button
            disabled={loading || !text}
            onClick={() => {
              toast("Sent to client portal (mocked)");
              onClose();
            }}
            className="font-mono text-[11px] tracking-wider uppercase px-4 py-2 border border-line text-ink hover:border-ink disabled:opacity-40"
            data-testid="change-order-send"
          >
            SEND TO CLIENT PORTAL →
          </button>
          <span className="ml-auto font-mono text-[10px] tracking-wider uppercase text-mute">
            / WRITTEN BY SENTINEL
          </span>
        </div>
      </div>
    </div>
  );
}
