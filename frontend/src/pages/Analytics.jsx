import { useEffect, useState, useCallback, useRef } from "react";

import { getAnalytics } from "../services/analyticsApi";

import {
  KpiCard,
  VolumeChart,
  IntentsList,
  EscalationsChart,
  DistributionChart,
  MessageTimelineChart,
  DistributionDonutChart,
  FlowChart,
} from "../components/AnalyticsCards";

import { RefreshCw, Activity } from "lucide-react";

// =====================================
// HEADER
// =====================================

function AnalyticsHeader({ range, onRangeChange, loading, onRefresh, autoRefresh, onAutoRefreshToggle }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5C5F66] mb-2">
          AI Operations
        </div>
        <h1 className="text-[28px] font-medium text-[#ededed] tracking-tight">
          Orchestration Analytics
        </h1>
        <div className="text-[13px] text-[#8A8F98] mt-1">
          Real-time orchestration telemetry and operational intelligence.
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onAutoRefreshToggle}
          className={`h-8 px-3 border rounded-md text-[11px] transition-colors flex items-center gap-1.5 ${
            autoRefresh
              ? "border-[#00E5FF]/40 text-[#00E5FF] bg-[#00E5FF]/5"
              : "border-[#1F1F22] text-[#8A8F98] hover:text-[#ededed]"
          }`}
        >
          <Activity className={`h-3 w-3 ${autoRefresh ? "animate-pulse" : ""}`} strokeWidth={1.5} />
          {autoRefresh ? "Auto-refresh on" : "Auto-refresh"}
        </button>
        <select
          value={range}
          onChange={(e) => onRangeChange(e.target.value)}
          className="w-[140px] h-8 bg-[#0A0A0B] border border-[#1F1F22] rounded-md px-2 text-[12px] text-[#ededed] outline-none"
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="h-8 w-8 flex items-center justify-center border border-[#1F1F22] rounded-md text-[#8A8F98] hover:text-[#ededed] hover:border-[#2a2a2e] transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

// =====================================
// COLOR MAPS
// =====================================

const sentimentColors = {
  happy: "#2DD4BF",
  neutral: "#8A8F98",
  frustrated: "#F5A623",
  angry: "#FF4D6D",
};

const riskColors = {
  low: "#2DD4BF",
  medium: "#F5A623",
  high: "#FF4D6D",
};

const impactColors = {
  low: "#2DD4BF",
  medium: "#F5A623",
  high: "#FF4D6D",
  critical: "#FF4D6D",
};

// =====================================
// PAGE
// =====================================

export default function Analytics() {
  const [range, setRange] = useState("24h");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef(null);

  // =====================================
  // LOAD ANALYTICS
  // =====================================

  const loadAnalytics = useCallback(async (selectedRange) => {
    setLoading(true);
    try {
      const data = await getAnalytics(selectedRange || range);
      console.log("ANALYTICS:", data);
      setAnalytics(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [range]);

  // Initial load & on range change
  useEffect(() => {
    loadAnalytics(range);
  }, [range, loadAnalytics]);

  // Auto-refresh interval
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        loadAnalytics(range);
      }, 15000); // every 15 seconds
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, range, loadAnalytics]);

  const handleRangeChange = (newRange) => {
    setRange(newRange);
  };

  const handleAutoRefreshToggle = () => {
    setAutoRefresh((prev) => !prev);
  };

  // =====================================
  // LOADING
  // =====================================

  if (!analytics) {
    return (
      <div className="px-6 lg:px-10 pt-6 pb-12">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3 text-[#5C5F66]">
            <div className="h-6 w-6 border-2 border-[#00E5FF]/30 border-t-[#00E5FF] rounded-full animate-spin" />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em]">Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  // =====================================
  // KPI DATA
  // =====================================

  const kpis = [
    { label: "Conversations", value: analytics.total_conversations, delta: "+live", trend: "up" },
    { label: "Messages", value: analytics.total_messages, delta: "+active", trend: "up" },
    { label: "Escalations", value: analytics.escalations, delta: "+risk", trend: "up" },
    { label: "Intents", value: Object.keys(analytics.top_intents || {}).length, delta: "+tracked", trend: "up" },
    { label: "Flows", value: Object.keys(analytics.flow_distribution || {}).length, delta: "+cx", trend: "up" },
    { label: "Sentiments", value: Object.keys(analytics.sentiment_distribution || {}).length, delta: "+classified", trend: "up" },
    { label: "Risk States", value: Object.keys(analytics.risk_distribution || {}).length, delta: "+monitored", trend: "up" },
    { label: "Customer States", value: Object.keys(analytics.customer_states || {}).length, delta: "+behavior", trend: "up" },
  ];

  // =====================================
  // CHART DATA
  // =====================================

  const intents = Object.entries(analytics.top_intents || {}).map(([name, value]) => ({ name, value }));
  const sentimentData = Object.entries(analytics.sentiment_distribution || {}).map(([name, value]) => ({ name, value }));
  const riskData = Object.entries(analytics.risk_distribution || {}).map(([name, value]) => ({ name, value }));
  const customerStates = Object.entries(analytics.customer_states || {}).map(([name, value]) => ({ name, value }));
  const businessImpact = Object.entries(analytics.business_impact || {}).map(([name, value]) => ({ name, value }));
  const flows = Object.entries(analytics.flow_distribution || {}).map(([name, value]) => ({ name, value }));
  const escalationTimeline = analytics.escalation_timeline || [];
  const volume = analytics.volume || [];
  const messageTimeline = analytics.message_timeline || [];

  return (
    <div data-testid="page-analytics" className="px-6 lg:px-10 pt-6 pb-12">
      <AnalyticsHeader
        range={range}
        onRangeChange={handleRangeChange}
        loading={loading}
        onRefresh={() => loadAnalytics(range)}
        autoRefresh={autoRefresh}
        onAutoRefreshToggle={handleAutoRefreshToggle}
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {kpis.map((k) => (
          <KpiCard key={k.label} k={k} />
        ))}
      </div>

      {/* Volume + Intents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
        <VolumeChart data={volume} />
        <IntentsList intents={intents} />
      </div>

      {/* Escalations + Message Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
        <EscalationsChart data={escalationTimeline} />
        <MessageTimelineChart data={messageTimeline} />
      </div>

      {/* Distributions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
        <DistributionChart title="Sentiment Distribution" subtitle="Customer emotional states" data={sentimentData} />
        <DistributionChart title="Risk Distribution" subtitle="Operational severity" data={riskData} />
        <FlowChart data={flows} />
      </div>

      {/* Customer States + Business Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
        <DistributionDonutChart
          title="Customer State Analysis"
          subtitle="Behavioral orchestration states"
          data={customerStates}
          colorMap={sentimentColors}
        />
        <DistributionDonutChart
          title="Business Impact"
          subtitle="Operational severity analysis"
          data={businessImpact}
          colorMap={impactColors}
        />
      </div>
    </div>
  );
}
