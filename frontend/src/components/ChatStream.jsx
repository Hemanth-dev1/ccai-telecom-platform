import { useEffect, useRef, useState, useCallback } from "react";

import {
  Send,
  Sparkles,
  Paperclip,
  ChevronDown,
  MessageSquare,
  Zap,
  Database,
  BrainCircuit,
} from "lucide-react";

// =====================================
// TYPEWRITER TEXT
// =====================================

function TypewriterText({ text, speed = 20, onComplete }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");

    if (!text) return;

    const type = () => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
        timerRef.current = setTimeout(type, speed);
      } else {
        onComplete?.();
      }
    };

    timerRef.current = setTimeout(type, 80);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, speed, onComplete]);

  return <span>{displayed}</span>;
}

// =====================================
// PIPELINE STEPS
// =====================================

const PIPELINE_STEPS = [
  { icon: Zap, label: "Analyzing intent", sublabel: "Dialogflow CX classification" },
  { icon: Database, label: "Retrieving context", sublabel: "RAG knowledge base search" },
  { icon: BrainCircuit, label: "Generating response", sublabel: "Gemini AI reasoning" },
  { icon: Sparkles, label: "Finalizing", sublabel: "Sentiment & orchestration analysis" },
];

function PipelineIndicator({ step }) {
  const currentIdx = Math.min(step, PIPELINE_STEPS.length - 1);

  return (
    <div className="border-l-2 border-[#00E5FF]/60 pl-4 py-3 space-y-3">
      {PIPELINE_STEPS.map((s, i) => {
        const Icon = s.icon;
        const isActive = i === currentIdx;
        const isDone = i < currentIdx;

        return (
          <div key={s.label} className="flex items-center gap-3">
            <div className={`h-5 w-5 flex items-center justify-center rounded-full transition-all duration-500 ${
              isActive
                ? "bg-[#00E5FF]/20"
                : isDone
                ? "bg-[#2DD4BF]/20"
                : "bg-[#1F1F22]"
            }`}>
              {isDone ? (
                <div className="h-2 w-2 rounded-full bg-[#2DD4BF]" />
              ) : (
                <Icon
                  className={`h-3 w-3 ${isActive ? "text-[#00E5FF] animate-pulse" : "text-[#5C5F66]"}`}
                  strokeWidth={1.5}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-[12px] ${isActive ? "text-[#ededed]" : "text-[#5C5F66]"} transition-colors duration-300`}>
                {s.label}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#5C5F66]">
                {isActive ? s.sublabel : isDone ? "complete" : "pending"}
              </div>
            </div>
            {isActive && (
              <div className="h-2 w-2 rounded-full bg-[#00E5FF] pulse-dot flex-shrink-0" />
            )}
          </div>
        );
      })}
      <div className="h-px w-48 tracing-beam mt-2" />
    </div>
  );
}

// =====================================
// EMPTY STATE
// =====================================

function EmptyState({ onSuggestion }) {
  const suggestions = [
    "My internet is not working",
    "I need help with roaming",
    "My bill is too high",
    "How do I recharge?",
  ];

  return (
    <div className="flex items-center justify-center h-full px-8">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="h-14 w-14 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center mb-6">
          <MessageSquare className="h-7 w-7 text-[#00E5FF]" strokeWidth={1.5} />
        </div>
        <h2 className="text-[20px] font-display font-medium text-[#ededed] mb-2">
          Start a conversation
        </h2>
        <p className="text-[13px] text-[#8A8F98] leading-relaxed mb-8 max-w-sm">
          Aurora AI is ready to assist with telecom operations — billing inquiries,
          network troubleshooting, roaming support, and more.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((text) => (
            <button
              key={text}
              onClick={() => onSuggestion(text)}
              className="px-3.5 py-2 border border-[#1F1F22] rounded-md text-[12px] text-[#8A8F98] hover:border-[#00E5FF]/30 hover:text-[#ededed] hover:bg-[#00E5FF]/5 transition-all duration-200"
            >
              {text}
            </button>
          ))}
        </div>
        <div className="mt-10 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#5C5F66]">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />
            RAG · active
          </span>
          <span className="h-0.5 w-0.5 rounded-full bg-[#1F1F22]" />
          <span>Dialogflow CX</span>
          <span className="h-0.5 w-0.5 rounded-full bg-[#1F1F22]" />
          <span>Gemini AI</span>
        </div>
      </div>
    </div>
  );
}

// =====================================
// MESSAGE META
// =====================================

function MessageMeta({ meta, sources }) {
  if (!meta && !sources?.length) return null;

  const severityColor = (risk) => {
    if (risk === "high") return "border-[#FF4D6D]/30 text-[#FF4D6D]";
    if (risk === "medium") return "border-[#F5A623]/30 text-[#F5A623]";
    return "border-[#1F1F22] text-[#8A8F98]";
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em]">
      {meta?.intent && (
        <span className="px-1.5 py-0.5 border border-[#1F1F22] rounded text-[#00E5FF]">
          intent · {meta.intent}
        </span>
      )}
      {meta?.flow && (
        <span className="px-1.5 py-0.5 border border-[#1F1F22] rounded text-[#8A8F98]">
          flow · {meta.flow}
        </span>
      )}
      {meta?.confidence !== undefined && (
        <span className="px-1.5 py-0.5 border border-[#1F1F22] rounded text-[#8A8F98]">
          confidence · {(meta.confidence * 100).toFixed(0)}%
        </span>
      )}
      {meta?.sentiment && (
        <span className={`px-1.5 py-0.5 border rounded ${
          meta.sentiment === "angry"
            ? "border-[#FF4D6D]/30 text-[#FF4D6D]"
            : meta.sentiment === "frustrated"
            ? "border-[#F5A623]/30 text-[#F5A623]"
            : "border-[#1F1F22] text-[#8A8F98]"
        }`}>
          {meta.sentiment}
        </span>
      )}
      {meta?.urgency && (
        <span className={`px-1.5 py-0.5 border rounded ${severityColor(meta.urgency)}`}>
          urgency · {meta.urgency}
        </span>
      )}
      {meta?.risk_level && (
        <span className={`px-1.5 py-0.5 border rounded ${severityColor(meta.risk_level)}`}>
          risk · {meta.risk_level}
        </span>
      )}
      {meta?.requires_escalation && (
        <span className="px-1.5 py-0.5 border border-[#FF4D6D]/30 text-[#FF4D6D] rounded">
          escalation
        </span>
      )}
      {meta?.customer_state && (
        <span className="px-1.5 py-0.5 border border-[#1F1F22] rounded text-[#ededed]">
          {meta.customer_state}
        </span>
      )}
      {meta?.business_impact && (
        <span className={`px-1.5 py-0.5 border rounded ${severityColor(meta.business_impact)}`}>
          impact · {meta.business_impact}
        </span>
      )}
      {sources?.map((source) => (
        <span
          key={source}
          className="px-1.5 py-0.5 border border-[#00E5FF]/25 text-[#00E5FF] rounded normal-case tracking-normal"
        >
          ↳ {source}
        </span>
      ))}
    </div>
  );
}

// =====================================
// CHAT STREAM
// =====================================

export default function ChatStream({
  conversation,
  messages,
  loading,
  sendChatMessage,
  pipelineStep,
}) {
  const [composing, setComposing] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const onSend = useCallback(async (e) => {
    e?.preventDefault();
    if (!composing.trim()) return;
    await sendChatMessage(composing);
    setComposing("");
  }, [composing, sendChatMessage]);

  const handleSuggestion = useCallback((text) => {
    sendChatMessage(text);
  }, [sendChatMessage]);

  const lastAiMessage = messages.reduce((latest, m) => {
    if (m.role === "assistant" && !m.metadata?.synthetic) return m;
    return latest;
  }, null);

  return (
    <section
      data-testid="chat-stream"
      className="flex flex-col h-full border border-[#1F1F22] rounded-lg bg-[#0A0A0B] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 h-14 border-b border-[#1F1F22] bg-[#0A0A0B]">
        <img
          src={conversation.customer.avatar}
          alt=""
          className="h-7 w-7 rounded-full object-cover border border-[#1F1F22]"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-[#ededed] truncate">
              {conversation.customer.name}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#5C5F66]">
              {conversation.id}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#8A8F98]">
            <span>{conversation.customer.msisdn}</span>
            <span className="h-0.5 w-0.5 rounded-full bg-[#1F1F22]" />
            <span>{conversation.customer.plan}</span>
            <span className="h-0.5 w-0.5 rounded-full bg-[#1F1F22]" />
            <span>{conversation.channel}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#1F1F22] font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A8F98]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF] pulse-dot" />
            live
          </span>
        </div>
      </div>

      {/* Messages or Empty State */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 && !loading ? (
          <EmptyState onSuggestion={handleSuggestion} />
        ) : (
          <>
            {messages.map((m) => {
              if (m.role === "system") {
                return (
                  <div
                    key={m.id}
                    className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#5C5F66]"
                  >
                    <span className="px-2 py-0.5">{m.content}</span>
                  </div>
                );
              }

              if (m.role === "user") {
                return (
                  <div key={m.id} className="flex gap-3 fade-up">
                    <img
                      src={conversation.customer.avatar}
                      alt=""
                      className="h-7 w-7 rounded-full object-cover border border-[#1F1F22] flex-shrink-0"
                    />
                    <div className="flex-1 max-w-[78%]">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-[12px] text-[#ededed]">
                          {conversation.customer.name}
                        </span>
                        <span className="font-mono text-[10px] text-[#5C5F66]">
                          {m.timestamp}
                        </span>
                      </div>
                      <div className="px-4 py-3 border border-[#1F1F22] bg-[#0F0F11] rounded-md text-[13.5px] leading-relaxed text-[#ededed]">
                        {m.content}
                      </div>
                    </div>
                  </div>
                );
              }

              // Assistant Message
              const isLatest = m.id === lastAiMessage?.id;
              return (
                <div key={m.id} className="fade-up">
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-[#00E5FF]" strokeWidth={1.5} />
                      <span className="text-[12px] text-[#ededed]">Aurora</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#5C5F66]">AI</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#5C5F66]">{m.timestamp}</span>
                  </div>
                  <div className="border-l-2 border-[#00E5FF]/60 pl-4 py-0.5 text-[14px] leading-relaxed text-[#ededed]">
                    {isLatest ? (
                      <TypewriterText text={m.content} speed={15} />
                    ) : (
                      m.content
                    )}
                    <MessageMeta meta={m.metadata} sources={m.metadata?.sources} />
                  </div>
                </div>
              );
            })}

            {/* AI Thinking with Pipeline Steps */}
            {loading && (
              <div className="fade-up">
                <div className="flex items-baseline gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-[#00E5FF] pulse-dot" strokeWidth={1.5} />
                    <span className="text-[12px] text-[#ededed]">Aurora</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#5C5F66]">processing</span>
                  </div>
                </div>
                <PipelineIndicator step={pipelineStep ?? 0} />
              </div>
            )}

            <div ref={endRef} />
          </>
        )}
      </div>

      {/* Composer */}
      <form onSubmit={onSend} className="border-t border-[#1F1F22] bg-[#0A0A0B] px-4 py-3">
        <div className="flex items-end gap-2 border border-[#1F1F22] rounded-md bg-[#0F0F11] focus-within:border-[#2a2a2e] transition-colors">
          <button type="button" className="p-2.5 text-[#5C5F66] hover:text-[#ededed] transition-colors">
            <Paperclip className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <textarea
            value={composing}
            onChange={(e) => setComposing(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Ask Aurora about telecom operations..."
            rows={1}
            className="flex-1 bg-transparent resize-none py-3 text-[13.5px] text-[#ededed] placeholder:text-[#5C5F66] outline-none"
          />
          <button
            type="submit"
            disabled={!composing.trim() || loading}
            className="m-1.5 flex items-center gap-2 h-8 px-3 rounded-md bg-[#00E5FF] text-[#050505] hover:bg-[#33EEFF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-[12px] font-medium"
          >
            Send
            <Send className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#5C5F66]">
            <span>RAG · active</span>
            <span className="h-0.5 w-0.5 rounded-full bg-[#1F1F22]" />
            <span>language · {conversation.language.toLowerCase()}</span>
          </div>
          <button type="button" className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#5C5F66] hover:text-[#ededed] transition-colors">
            shortcuts
            <ChevronDown className="h-3 w-3" strokeWidth={1.5} />
          </button>
        </div>
      </form>
    </section>
  );
}
