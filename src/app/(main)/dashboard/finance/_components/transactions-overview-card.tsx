"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DAY_MS = 24 * 60 * 60 * 1000;
const weekStart = Date.UTC(2026, 0, 5);

const chartData = [
  { date: "2026-01-05T02:24:00Z", expense: 255, income: 0.7 },
  { date: "2026-01-05T08:24:00Z", expense: 271 },
  { date: "2026-01-05T14:52:48Z", expense: 260 },
  { date: "2026-01-05T21:07:12Z", expense: 284 },
  { date: "2026-01-06T03:36:00Z", expense: 280 },
  { date: "2026-01-06T10:04:48Z", expense: 307 },
  { date: "2026-01-06T16:19:12Z", expense: 240 },
  { date: "2026-01-06T22:04:48Z", expense: 278 },
  { date: "2026-01-07T03:50:24Z", expense: 269 },
  { date: "2026-01-07T09:36:00Z", expense: 295, income: 0.78 },
  { date: "2026-01-07T15:21:36Z", expense: 309 },
  { date: "2026-01-07T21:07:12Z", expense: 285 },
  { date: "2026-01-08T02:52:48Z", expense: 260 },
  { date: "2026-01-08T08:24:00Z", expense: 289 },
  { date: "2026-01-08T13:55:12Z", expense: 298 },
  { date: "2026-01-08T19:40:48Z", expense: 304 },
  { date: "2026-01-09T01:12:00Z", expense: 275 },
  { date: "2026-01-09T06:43:12Z", expense: 309 },
  { date: "2026-01-09T12:28:48Z", expense: 293 },
  { date: "2026-01-09T18:00:00Z", expense: 340 },
  { date: "2026-01-09T23:31:12Z", expense: 304 },
  { date: "2026-01-10T04:48:00Z", expense: 305 },
  { date: "2026-01-10T10:04:48Z", expense: 275, income: 0.92 },
  { date: "2026-01-10T15:21:36Z", expense: 284 },
  { date: "2026-01-10T20:38:24Z", expense: 267 },
  { date: "2026-01-11T01:55:12Z", expense: 304 },
  { date: "2026-01-11T07:12:00Z", expense: 300 },
  { date: "2026-01-11T12:28:48Z", expense: 335 },
  { date: "2026-01-11T17:45:36Z", expense: 273 },
  { date: "2026-01-11T22:04:48Z", expense: 309, income: 0.98 },
].map((item: { date: string; expense: number; income?: number }) => ({
  date: item.date,
  expense: item.expense,
  income: item.income,
  timestamp: Date.parse(item.date),
}));

const weekdayTicks = Array.from({ length: 7 }, (_, index) => weekStart + (index + 0.5) * DAY_MS);

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "long",
});

const formatWeekday = (value: number) => weekdayFormatter.format(new Date(value));

const chartDomain = [weekStart, weekStart + 7 * DAY_MS];
const formatTooltipValue = (value: number | string) => `${Number(value).toLocaleString()}K`;

const chartConfig = {
  expense: {
    color: "var(--chart-4)",
    label: "Events ingested",
  },
  income: {
    color: "var(--chart-2)",
    label: "Ingestion errors",
  },
} satisfies ChartConfig;

export function TransactionsOverviewCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Ingestion Overview</CardTitle>
        <CardAction>
          <Select defaultValue="weekly">
            <SelectTrigger className="w-28" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-50 w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="timestamp"
              domain={chartDomain}
              scale="time"
              tickFormatter={formatWeekday}
              tickLine={false}
              tickMargin={10}
              ticks={weekdayTicks}
              tick={{ fontSize: 12 }}
              type="number"
            />
            <YAxis hide axisLine={false} tickLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => (
                <ChartTooltipContent
                  active={active}
                  hideLabel
                  label={label}
                  payload={payload?.map((item) => ({
                    ...item,
                    value: typeof item.value === "number" ? formatTooltipValue(item.value) : item.value,
                  }))}
                />
              )}
            />
            <Line
              connectNulls
              dataKey="income"
              dot={false}
              stroke="var(--color-income)"
              strokeDasharray="5 5"
              strokeLinecap="round"
              strokeWidth={1}
              type="linear"
            />
            <Line
              dataKey="expense"
              dot={false}
              stroke="var(--color-expense)"
              strokeLinecap="round"
              strokeWidth={3}
              type="linear"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
