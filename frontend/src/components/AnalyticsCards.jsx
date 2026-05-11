import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  
} from "recharts";

import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";


// ======================================
// TOOLTIP STYLE
// ======================================

const tooltipStyle = {

  backgroundColor: "#0F0F11",

  border: "1px solid #1F1F22",

  borderRadius: "8px",

  color: "#ededed",

  fontSize: "12px",
};


// ======================================
// TREND STYLE
// ======================================

function getTrendStyle(trend) {

  if (trend === "up") {

    return {

      direction: "up",

      color: "#2DD4BF",
    };
  }

  if (trend === "down") {

    return {

      direction: "down",

      color: "#F87171",
    };
  }

  return {

    direction: "neutral",

    color: "#8A8F98",
  };
}


// ======================================
// AXIS
// ======================================

const AXIS_TICK = {

  fill: "#5C5F66",

  fontSize: 10,

  fontFamily: "JetBrains Mono",
};


// ======================================
// TREND ICON
// ======================================

function trendIcon(direction) {

  if (direction === "up") {

    return ArrowUpRight;
  }

  if (direction === "down") {

    return ArrowDownRight;
  }

  return Minus;
}


// ======================================
// KPI CARD
// ======================================

export function KpiCard({ k }) {

  const trend = getTrendStyle(
    k.trend
  );

  const Icon = trendIcon(
    trend.direction
  );

  return (

    <div
      data-testid={`kpi-${k.label
        .toLowerCase()
        .replace(/[^a-z]+/g, "-")}`}

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
        font-mono
        text-[10px]
        uppercase
        tracking-[0.2em]
        text-[#5C5F66]
      ">

        {k.label}

      </div>

      <div className="
        mt-2
        flex
        items-baseline
        justify-between
        gap-2
      ">

        <div className="
          font-display
          text-[24px]
          font-medium
          tracking-tight
          text-[#ededed]
        ">

          {k.value}

        </div>

        <div
          className="
            flex
            items-center
            gap-0.5
            font-mono
            text-[11px]
          "

          style={{
            color: trend.color
          }}
        >

          <Icon
            className="h-3 w-3"
            strokeWidth={1.8}
          />

          {k.delta}

        </div>

      </div>

    </div>
  );
}


// ======================================
// VOLUME CHART
// ======================================

export function VolumeChart({
  data
}) {

  return (

    <div
      data-testid="chart-volume"

      className="
        lg:col-span-8
        border
        border-[#1F1F22]
        rounded-lg
        bg-[#0A0A0B]
        p-5
      "
    >

      <div className="
        flex
        items-center
        justify-between
        mb-4
      ">

        <div>

          <div className="
            font-mono
            text-[10px]
            uppercase
            tracking-[0.2em]
            text-[#5C5F66]
          ">

            Conversation Volume

          </div>

          <div className="
            text-[14px]
            text-[#ededed]
            mt-1
          ">

            Total vs AI-resolved · 24h

          </div>

        </div>

      </div>

      <div className="h-[260px]">

        <ResponsiveContainer>

          <AreaChart data={data}>

            <defs>

              <linearGradient
                id="cyanGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#00E5FF"
                  stopOpacity={0.25}
                />

                <stop
                  offset="100%"
                  stopColor="#00E5FF"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              stroke="#1F1F22"
              strokeDasharray="0"
              vertical={false}
            />

            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK}
              width={32}
            />

            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{
                stroke: "#2a2a2e"
              }}
            />

            <Area
              type="monotone"
              dataKey="conversations"
              stroke="#00E5FF"
              strokeWidth={1.5}
              fill="url(#cyanGrad)"
            />

            <Area
              type="monotone"
              dataKey="ai"
              stroke="#22c55e"
              strokeWidth={1.5}
              fill="rgba(34, 197, 94, 0.15)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}


// ======================================
// INTENTS
// ======================================

export function IntentsList({
  intents
}) {

  const max = Math.max(
    ...(intents?.map((i) => i.value) || [1]),
    1
  );

  return (

    <div
      data-testid="chart-intents"

      className="
        lg:col-span-4
        border
        border-[#1F1F22]
        rounded-lg
        bg-[#0A0A0B]
        p-5
      "
    >

      <div className="
        font-mono
        text-[10px]
        uppercase
        tracking-[0.2em]
        text-[#5C5F66]
      ">

        Intent Distribution

      </div>

      <div className="
        text-[14px]
        text-[#ededed]
        mt-1
        mb-4
      ">

        Top intents · 24h

      </div>

      <div className="space-y-2.5">

        {intents.map((i) => (

          <div
            key={i.name}
            className="
              flex
              items-center
              gap-3
            "
          >

            <span className="
              text-[12px]
              text-[#ededed]
              w-24
              truncate
            ">

              {i.name}

            </span>

            <div className="
              flex-1
              h-1.5
              bg-[#1F1F22]
              rounded-full
              overflow-hidden
            ">

              <div
                className="
                  h-full
                  bg-[#00E5FF]/80
                "

                style={{
                  width:
                    `${(i.value / max) * 100}%`
                }}
              />

            </div>

            <span className="
              font-mono
              text-[11px]
              text-[#8A8F98]
              w-8
              text-right
            ">

              {i.value}

            </span>

          </div>
        ))}

      </div>

    </div>
  );
}

// ======================================
// DISTRIBUTION CHART
// ======================================

export function DistributionChart({

  title,

  subtitle,

  data,
}) {

  const max = Math.max(
    ...(data?.map((d) => d.value) || [1]),
    1
  );

  return (

    <div
      className="
        lg:col-span-3
        border
        border-[#1F1F22]
        rounded-lg
        bg-[#0A0A0B]
        p-5
      "
    >

      <div className="
        font-mono
        text-[10px]
        uppercase
        tracking-[0.2em]
        text-[#5C5F66]
      ">

        {title}

      </div>

      <div className="
        text-[14px]
        text-[#ededed]
        mt-1
        mb-4
      ">

        {subtitle}

      </div>

      <div className="
        space-y-3
      ">

        {data.map((item) => (

          <div
            key={item.name}
            className="
              flex
              items-center
              gap-3
            "
          >

            <span className="
              text-[12px]
              text-[#ededed]
              w-24
              capitalize
            ">

              {item.name}

            </span>

            <div className="
              flex-1
              h-1.5
              bg-[#1F1F22]
              rounded-full
              overflow-hidden
            ">

              <div
                className="
                  h-full
                  bg-[#00E5FF]
                "

                style={{
                  width:
                    `${(item.value / max) * 100}%`
                }}
              />

            </div>

            <span className="
              font-mono
              text-[11px]
              text-[#8A8F98]
              w-8
              text-right
            ">

              {item.value}

            </span>

          </div>
        ))}

      </div>

    </div>
  );
}

// ======================================
// ESCALATIONS
// ======================================

export function EscalationsChart({
  data
}) {

  return (

    <div
      data-testid="chart-escalations"

      className="
        lg:col-span-6
        border
        border-[#1F1F22]
        rounded-lg
        bg-[#0A0A0B]
        p-5
      "
    >

      <div className="mb-4">

        <div className="
          font-mono
          text-[10px]
          uppercase
          tracking-[0.2em]
          text-[#5C5F66]
        ">

          Escalation Rate

        </div>

        <div className="
          text-[14px]
          text-[#ededed]
          mt-1
        ">

          % conversations · 7d

        </div>

      </div>

      <div className="h-[220px]">

        <ResponsiveContainer>

          <BarChart data={data}>

            <CartesianGrid
              stroke="#1F1F22"
              vertical={false}
            />

            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={AXIS_TICK}
              width={32}
            />

            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{
                fill: "#0F0F11"
              }}
            />

            <Bar
              dataKey="escalations"
              fill="#00E5FF"
              opacity={0.85}
              radius={[3, 3, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}


// // ======================================
// // CSAT
// // ======================================

// export function CsatChart({
//   data
// }) {

//   return (

//     <div
//       data-testid="chart-csat"

//       className="
//         lg:col-span-6
//         border
//         border-[#1F1F22]
//         rounded-lg
//         bg-[#0A0A0B]
//         p-5
//       "
//     >

//       <div className="
//         flex
//         items-center
//         justify-between
//         mb-4
//       ">

//         <div>

//           <div className="
//             font-mono
//             text-[10px]
//             uppercase
//             tracking-[0.2em]
//             text-[#5C5F66]
//           ">

//             CSAT Trend

//           </div>

//           <div className="
//             text-[14px]
//             text-[#ededed]
//             mt-1
//           ">

//             Out of 5 · 7d

//           </div>

//         </div>

//         <span className="
//           font-mono
//           text-[11px]
//           text-[#2DD4BF]
//         ">

//           +0.11 wow

//         </span>

//       </div>

//       <div className="h-[220px]">

//         <ResponsiveContainer>

//           <LineChart data={data}>

//             <CartesianGrid
//               stroke="#1F1F22"
//               vertical={false}
//             />

//             <XAxis
//               dataKey="day"
//               axisLine={false}
//               tickLine={false}
//               tick={AXIS_TICK}
//             />

//             <YAxis
//               domain={[4.4, 4.9]}
//               axisLine={false}
//               tickLine={false}
//               tick={AXIS_TICK}
//               width={32}
//             />

//             <Tooltip
//               contentStyle={tooltipStyle}
//               cursor={{
//                 stroke: "#2a2a2e"
//               }}
//             />

//             <Line
//               type="monotone"
//               dataKey="score"
//               stroke="#00E5FF"
//               strokeWidth={1.5}
//               dot={{
//                 r: 2.5,
//                 fill: "#00E5FF",
//                 strokeWidth: 0,
//               }}
//               activeDot={{
//                 r: 4,
//                 fill: "#00E5FF",
//                 strokeWidth: 0,
//               }}
//             />

//           </LineChart>

//         </ResponsiveContainer>

//       </div>

//     </div>
//   );
// }