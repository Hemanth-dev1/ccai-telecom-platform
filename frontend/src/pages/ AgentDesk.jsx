import { useEffect, useState } from "react";

import { Filter } from "lucide-react";

import { toast } from "sonner";

import {
  getEscalations,
} from "../services/agentDeskApi";

import {
  QueueRow,
  QueueStats,
  HandoffDialog,
} from "../components/QueueParts";


const FILTERS = [
  ["all", "All"],
  ["high", "High"],
  ["medium", "Medium"],
  ["low", "Low"],
];


function DeskHeader({
  filter,
  onFilterChange,
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

          Agent Desk

        </div>

        <h1 className="
          text-[28px]
          font-medium
          text-[#ededed]
          tracking-tight
        ">

          Escalation queue

        </h1>

        <div className="
          text-[13px]
          text-[#8A8F98]
          mt-1
        ">

          Conversations awaiting
          human review with
          full AI context.

        </div>

      </div>

      <div className="
        flex
        items-center
        gap-3
      ">

        {/* FILTERS */}

        <div className="
          flex
          items-center
          gap-1
          border
          border-[#1F1F22]
          bg-[#0A0A0B]
          rounded-md
          p-0.5
        ">

          {FILTERS.map(
            ([value, label]) => {

              const active =
                filter === value;

              return (

                <button

                  key={value}

                  onClick={() =>
                    onFilterChange(value)
                  }

                  className={`
                    h-7
                    px-3
                    rounded
                    text-[12px]
                    transition-colors
                    ${
                      active
                        ? "bg-[#0F0F11] text-[#ededed]"
                        : "text-[#8A8F98] hover:text-[#ededed]"
                    }
                  `}
                >

                  {label}

                </button>
              );
            }
          )}

        </div>

        {/* FILTER BTN */}

        <button className="
          h-8
          px-3
          flex
          items-center
          gap-1.5
          border
          border-[#1F1F22]
          hover:border-[#2a2a2e]
          bg-[#0A0A0B]
          rounded-md
          text-[12px]
          text-[#ededed]
          transition-colors
        ">

          <Filter
            className="h-3.5 w-3.5"
            strokeWidth={1.5}
          />

          Filters

        </button>

      </div>

    </div>
  );
}


function QueueHeaderRow() {

  return (

    <div className="
      grid
      grid-cols-12
      px-5
      h-9
      items-center
      border-b
      border-[#1F1F22]
      font-mono
      text-[10px]
      uppercase
      tracking-[0.18em]
      text-[#5C5F66]
    ">

      <div className="col-span-3">
        Customer
      </div>

      <div className="col-span-2">
        Intent
      </div>

      <div className="col-span-2">
        Sentiment
      </div>

      <div className="col-span-1">
        Wait
      </div>

      <div className="col-span-2">
        AI confidence
      </div>

      <div className="
        col-span-2
        text-right
      ">
        Action
      </div>

    </div>
  );
}


export default function AgentDesk() {

  const [active, setActive] =
    useState(null);

  const [filter, setFilter] =
    useState("all");

  const [queue, setQueue] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // =====================================
  // LOAD ESCALATIONS
  // =====================================

  useEffect(() => {

    async function loadQueue() {

      try {

        setLoading(true);

        const data =
          await getEscalations();

        console.log(
          "ESCALATION DATA:",
          data
        );

        setQueue(data.queue);

      } catch (error) {

        console.error(
          "ESCALATION LOAD ERROR:",
          error
        );

      } finally {

        setLoading(false);
      }
    }

    loadQueue();

    const interval = setInterval(
      loadQueue,
      5000
    );

    return () =>
      clearInterval(interval);

  }, []);


  // =====================================
  // SORT QUEUE BY PRIORITY
  // =====================================

  const sortedQueue = [...queue].sort(
    (a, b) => {

      const priority = {
        high: 3,
        medium: 2,
        low: 1,
      };

      return (
        priority[b.risk_level] -
        priority[a.risk_level]
      );
    }
  );


  // =====================================
  // FILTER QUEUE
  // =====================================

  const visible = sortedQueue.filter(
    (q) => {

      if (filter === "all") {
        return true;
      }

      return (
        q.risk_level === filter
      );
    }
  );


  // =====================================
  // STATS
  // =====================================

  const stats = [

    {
      label: "In queue",
      value: visible.length,
    },

    {
      label: "Avg. wait (sim)",
      value: "2m 14s",
    },

    {
      label: "Available agents (sim)",
      value: "9 / 14",
    },

    {
      label:
        "Handoff confidence (sim)",

      value: "0.91 avg",
    },
  ];


  // =====================================
  // HANDOFF
  // =====================================

  const handleAccept = (q) => {

    toast.success(
      `Conversation ${q.id} assigned to you`,
      {
        description:
          `Customer: ${q.customer} · Intent: ${q.intent}`,
      }
    );

    setActive(null);
  };


  // =====================================
  // RENDER
  // =====================================

  return (

    <div
      data-testid="page-agent-desk"
      className="
        px-6
        lg:px-10
        pt-6
        pb-12
      "
    >

      <DeskHeader

        filter={filter}

        onFilterChange={
          setFilter
        }
      />

      <QueueStats
        stats={stats}
      />

      <div
        data-testid="queue-table"
        className="
          border
          border-[#1F1F22]
          rounded-lg
          bg-[#0A0A0B]
          overflow-hidden
        "
      >

        <QueueHeaderRow />

        {/* LOADING */}

        {loading && (

          <div className="
            p-8
            text-center
            text-[#8A8F98]
            text-sm
          ">

            Loading escalation queue...

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          visible.length === 0 && (

          <div className="
            p-8
            text-center
            text-[#8A8F98]
            text-sm
          ">

            No escalations found.

          </div>
        )}

        {/* ROWS */}

        {!loading &&
          visible.map((q) => (

          <QueueRow

            key={q.id}

            row={q}

            onOpen={setActive}
          />

        ))}

      </div>

      {/* DIALOG */}

      <HandoffDialog

        active={active}

        onClose={() =>
          setActive(null)
        }

        onAccept={handleAccept}
      />

    </div>
  );
}