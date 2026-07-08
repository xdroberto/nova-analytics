"use client";

import * as React from "react";

import { Label, Pie, PieChart } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ProjectKey = "android" | "api" | "docs" | "ios" | "webapp";

const projectData: {
  project: string;
  amount: number;
  key: ProjectKey;
  percentage: number;
}[] = [
  {
    project: "Web App",
    amount: 4_510_000,
    key: "webapp",
    percentage: 52.2,
  },
  {
    project: "iOS App",
    amount: 1_780_000,
    key: "ios",
    percentage: 20.6,
  },
  {
    project: "Android App",
    amount: 1_360_000,
    key: "android",
    percentage: 15.7,
  },
  {
    project: "Public API",
    amount: 860_000,
    key: "api",
    percentage: 10.0,
  },
  {
    project: "Docs/Marketing Site",
    amount: 130_000,
    key: "docs",
    percentage: 1.5,
  },
];

const chartConfig = {
  amount: {
    label: "Events",
  },
  webapp: {
    color: "var(--chart-1)",
    label: "Web App",
  },
  ios: {
    color: "var(--chart-2)",
    label: "iOS App",
  },
  android: {
    color: "var(--chart-3)",
    label: "Android App",
  },
  api: {
    color: "var(--chart-4)",
    label: "Public API",
  },
  docs: {
    color: "var(--chart-5)",
    label: "Docs/Marketing Site",
  },
} satisfies ChartConfig;

const windows = {
  "7d": {
    label: "Last 7 days",
  },
  "30d": {
    label: "Last 30 days",
  },
  "90d": {
    label: "Last 90 days",
  },
} as const;

type TimeWindow = keyof typeof windows;

const getProjectColor = (key: ProjectKey) => {
  const config = chartConfig[key];

  return "color" in config ? config.color : undefined;
};

const chartData = projectData.map((item) => ({
  ...item,
  fill: getProjectColor(item.key),
}));
const totalEvents = projectData.reduce((total, item) => total + item.amount, 0);

const formatEvents = (value: number) => `${(value / 1_000_000).toFixed(2)}M`;

export function BalanceDistributionCard() {
  const [timeWindow, setTimeWindow] = React.useState<TimeWindow>("30d");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Events by Project</CardTitle>
        <CardAction>
          <Select onValueChange={(value) => setTimeWindow(value as TimeWindow)} value={timeWindow}>
            <SelectTrigger className="w-36" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(windows).map(([value, item]) => (
                  <SelectItem key={value} value={value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="grid items-center gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-50">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel className="w-52" nameKey="project" />}
            />
            <Pie
              cornerRadius={6}
              data={chartData}
              dataKey="amount"
              innerRadius={65}
              nameKey="project"
              outerRadius={90}
              paddingAngle={2}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (!(viewBox && "cx" in viewBox && "cy" in viewBox)) {
                    return null;
                  }

                  return (
                    <text dominantBaseline="middle" textAnchor="middle" x={viewBox.cx} y={viewBox.cy}>
                      <tspan className="fill-muted-foreground text-xs" x={viewBox.cx} y={(viewBox.cy ?? 0) - 8}>
                        Total
                      </tspan>
                      <tspan
                        className="fill-foreground font-medium text-lg tabular-nums"
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 14}
                      >
                        {formatEvents(totalEvents)}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex min-w-0 flex-col gap-3">
          {chartData.map((item) => (
            <div className="grid grid-cols-[1fr_auto] items-end gap-3" key={item.key}>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1">
                  <span aria-hidden="true" className="h-2 w-1 rounded-full" style={{ backgroundColor: item.fill }} />
                  <p className="truncate text-muted-foreground text-xs">{item.project}</p>
                </div>
                <p className="font-medium tabular-nums">{formatEvents(item.amount)}</p>
              </div>
              <div className="font-medium tabular-nums">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
