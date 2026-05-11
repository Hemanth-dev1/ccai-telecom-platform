import { useEffect, useState } from "react";

import { getAnalytics } from "../services/analyticsApi";

import {

  KpiCard,

  VolumeChart,

  IntentsList,

  EscalationsChart,

  DistributionChart,

} from "../components/AnalyticsCards";


function AnalyticsHeader({

  range,

  onRangeChange,
}) {

  return (

    <div className="
      flex
      items-end
      justify-between
      mb-6
    ">

      <div>

        <div className="
          font-mono
          text-[10px]
          uppercase
          tracking-[0.2em]
          text-[#5C5F66]
          mb-2
        ">

          AI Operations

        </div>

        <h1 className="
          text-[28px]
          font-medium
          text-[#ededed]
          tracking-tight
        ">

          Orchestration Analytics

        </h1>

        <div className="
          text-[13px]
          text-[#8A8F98]
          mt-1
        ">

          Real-time orchestration
          telemetry and operational intelligence.

        </div>

      </div>

      <div className="
        flex
        items-center
        gap-2
      ">

        <select

          value={range}

          onChange={(e) =>
            onRangeChange(
              e.target.value
            )
          }

          className="
            w-[140px]
            h-8
            bg-[#0A0A0B]
            border
            border-[#1F1F22]
            rounded-md
            px-2
            text-[12px]
            text-[#ededed]
            outline-none
          "
        >

          <option value="24h">
            Last 24 hours
          </option>

          <option value="7d">
            Last 7 days
          </option>

          <option value="30d">
            Last 30 days
          </option>

        </select>

      </div>

    </div>
  );
}


export default function Analytics() {

  const [range, setRange] =
    useState("24h");

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // =====================================
  // LOAD ANALYTICS
  // =====================================

  useEffect(() => {

    async function loadAnalytics() {

      try {

        const data =
          await getAnalytics();

        console.log(
          "ANALYTICS:",
          data
        );

        setAnalytics(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    }

    loadAnalytics();

  }, []);

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="
        p-10
        text-[#8A8F98]
      ">

        Loading analytics...

      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (!analytics) {

    return (

      <div className="
        p-10
        text-red-400
      ">

        Failed to load analytics.

      </div>
    );
  }

  // =====================================
  // KPI DATA
  // =====================================

  const kpis = [

    {
      label: "Conversations",

      value:
        analytics.total_conversations,

      delta: "+live",

      trend: "up",
    },

    {
      label: "Messages",

      value:
        analytics.total_messages,

      delta: "+active",

      trend: "up",
    },

    {
      label: "Escalations",

      value:
        analytics.escalations,

      delta: "+risk",

      trend: "up",
    },

    {
      label: "Intents",

      value:
        Object.keys(
          analytics.top_intents || {}
        ).length,

      delta: "+tracked",

      trend: "up",
    },

    {
      label: "Flows",

      value:
        Object.keys(
          analytics.flow_distribution || {}
        ).length,

      delta: "+cx",

      trend: "up",
    },

    {
      label: "Sentiments",

      value:
        Object.keys(
          analytics.sentiment_distribution || {}
        ).length,

      delta: "+classified",

      trend: "up",
    },

    {
      label: "Risk States",

      value:
        Object.keys(
          analytics.risk_distribution || {}
        ).length,

      delta: "+monitored",

      trend: "up",
    },

    {
      label: "Customer States",

      value:
        Object.keys(
          analytics.customer_states || {}
        ).length,

      delta: "+behavior",

      trend: "up",
    },
  ];

  // =====================================
  // INTENTS
  // =====================================

  const intents = Object.entries(
    analytics.top_intents || {}
  ).map(([name, value]) => ({

    name,

    value,
  }));

  // =====================================
  // SENTIMENT
  // =====================================

  const sentimentData = Object.entries(

    analytics.sentiment_distribution || {}

  ).map(([name, value]) => ({

    name,

    value,
  }));

  // =====================================
  // RISK
  // =====================================

  const riskData = Object.entries(

    analytics.risk_distribution || {}

  ).map(([name, value]) => ({

    name,

    value,
  }));

  // =====================================
  // CUSTOMER STATES
  // =====================================

  const customerStates = Object.entries(

    analytics.customer_states || {}

  ).map(([name, value]) => ({

    name,

    value,
  }));

  // =====================================
  // ESCALATIONS
  // =====================================

  const escalations = [

    {

      day: "Live",

      rate:
        analytics.escalations || 0,
    },
  ];

  const escalationTimeline =
    analytics.escalation_timeline || [];

  // =====================================
  // VOLUME
  // =====================================

  const volume = analytics.volume || [];

  // =====================================
  // UI
  // =====================================

  return (

    <div
      data-testid="page-analytics"
      className="
        px-6
        lg:px-10
        pt-6
        pb-12
      "
    >

      <AnalyticsHeader

        range={range}

        onRangeChange={setRange}
      />

      {/* KPI */}

      <div className="
        grid
        grid-cols-2
        lg:grid-cols-4
        xl:grid-cols-8
        gap-4
      ">

        {kpis.map((k) => (

          <KpiCard

            key={k.label}

            k={k}
          />
        ))}

      </div>

      {/* MAIN CHARTS */}

      <div className="
        grid
        grid-cols-1
        lg:grid-cols-12
        gap-4
        mt-4
      ">

        <VolumeChart
          data={volume}
        />

        <IntentsList
          intents={intents}
        />

      </div>

      {/* DISTRIBUTIONS */}

      <div className="
        grid
        grid-cols-1
        lg:grid-cols-12
        gap-4
        mt-4
      ">

        <EscalationsChart
          data={escalationTimeline}
        />

        <DistributionChart

          title="Sentiment Distribution"

          subtitle="Customer emotional states"

          data={sentimentData}
        />

        <DistributionChart

          title="Risk Distribution"

          subtitle="Operational severity"

          data={riskData}
        />

      </div>

      {/* CUSTOMER STATES */}

      <div className="
        grid
        grid-cols-1
        lg:grid-cols-12
        gap-4
        mt-4
      ">

        <DistributionChart

          title="Customer State Analysis"

          subtitle="Behavioral orchestration states"

          data={customerStates}
        />

      </div>

    </div>
  );
}