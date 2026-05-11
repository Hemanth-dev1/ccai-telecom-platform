import {
  Crosshair,
  GitBranch,
  ShieldAlert,
  BookText,
  ChevronRight,
  Activity,
  AlertTriangle,
} from "lucide-react";


function PanelCard({

  title,

  icon: Icon,

  children,

  testId,
}) {

  return (

    <div
      data-testid={testId}
      className="
        border
        border-[#1F1F22]
        rounded-lg
        bg-[#0A0A0B]
        p-5
        hover:border-[#2a2a2e]
        transition-colors
        duration-200
      "
    >

      <div className="
        flex
        items-center
        gap-2
        mb-4
      ">

        <Icon
          className="
            h-3.5
            w-3.5
            text-[#8A8F98]
          "
          strokeWidth={1.5}
        />

        <span className="
          font-mono
          text-[10px]
          uppercase
          tracking-[0.2em]
          text-[#8A8F98]
        ">

          {title}

        </span>

      </div>

      {children}

    </div>
  );
}


export default function ContextPanel({

  conversation,

  orchestration,

  onOpenOrchestration,
}) {

  // =====================================
  // ORCHESTRATION STATE
  // =====================================

  const {

    intent,

    flow,

    confidence,

    sentiment,

    urgency,

    risk_level,

    requires_escalation,

    customer_state,

    business_impact,

    trace,

    sources = [],
    
  } = orchestration || {};

  // =====================================
  // HELPERS
  // =====================================

  const severityColor = () => {

    if (risk_level === "high") {

      return "text-[#FF4D6D]";
    }

    if (risk_level === "medium") {

      return "text-[#F5A623]";
    }

    return "text-[#2DD4BF]";
  };

  return (

    <aside
      data-testid="context-panel"
      className="
        flex
        flex-col
        gap-4
      "
    >

      {/* ================================= */}
      {/* DETECTED INTENT */}
      {/* ================================= */}

      <PanelCard
        title="Detected Intent"
        icon={Crosshair}
        testId="panel-intent"
      >

        <div className="
          flex
          items-center
          justify-between
        ">

          <span className="
            text-[15px]
            font-medium
            text-[#ededed]
          ">

            {intent || "Waiting..."}

          </span>

          <span className="
            font-mono
            text-[11px]
            text-[#00E5FF]
          ">

            {confidence

              ? `${(
                  confidence * 100
                ).toFixed(0)}%`

              : "--"}

          </span>

        </div>

        <div className="
          mt-3
          h-1
          w-full
          bg-[#1F1F22]
          rounded-full
          overflow-hidden
        ">

          <div
            className="
              h-full
              bg-[#00E5FF]
              transition-all
              duration-500
            "

            style={{
              width: confidence
                ? `${confidence * 100}%`
                : "0%",
            }}
          />

        </div>

      </PanelCard>

      {/* ================================= */}
      {/* ACTIVE FLOW */}
      {/* ================================= */}

      <PanelCard
        title="Active Flow"
        icon={GitBranch}
        testId="panel-flow"
      >

        <div className="
          flex
          items-center
          justify-between
        ">

          <span className="
            text-[14px]
            font-medium
            text-[#ededed]
          ">

            {flow || "No active flow"}

          </span>

          <span className="
            font-mono
            text-[11px]
            text-[#5C5F66]
          ">

            CX

          </span>

        </div>

        <div className="
          mt-3
          flex
          items-center
          gap-2
          text-[12px]
          text-[#8A8F98]
        ">

          <span className="
            h-1.5
            w-1.5
            rounded-full
            bg-[#00E5FF]
          " />

          Dialogflow CX orchestration active

        </div>

      </PanelCard>

      {/* ================================= */}
      {/* ESCALATION */}
      {/* ================================= */}

      <PanelCard
        title="Escalation Status"
        icon={ShieldAlert}
        testId="panel-escalation"
      >

        <div className="
          flex
          items-center
          justify-between
        ">

          <div className="
            flex
            items-center
            gap-2
          ">

            <span
              className={`
                h-2
                w-2
                rounded-full

                ${
                  requires_escalation

                    ? "bg-[#FF4D6D]"

                    : "bg-[#2DD4BF]"
                }
              `}
            />

            <span className="
              text-[14px]
              font-medium
              text-[#ededed]
            ">

              {requires_escalation

                ? "Escalated"

                : "Monitored"}

            </span>

          </div>

          <span className="
            font-mono
            text-[10px]
            uppercase
            tracking-[0.16em]
            text-[#5C5F66]
          ">

            live

          </span>

        </div>

        <button
          className="
            mt-4
            w-full
            text-left
            flex
            items-center
            justify-between
            px-3
            py-2
            border
            border-[#1F1F22]
            rounded-md
            text-[12px]
            text-[#ededed]
            hover:border-[#2a2a2e]
            transition-colors
          "
        >

          <span>
            Hand off to agent
          </span>

          <ChevronRight
            className="
              h-3.5
              w-3.5
              text-[#5C5F66]
            "
            strokeWidth={1.5}
          />

        </button>

      </PanelCard>

      {/* ================================= */}
      {/* OPERATIONAL INTELLIGENCE */}
      {/* ================================= */}

      <PanelCard
        title="Operational Intelligence"
        icon={Activity}
        testId="panel-intelligence"
      >

        <div className="
          space-y-3
        ">

          {[
            ["Sentiment", sentiment],
            ["Urgency", urgency],
            ["Risk Level", risk_level],
            ["Customer State", customer_state],
            ["Business Impact", business_impact],
          ].map(([label, value]) => (

            <div
              key={label}
              className="
                flex
                items-center
                justify-between
              "
            >

              <span className="
                text-[12px]
                text-[#8A8F98]
              ">

                {label}

              </span>

              <span className={`
                text-[12px]
                uppercase

                ${
                  label === "Risk Level"

                    ? severityColor()

                    : "text-[#ededed]"
                }
              `}>

                {value || "--"}

              </span>

            </div>
          ))}

        </div>

      </PanelCard>

      {/* ================================= */}
      {/* RAG SOURCES */}
      {/* ================================= */}

      <PanelCard
        title="RAG Sources"
        icon={BookText}
        testId="panel-sources"
      >

        <div className="
          space-y-2
        ">

          {sources.length ? (

            sources.map(
              (source, index) => (

                <div
                  key={index}
                  className="
                    flex
                    items-center
                    justify-between
                    px-3
                    py-2
                    border
                    border-[#1F1F22]
                    rounded-md
                  "
                >

                  <div className="
                    flex
                    flex-col
                  ">

                    <span className="
                      text-[12.5px]
                      text-[#ededed]
                    ">

                      {source}

                    </span>

                    <span className="
                      font-mono
                      text-[10px]
                      uppercase
                      tracking-[0.16em]
                      text-[#5C5F66]
                    ">

                      knowledge base

                    </span>

                  </div>

                  <span className="
                    font-mono
                    text-[11px]
                    text-[#00E5FF]
                  ">

                    active

                  </span>

                </div>
              )
            )

          ) : (

            <div className="
              flex
              items-center
              gap-2
              text-[12px]
              text-[#5C5F66]
            ">

              <AlertTriangle
                className="
                  h-3.5
                  w-3.5
                "
              />

              No retrieval sources available.

            </div>
          )}

        </div>

      </PanelCard>

      {/* ================================= */}
      {/* ORCHESTRATION BUTTON */}
      {/* ================================= */}

      <button
        onClick={onOpenOrchestration}

        data-testid="open-orchestration"

        className="
          group
          flex
          items-center
          justify-between
          w-full
          border
          border-[#1F1F22]
          hover:border-[#00E5FF]/30
          bg-[#0A0A0B]
          rounded-lg
          p-4
          transition-colors
          duration-200
        "
      >

        <div className="
          flex
          items-center
          gap-3
        ">

          <Activity
            className="
              h-4
              w-4
              text-[#00E5FF]
            "
            strokeWidth={1.5}
          />

          <div className="
            text-left
          ">

            <div className="
              text-[13px]
              text-[#ededed]
            ">

              System orchestration

            </div>

            <div className="
              font-mono
              text-[10px]
              uppercase
              tracking-[0.16em]
              text-[#5C5F66]
            ">

              cx · rag · telemetry · reasoning

            </div>

          </div>

        </div>

        <ChevronRight
          className="
            h-4
            w-4
            text-[#5C5F66]
            group-hover:text-[#ededed]
            transition-colors
          "
          strokeWidth={1.5}
        />

      </button>

    </aside>
  );
}