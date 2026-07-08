"use client";

import { useState } from "react";

import { format, subMinutes } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const trafficIntervalMinutes = 15;

const trafficPoints = [
  { visitors: 372, anomalies: 8 },
  { visitors: 559, anomalies: 4 },
  { visitors: 479, anomalies: 3 },
  { visitors: 186, anomalies: 2 },
  { visitors: 106, anomalies: 1 },
  { visitors: 798, anomalies: 4 },
  { visitors: 346, anomalies: 3 },
  { visitors: 93, anomalies: 2 },
  { visitors: 120, anomalies: 1 },
  { visitors: 239, anomalies: 4 },
  { visitors: 199, anomalies: 3 },
  { visitors: 80, anomalies: 2 },
  { visitors: 572, anomalies: 1 },
  { visitors: 146, anomalies: 4 },
  { visitors: 346, anomalies: 3 },
  { visitors: 160, anomalies: 2 },
  { visitors: 120, anomalies: 1 },
  { visitors: 53, anomalies: 8 },
  { visitors: 100, anomalies: 3 },
  { visitors: 0, anomalies: 2 },
  { visitors: 20, anomalies: 1 },
  { visitors: 47, anomalies: 4 },
  { visitors: 80, anomalies: 3 },
  { visitors: 126, anomalies: 2 },
  { visitors: 140, anomalies: 1 },
  { visitors: 160, anomalies: 4 },
  { visitors: 0, anomalies: 3 },
  { visitors: 33, anomalies: 2 },
  { visitors: 93, anomalies: 1 },
  { visitors: 146, anomalies: 4 },
  { visitors: 0, anomalies: 3 },
  { visitors: 186, anomalies: 2 },
  { visitors: 412, anomalies: 1 },
  { visitors: 160, anomalies: 4 },
  { visitors: 213, anomalies: 8 },
  { visitors: 40, anomalies: 2 },
  { visitors: 27, anomalies: 1 },
  { visitors: 0, anomalies: 4 },
  { visitors: 160, anomalies: 3 },
  { visitors: 279, anomalies: 2 },
  { visitors: 146, anomalies: 1 },
  { visitors: 253, anomalies: 4 },
  { visitors: 0, anomalies: 3 },
  { visitors: 113, anomalies: 2 },
  { visitors: 332, anomalies: 1 },
  { visitors: 53, anomalies: 4 },
  { visitors: 146, anomalies: 3 },
  { visitors: 0, anomalies: 2 },
  { visitors: 186, anomalies: 1 },
  { visitors: 126, anomalies: 4 },
  { visitors: 239, anomalies: 3 },
  { visitors: 825, anomalies: 18 },
  { visitors: 47, anomalies: 1 },
  { visitors: 439, anomalies: 4 },
  { visitors: 60, anomalies: 3 },
  { visitors: 0, anomalies: 2 },
  { visitors: 213, anomalies: 1 },
  { visitors: 253, anomalies: 4 },
  { visitors: 346, anomalies: 3 },
  { visitors: 120, anomalies: 2 },
  { visitors: 93, anomalies: 1 },
  { visitors: 239, anomalies: 4 },
  { visitors: 199, anomalies: 3 },
  { visitors: 372, anomalies: 2 },
  { visitors: 213, anomalies: 1 },
  { visitors: 27, anomalies: 4 },
  { visitors: 160, anomalies: 3 },
  { visitors: 266, anomalies: 2 },
  { visitors: 60, anomalies: 8 },
  { visitors: 153, anomalies: 4 },
  { visitors: 193, anomalies: 3 },
  { visitors: 53, anomalies: 2 },
  { visitors: 213, anomalies: 1 },
  { visitors: 226, anomalies: 4 },
  { visitors: 126, anomalies: 3 },
  { visitors: 186, anomalies: 2 },
  { visitors: 93, anomalies: 1 },
  { visitors: 306, anomalies: 4 },
  { visitors: 160, anomalies: 3 },
  { visitors: 86, anomalies: 2 },
  { visitors: 47, anomalies: 1 },
  { visitors: 0, anomalies: 4 },
  { visitors: 106, anomalies: 3 },
  { visitors: 239, anomalies: 2 },
  { visitors: 126, anomalies: 1 },
  { visitors: 186, anomalies: 8 },
  { visitors: 359, anomalies: 3 },
  { visitors: 146, anomalies: 2 },
  { visitors: 66, anomalies: 1 },
  { visitors: 306, anomalies: 18 },
  { visitors: 153, anomalies: 3 },
  { visitors: 106, anomalies: 2 },
  { visitors: 346, anomalies: 1 },
  { visitors: 27, anomalies: 4 },
  { visitors: 160, anomalies: 3 },
  { visitors: 7, anomalies: 2 },
] as const;

function getTrafficData() {
  const now = new Date();

  return trafficPoints.map((point, index) => ({
    ...point,
    timestamp: subMinutes(now, (trafficPoints.length - 1 - index) * trafficIntervalMinutes).toISOString(),
  }));
}

const trafficConfig = {
  visitors: {
    label: "Sessions",
    color: "var(--chart-3)",
  },
  anomalies: {
    label: "Anomalies detected",
    color: "var(--destructive)",
  },
} satisfies ChartConfig;

function formatTrafficTooltipLabel(value: string) {
  return format(new Date(value), "h:mm a, do MMMM yyyy");
}

export function StoreTraffic() {
  const [trafficData] = useState(() => getTrafficData());
  const firstTrafficTimestamp = trafficData[0].timestamp;
  const lastTrafficTimestamp = trafficData.at(-1)?.timestamp ?? "";

  function formatTrafficTick(value: string) {
    if (value === firstTrafficTimestamp) {
      return "24h ago";
    }

    return value === lastTrafficTimestamp ? "now" : "";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Live Traffic (last 24h)</CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          17.1K sessions (24h)
        </CardDescription>
        <CardAction>
          <ArrowUpRight className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={trafficConfig} className="h-54 w-full">
          <AreaChart accessibilityLayer data={trafficData} margin={{ bottom: 0, left: 0, right: 0, top: 8 }}>
            <defs>
              <linearGradient id="fillVisitors" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-visitors)" stopOpacity={0.28} />
                <stop offset="95%" stopColor="var(--color-visitors)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="timestamp"
              tick={{ fontSize: 11 }}
              tickFormatter={formatTrafficTick}
              tickLine={false}
              tickMargin={10}
              ticks={[trafficData[0].timestamp, trafficData.at(-1)?.timestamp ?? ""]}
            />
            <YAxis axisLine={false} domain={[0, 850]} tickLine={false} tickMargin={6} width={36} yAxisId="traffic" />
            <ChartTooltip
              content={<ChartTooltipContent labelFormatter={(value) => formatTrafficTooltipLabel(String(value))} />}
              cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
            />
            <ChartLegend align="right" verticalAlign="top" className="justify-end" content={<ChartLegendContent />} />
            <Area
              dataKey="visitors"
              dot={false}
              fill="url(#fillVisitors)"
              stroke="var(--color-visitors)"
              strokeWidth={2}
              type="stepAfter"
              yAxisId="traffic"
            />
            <Line
              dataKey="anomalies"
              dot={false}
              stroke="var(--color-anomalies)"
              strokeLinecap="round"
              strokeWidth={1.2}
              type="stepAfter"
              yAxisId="traffic"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
