import {
  X,
  BrainCircuit,
  Webhook,
  Database,
  Activity,
  ChevronRight,
} from "lucide-react";


function SectionTitle({
  icon: Icon,
  title,
}) {

  return (

    <div className="
      flex
      items-center
      gap-2
      mb-4
    ">

      <Icon
        className="
          h-4
          w-4
          text-[#00E5FF]
        "
        strokeWidth={1.5}
      />

      <h3 className="
        text-[13px]
        font-medium
        text-[#ededed]
      ">

        {title}

      </h3>

    </div>
  );
}


function MetricCard({
  label,
  value,
}) {

  return (

    <div className="
      border
      border-[#1F1F22]
      rounded-md
      p-3
      bg-[#0F0F11]
    ">

      <div className="
        font-mono
        text-[10px]
        uppercase
        tracking-[0.16em]
        text-[#5C5F66]
      ">

        {label}

      </div>

      <div className="
        mt-2
        text-[18px]
        text-[#ededed]
        font-display
      ">

        {value}

      </div>

    </div>
  );
}


export default function OrchestrationDrawer({

  open,

  onOpenChange,

  orchestration,
}) {

  if (!open) return null;

  const trace =
    orchestration?.trace || {};

  // =====================================
  // TRACE DATA
  // =====================================

  const webhookStatus =
    trace?.webhook?.status;

  const geminiModel =
    trace?.gemini?.model;

  const geminiLatency =
    trace?.gemini?.latency;

  const ragLatency =
    trace?.rag?.latency;

  const totalLatency =
    trace?.webhook?.latency;

  const ragDocument =

    trace?.rag?.document_preview

    || trace?.rag?.document

    || "No retrieved context available.";

  return (

    <div className="
      fixed
      inset-0
      z-50
      flex
      justify-end
    ">

      {/* BACKDROP */}

      <div
        className="
          absolute
          inset-0
          bg-black/60
          backdrop-blur-sm
        "
        onClick={() =>
          onOpenChange(false)
        }
      />

      {/* DRAWER */}

      <div className="
        relative
        w-[440px]
        h-full
        bg-[#0A0A0B]
        border-l
        border-[#1F1F22]
        overflow-y-auto
        fade-up
      ">

        {/* HEADER */}

        <div className="
          sticky
          top-0
          z-10
          bg-[#0A0A0B]/95
          backdrop-blur-md
          border-b
          border-[#1F1F22]
          px-5
          py-4
          flex
          items-center
          justify-between
        ">

          <div>

            <div className="
              flex
              items-center
              gap-2
            ">

              <span className="
                h-2
                w-2
                rounded-full
                bg-[#00E5FF]
                pulse-dot
              " />

              <h2 className="
                text-[15px]
                font-medium
                text-[#ededed]
              ">

                Orchestration Trace

              </h2>

            </div>

            <p className="
              font-mono
              text-[10px]
              uppercase
              tracking-[0.18em]
              text-[#5C5F66]
              mt-1
            ">

              live ai execution pipeline

            </p>

          </div>

          <button
            onClick={() =>
              onOpenChange(false)
            }
            className="
              h-8
              w-8
              flex
              items-center
              justify-center
              rounded-md
              hover:bg-[#111113]
              transition-colors
            "
          >

            <X
              className="
                h-4
                w-4
                text-[#8A8F98]
              "
              strokeWidth={1.5}
            />

          </button>

        </div>

        {/* BODY */}

        <div className="
          p-5
          space-y-8
        ">

          {/* ================================= */}
          {/* REASONING */}
          {/* ================================= */}

          <section>

            <SectionTitle
              icon={BrainCircuit}
              title="Reasoning"
            />

            <div className="
              space-y-3
            ">

              {/* INTENT */}

              <div className="
                border
                border-[#1F1F22]
                rounded-md
                p-3
                bg-[#0F0F11]
              ">

                <div className="
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.16em]
                  text-[#5C5F66]
                  mb-2
                ">

                  detected intent

                </div>

                <div className="
                  flex
                  items-center
                  justify-between
                ">

                  <span className="
                    text-[14px]
                    text-[#ededed]
                  ">

                    {orchestration.intent
                      || "unknown"}

                  </span>

                  <span className="
                    text-[11px]
                    text-[#00E5FF]
                    font-mono
                  ">

                    {orchestration.confidence

                      ? `${(
                          orchestration.confidence * 100
                        ).toFixed(0)}%`

                      : "--"}

                  </span>

                </div>

              </div>

              {/* FLOW */}

              <div className="
                border
                border-[#1F1F22]
                rounded-md
                p-3
                bg-[#0F0F11]
              ">

                <div className="
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.16em]
                  text-[#5C5F66]
                  mb-2
                ">

                  active flow

                </div>

                <div className="
                  flex
                  items-center
                  justify-between
                ">

                  <span className="
                    text-[14px]
                    text-[#ededed]
                  ">

                    {orchestration.flow
                      || "No active flow"}

                  </span>

                  <span className="
                    font-mono
                    text-[10px]
                    text-[#5C5F66]
                  ">

                    Dialogflow CX

                  </span>

                </div>

              </div>

            </div>

          </section>

          {/* ================================= */}
          {/* PIPELINE */}
          {/* ================================= */}

          <section>

            <SectionTitle
              icon={Webhook}
              title="Pipeline"
            />

            <div className="
              space-y-3
            ">

              {/* CHAT API */}

              <div className="
                border
                border-[#1F1F22]
                rounded-md
                overflow-hidden
              ">

                <div className="
                  px-4
                  py-3
                  border-b
                  border-[#1F1F22]
                  bg-[#0F0F11]
                  flex
                  items-center
                  justify-between
                ">

                  <span className="
                    font-mono
                    text-[11px]
                    text-[#ededed]
                  ">

                    POST /chat

                  </span>

                  <span className={`
                    text-[11px]
                    ${
                      webhookStatus
                        ? "text-[#2DD4BF]"
                        : "text-[#FF4D6D]"
                    }
                  `}>

                    {webhookStatus
                      ? `${webhookStatus} OK`
                      : "Unavailable"}

                  </span>

                </div>

                <div className="
                  p-4
                  text-[12px]
                  text-[#8A8F98]
                ">

                  Enterprise orchestration
                  pipeline execution.

                </div>

              </div>

              {/* GEMINI */}

              <div className="
                border
                border-[#1F1F22]
                rounded-md
                overflow-hidden
              ">

                <div className="
                  px-4
                  py-3
                  border-b
                  border-[#1F1F22]
                  bg-[#0F0F11]
                  flex
                  items-center
                  justify-between
                ">

                  <span className="
                    font-mono
                    text-[11px]
                    text-[#ededed]
                  ">

                    Gemini Generation

                  </span>

                  <span className="
                    text-[11px]
                    text-[#00E5FF]
                  ">

                    {geminiModel
                      || "Unavailable"}

                  </span>

                </div>

                <div className="
                  p-4
                  flex
                  items-center
                  justify-between
                  text-[12px]
                  text-[#8A8F98]
                ">

                  <span>
                    AI response generation completed.
                  </span>

                  <span className="
                    font-mono
                    text-[#ededed]
                  ">

                    {geminiLatency
                      || "--"}

                  </span>

                </div>

              </div>

            </div>

          </section>

          {/* ================================= */}
          {/* RAG */}
          {/* ================================= */}

          <section>

            <SectionTitle
              icon={Database}
              title="RAG Retrieval"
            />

            <div className="
              space-y-3
            ">

              {orchestration.sources?.length ? (

                orchestration.sources.map(
                  (source, index) => (

                    <div
                      key={index}
                      className="
                        border
                        border-[#1F1F22]
                        rounded-md
                        p-3
                        bg-[#0F0F11]
                      "
                    >

                      <div className="
                        flex
                        items-center
                        justify-between
                      ">

                        <div>

                          <div className="
                            text-[13px]
                            text-[#ededed]
                          ">

                            {source}

                          </div>

                          <div className="
                            font-mono
                            text-[10px]
                            uppercase
                            tracking-[0.16em]
                            text-[#5C5F66]
                            mt-1
                          ">

                            knowledge base

                          </div>

                        </div>

                        <span className="
                          text-[11px]
                          text-[#00E5FF]
                        ">

                          active

                        </span>

                      </div>

                    </div>
                  )
                )

              ) : (

                <div className="
                  text-[12px]
                  text-[#5C5F66]
                ">

                  No retrieval sources available.

                </div>

              )}

              {/* CONTEXT */}

              <div className="
                border
                border-[#1F1F22]
                rounded-md
                p-3
                bg-[#0F0F11]
              ">

                <div className="
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.16em]
                  text-[#5C5F66]
                  mb-2
                ">

                  Retrieved Context

                </div>

                <div className="
                  text-[12px]
                  text-[#8A8F98]
                  leading-relaxed
                ">

                  {ragDocument}

                </div>

              </div>

            </div>

          </section>

          {/* ================================= */}
          {/* SENTIMENT INTELLIGENCE */}
          {/* ================================= */}

          <section>

            <SectionTitle
              icon={Activity}
              title="Sentiment Intelligence"
            />

            <div className="
              space-y-3
            ">

              {/* SENTIMENT */}

              <div className="
                border
                border-[#1F1F22]
                rounded-md
                p-3
                bg-[#0F0F11]
              ">

                <div className="
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.16em]
                  text-[#5C5F66]
                  mb-2
                ">

                  sentiment

                </div>

                <div className="
                  flex
                  items-center
                  justify-between
                ">

                  <span className="
                    text-[14px]
                    text-[#ededed]
                  ">

                    {orchestration.sentiment
                      || "unknown"}

                  </span>

                  <span className="
                    text-[11px]
                    text-[#00E5FF]
                    uppercase
                  ">

                    AI classified

                  </span>

                </div>

              </div>

              {/* METRICS */}

              <div className="
                grid
                grid-cols-2
                gap-3
              ">

                <MetricCard
                  label="Urgency"
                  value={
                    orchestration.urgency
                    || "--"
                  }
                />

                <MetricCard
                  label="Risk Level"
                  value={
                    orchestration.risk_level
                    || "--"
                  }
                />

                <MetricCard
                  label="Customer State"
                  value={
                    orchestration.customer_state
                    || "--"
                  }
                />

                <MetricCard
                  label="Business Impact"
                  value={
                    orchestration.business_impact
                    || "--"
                  }
                />

              </div>

              {/* ESCALATION */}

              <div className="
                border
                border-[#1F1F22]
                rounded-md
                p-3
                bg-[#0F0F11]
              ">

                <div className="
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.16em]
                  text-[#5C5F66]
                  mb-2
                ">

                  escalation analysis

                </div>

                <div className="
                  flex
                  items-center
                  justify-between
                ">

                  <span className="
                    text-[14px]
                    text-[#ededed]
                  ">

                    {orchestration
                      .requires_escalation

                        ? "Human escalation recommended"

                        : "No escalation required"}

                  </span>

                  <span className={`
                    text-[11px]
                    uppercase
                    ${
                      orchestration
                        .requires_escalation

                          ? "text-[#FF4D6D]"

                          : "text-[#2DD4BF]"
                    }
                  `}>

                    {
                      orchestration
                        .requires_escalation

                          ? "HIGH"

                          : "STABLE"
                    }

                  </span>

                </div>

              </div>

            </div>

          </section>

          {/* ================================= */}
          {/* DIAGNOSTICS */}
          {/* ================================= */}

          <section>

            <SectionTitle
              icon={Activity}
              title="Diagnostics"
            />

            <div className="
              grid
              grid-cols-2
              gap-3
            ">

              <MetricCard
                label="Total latency"
                value={
                  totalLatency
                    || "--"
                }
              />

              <MetricCard
                label="Gemini latency"
                value={
                  geminiLatency
                    || "--"
                }
              />

              <MetricCard
                label="RAG latency"
                value={
                  ragLatency
                    || "--"
                }
              />

              <MetricCard
                label="Escalation"
                value={
                  orchestration
                    .requires_escalation

                      ? "YES"

                      : "NO"
                }
              />

            </div>

          </section>

          {/* ================================= */}
          {/* FOOTER */}
          {/* ================================= */}

          <div className="
            pt-2
            border-t
            border-[#1F1F22]
          ">

            <button className="
              w-full
              flex
              items-center
              justify-between
              px-4
              py-3
              border
              border-[#1F1F22]
              rounded-md
              hover:border-[#2A2A2E]
              transition-colors
            ">

              <div className="
                flex
                flex-col
                text-left
              ">

                <span className="
                  text-[13px]
                  text-[#ededed]
                ">

                  View Full Execution Graph

                </span>

                <span className="
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.16em]
                  text-[#5C5F66]
                  mt-1
                ">

                  cx · rag · reasoning · telemetry

                </span>

              </div>

              <ChevronRight
                className="
                  h-4
                  w-4
                  text-[#5C5F66]
                "
                strokeWidth={1.5}
              />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}