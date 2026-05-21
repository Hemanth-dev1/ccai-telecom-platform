import { useState, useEffect, useCallback } from "react";
import {
  Phone,
  Clock,
  AlertTriangle,
  ShieldAlert,
  UserCheck,
  Search,
  Filter,
  ChevronRight,
  RefreshCw,
  MessageSquare,
  TrendingUp,
  Activity,
  X,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";
import { getEscalations } from "../services/agentDeskApi";

// =====================================
// SEVERITY STYLES
// =====================================

const severityBorder = (level) => {
  if (level === "high") return "border-[#FF4D6D]/40";
  if (level === "medium") return "border-[#F5A623]/40";
  return "border-[#1F1F22]";
};

const severityBg = (level) => {
  if (level === "high") return "bg-[#FF4D6D]/10";
  if (level === "medium") return "bg-[#F5A623]/10";
  return "bg-[#0F0F11]";
};

const severityDot = (level) => {
  if (level === "high") return "bg-[#FF4D6D]";
  if (level === "medium") return "bg-[#F5A623]";
  if (level === "low") return "bg-[#2DD4BF]";
  return "bg-[#5C5F66]";
};

const severityText = (level) => {
  if (level === "high") return "text-[#FF4D6D]";
  if (level === "medium") return "text-[#F5A623]";
  return "text-[#8A8F98]";
};

// =====================================
// STAT CARD
// =====================================

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="border border-[#1F1F22] rounded-lg bg-[#0A0A0B] p-4 hover:border-[#2a2a2e] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5C5F66]">
          {label}
        </span>
        <Icon className={`h-3.5 w-3.5 ${color || "text-[#8A8F98]"}`} strokeWidth={1.5} />
      </div>
      <div className="font-display text-[22px] font-medium tracking-tight text-[#ededed]">
        {value}
      </div>
    </div>
  );
}

// =====================================
// QUEUE ITEM
// =====================================

function QueueItem({ item, selected, onSelect }) {
  const isSelected = selected?.id === item.id;

  return (
    <button
      onClick={() => onSelect(item)}
      className={`w-full text-left px-4 py-3.5 border-b border-[#1F1F22] hover:bg-[#0F0F11] transition-colors ${
        isSelected ? "bg-[#0F0F11] border-l-2 border-l-[#00E5FF]" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`h-2 w-2 rounded-full flex-shrink-0 ${severityDot(item.risk_level)}`} />
          <span className="text-[13px] text-[#ededed] truncate font-medium">
            {item.intent || "Unknown intent"}
          </span>
        </div>
        <span className={`font-mono text-[10px] uppercase tracking-[0.16em] flex-shrink-0 ml-2 ${severityText(item.risk_level)}`}>
          {item.risk_level || "unknown"}
        </span>
      </div>

      <div className="flex items-center gap-3 text-[11px] text-[#8A8F98]">
        <span className="font-mono truncate max-w-[120px]">{item.session_id}</span>
        <span className="h-0.5 w-0.5 rounded-full bg-[#1F1F22]" />
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" strokeWidth={1.5} />
          {item.wait_time}
        </span>
        <span className="h-0.5 w-0.5 rounded-full bg-[#1F1F22]" />
        <span className={`capitalize ${item.sentiment === "angry" ? "text-[#FF4D6D]" : "text-[#8A8F98]"}`}>
          {item.sentiment || "neutral"}
        </span>
      </div>

      {item.message && (
        <p className="mt-1.5 text-[12px] text-[#5C5F66] line-clamp-1 leading-relaxed">
          "{item.message}"
        </p>
      )}
    </button>
  );
}

// =====================================
// DETAIL PANEL
// =====================================

function DetailPanel({ item, onClose }) {
  if (!item) return null;

  const details = [
    { label: "Session ID", value: item.session_id },
    { label: "Customer", value: item.customer },
    { label: "Intent", value: item.intent },
    { label: "Sentiment", value: item.sentiment },
    { label: "Urgency", value: item.urgency },
    { label: "Risk Level", value: item.risk_level },
    { label: "Confidence", value: item.confidence ? `${(item.confidence * 100).toFixed(0)}%` : "--" },
    { label: "Wait Time", value: item.wait_time },
  ];

  return (
    <div className="border-l border-[#1F1F22] bg-[#0A0A0B] w-[360px] flex-shrink-0 overflow-y-auto">
      <div className="sticky top-0 bg-[#0A0A0B]/95 backdrop-blur-md border-b border-[#1F1F22] px-5 py-4 flex items-center justify-between z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${severityDot(item.risk_level)}`} />
            <h3 className="text-[14px] font-medium text-[#ededed]">Escalation Details</h3>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#5C5F66] mt-1">
            Case {item.id}
          </p>
        </div>
        <button
          onClick={onClose}
          className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-[#111113] transition-colors"
        >
          <X className="h-3.5 w-3.5 text-[#8A8F98]" strokeWidth={1.5} />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Status Banner */}
        <div className={`border rounded-md p-3 ${severityBorder(item.risk_level)} ${severityBg(item.risk_level)}`}>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className={`h-4 w-4 ${severityText(item.risk_level)}`} strokeWidth={1.5} />
            <span className={`text-[13px] font-medium ${severityText(item.risk_level)}`}>
              {item.risk_level === "high" ? "Requires Immediate Attention" : "Monitoring"}
            </span>
          </div>
          <p className="text-[11px] text-[#8A8F98]">
            {item.risk_level === "high"
              ? "This conversation has been flagged for escalation based on risk analysis."
              : "This conversation is being monitored for potential escalation triggers."}
          </p>
        </div>

        {/* Details Grid */}
        <div className="space-y-2">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#5C5F66]">Case Information</h4>
          <div className="grid grid-cols-2 gap-2">
            {details.map((d) => (
              <div key={d.label} className="border border-[#1F1F22] rounded-md px-3 py-2 bg-[#0F0F11]">
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#5C5F66] mb-0.5">
                  {d.label}
                </div>
                <div className={`text-[12px] ${d.label === "Risk Level" ? severityText(item.risk_level) : "text-[#ededed]"}`}>
                  {d.value || "--"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Preview */}
        {item.message && (
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#5C5F66] mb-2">Latest Message</h4>
            <div className="border border-[#1F1F22] rounded-md p-3 bg-[#0F0F11]">
              <p className="text-[12px] text-[#8A8F98] leading-relaxed">"{item.message}"</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-2 border-t border-[#1F1F22]">
          <button className="w-full flex items-center justify-center gap-2 h-9 rounded-md bg-[#00E5FF] text-[#050505] hover:bg-[#33EEFF] transition-colors text-[12px] font-medium">
            <UserCheck className="h-3.5 w-3.5" strokeWidth={2} />
            Assign to me
          </button>
          <button className="w-full flex items-center justify-center gap-2 h-9 rounded-md border border-[#1F1F22] text-[#ededed] hover:border-[#2a2a2e] transition-colors text-[12px]">
            <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.5} />
            View conversation
          </button>
          <button className="w-full flex items-center justify-center gap-2 h-9 rounded-md border border-[#2DD4BF]/30 text-[#2DD4BF] hover:bg-[#2DD4BF]/10 transition-colors text-[12px]">
            <CheckCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
            Mark resolved
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================
// AGENT DESK PAGE
// =====================================

export default function AgentDesk() {
  const [queue, setQueue] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");

  // =====================================
  // LOAD ESCALATIONS
  // =====================================

  const loadEscalations = useCallback(async () => {
    try {
      const data = await getEscalations();
      setQueue(data.queue || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Failed to load escalations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEscalations();
  }, [loadEscalations]);

  // =====================================
  // FILTER
  // =====================================

  const filtered = queue.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.intent?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.session_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = filterRisk === "all" || item.risk_level === filterRisk;

    return matchesSearch && matchesRisk;
  });

  // =====================================
  // STATS
  // =====================================

  const highCount = queue.filter((i) => i.risk_level === "high").length;
  const mediumCount = queue.filter((i) => i.risk_level === "medium").length;
  const angryCount = queue.filter((i) => i.sentiment === "angry").length;

  // =====================================
  // UI
  // =====================================

  return (
    <div
      data-testid="page-agent-desk"
      className="px-6 lg:px-10 pt-6 pb-10"
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#5C5F66] mb-2">
            <span>Operations</span>
            <ChevronRight className="h-3 w-3" />
            <span>Agent Desk</span>
          </div>
          <h1 className="font-display text-[26px] font-medium text-[#ededed] tracking-tight">
            Escalation Queue
          </h1>
          <p className="text-[13px] text-[#8A8F98] mt-1">
            Real-time agent monitoring and escalation management.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={loadEscalations}
            className="h-8 px-3 border border-[#1F1F22] rounded-md text-[12px] text-[#ededed] hover:border-[#2A2A2E] transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="h-3 w-3" strokeWidth={1.5} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Escalations" value={total} icon={ShieldAlert} color="text-[#FF4D6D]" />
        <StatCard label="High Risk" value={highCount} icon={AlertTriangle} color="text-[#FF4D6D]" />
        <StatCard label="Medium Risk" value={mediumCount} icon={Activity} color="text-[#F5A623]" />
        <StatCard label="Angry" value={angryCount} icon={TrendingUp} color="text-[#FF4D6D]" />
      </div>

      {/* Main Content */}
      <div className="flex border border-[#1F1F22] rounded-lg overflow-hidden h-[calc(100vh-340px)] min-h-[460px]">
        {/* Queue List */}
        <div className="flex-1 flex flex-col bg-[#0A0A0B] min-w-0">
          {/* Search & Filter */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1F1F22]">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5C5F66]" strokeWidth={1.5} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search intents, sessions, messages..."
                className="w-full h-8 pl-8 pr-3 bg-[#0F0F11] border border-[#1F1F22] rounded-md text-[12px] text-[#ededed] placeholder:text-[#5C5F66] outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-[#5C5F66]" strokeWidth={1.5} />
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="h-8 bg-[#0F0F11] border border-[#1F1F22] rounded-md px-2 text-[11px] text-[#ededed] outline-none"
              >
                <option value="all">All risk</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <span className="font-mono text-[10px] text-[#5C5F66] flex-shrink-0">
              {filtered.length} results
            </span>
          </div>

          {/* Queue */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3 text-[#5C5F66]">
                  <div className="h-6 w-6 border-2 border-[#00E5FF]/30 border-t-[#00E5FF] rounded-full animate-spin" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
                    Loading queue...
                  </span>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3 text-[#5C5F66]">
                  <CheckCircle className="h-8 w-8 text-[#2DD4BF]" strokeWidth={1.5} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
                    {searchQuery || filterRisk !== "all"
                      ? "No matching escalations found"
                      : "No active escalations"}
                  </span>
                </div>
              </div>
            ) : (
              filtered.map((item) => (
                <QueueItem
                  key={item.id}
                  item={item}
                  selected={selected}
                  onSelect={setSelected}
                />
              ))
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <DetailPanel item={selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  );
}
