"use client";

import { addHours, endOfToday, format, parseISO, subHours } from "date-fns";
import { Area, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartValues = [
  { newCustomers: 38998, activeAccounts: 6744, returningUsers: 4964 },
  { newCustomers: 18825, activeAccounts: 6579, returningUsers: 4723 },
  { newCustomers: 16318, activeAccounts: 6222, returningUsers: 4651 },
  { newCustomers: 16866, activeAccounts: 6257, returningUsers: 4737 },
  { newCustomers: 20029, activeAccounts: 6584, returningUsers: 4737 },
  { newCustomers: 18773, activeAccounts: 6456, returningUsers: 4611 },
  { newCustomers: 16267, activeAccounts: 6357, returningUsers: 4667 },
  { newCustomers: 16782, activeAccounts: 6527, returningUsers: 4845 },
  { newCustomers: 15864, activeAccounts: 6363, returningUsers: 4791 },
  { newCustomers: 13798, activeAccounts: 6267, returningUsers: 4622 },
  { newCustomers: 14534, activeAccounts: 6622, returningUsers: 4674 },
  { newCustomers: 22241, activeAccounts: 6608, returningUsers: 4793 },
  { newCustomers: 10139, activeAccounts: 6271, returningUsers: 4734 },
  { newCustomers: 10708, activeAccounts: 6403, returningUsers: 4701 },
  { newCustomers: 13587, activeAccounts: 6554, returningUsers: 4813 },
  { newCustomers: 12179, activeAccounts: 6391, returningUsers: 4792 },
  { newCustomers: 10872, activeAccounts: 6519, returningUsers: 4629 },
  { newCustomers: 13326, activeAccounts: 6632, returningUsers: 4672 },
  { newCustomers: 14320, activeAccounts: 6303, returningUsers: 4858 },
  { newCustomers: 14256, activeAccounts: 6311, returningUsers: 4826 },
  { newCustomers: 16610, activeAccounts: 6669, returningUsers: 4679 },
  { newCustomers: 16910, activeAccounts: 6548, returningUsers: 4721 },
  { newCustomers: 23249, activeAccounts: 6358, returningUsers: 4796 },
  { newCustomers: 30873, activeAccounts: 6669, returningUsers: 4712 },
  { newCustomers: 18907, activeAccounts: 6447, returningUsers: 4705 },
  { newCustomers: 16278, activeAccounts: 6325, returningUsers: 4851 },
  { newCustomers: 14258, activeAccounts: 6630, returningUsers: 4830 },
  { newCustomers: 15851, activeAccounts: 6632, returningUsers: 4643 },
  { newCustomers: 15415, activeAccounts: 6263, returningUsers: 4660 },
  { newCustomers: 14008, activeAccounts: 6375, returningUsers: 4922 },
  { newCustomers: 15140, activeAccounts: 6600, returningUsers: 4811 },
  { newCustomers: 36162, activeAccounts: 6425, returningUsers: 4698 },
  { newCustomers: 12702, activeAccounts: 6455, returningUsers: 4750 },
  { newCustomers: 23698, activeAccounts: 6581, returningUsers: 4789 },
  { newCustomers: 17716, activeAccounts: 6300, returningUsers: 4668 },
  { newCustomers: 15518, activeAccounts: 6278, returningUsers: 4663 },
  { newCustomers: 15050, activeAccounts: 6641, returningUsers: 4836 },
  { newCustomers: 18027, activeAccounts: 6527, returningUsers: 4832 },
  { newCustomers: 18133, activeAccounts: 6258, returningUsers: 4643 },
  { newCustomers: 16967, activeAccounts: 6425, returningUsers: 4636 },
  { newCustomers: 17890, activeAccounts: 6431, returningUsers: 4772 },
  { newCustomers: 16679, activeAccounts: 6546, returningUsers: 4745 },
  { newCustomers: 14304, activeAccounts: 6517, returningUsers: 4668 },
  { newCustomers: 15691, activeAccounts: 6539, returningUsers: 4750 },
  { newCustomers: 24459, activeAccounts: 6165, returningUsers: 4771 },
  { newCustomers: 11847, activeAccounts: 6255, returningUsers: 4610 },
  { newCustomers: 25023, activeAccounts: 6681, returningUsers: 4588 },
  { newCustomers: 12832, activeAccounts: 6355, returningUsers: 4953 },
  { newCustomers: 12001, activeAccounts: 6287, returningUsers: 4789 },
  { newCustomers: 10711, activeAccounts: 6430, returningUsers: 4620 },
  { newCustomers: 12262, activeAccounts: 6217, returningUsers: 4608 },
  { newCustomers: 12316, activeAccounts: 6163, returningUsers: 4704 },
  { newCustomers: 12055, activeAccounts: 6511, returningUsers: 4648 },
  { newCustomers: 15433, activeAccounts: 6411, returningUsers: 4591 },
  { newCustomers: 16991, activeAccounts: 6087, returningUsers: 4712 },
  { newCustomers: 23185, activeAccounts: 6251, returningUsers: 4740 },
  { newCustomers: 15761, activeAccounts: 6346, returningUsers: 4555 },
  { newCustomers: 19123, activeAccounts: 6174, returningUsers: 4507 },
  { newCustomers: 18236, activeAccounts: 6328, returningUsers: 4768 },
  { newCustomers: 16694, activeAccounts: 6377, returningUsers: 4705 },
  { newCustomers: 17623, activeAccounts: 6028, returningUsers: 4571 },
  { newCustomers: 16578, activeAccounts: 6098, returningUsers: 4577 },
  { newCustomers: 36715, activeAccounts: 6423, returningUsers: 4644 },
  { newCustomers: 16707, activeAccounts: 6239, returningUsers: 4549 },
  { newCustomers: 16012, activeAccounts: 6086, returningUsers: 4492 },
  { newCustomers: 12508, activeAccounts: 6251, returningUsers: 4644 },
  { newCustomers: 21914, activeAccounts: 6123, returningUsers: 4694 },
  { newCustomers: 16177, activeAccounts: 6040, returningUsers: 4510 },
  { newCustomers: 14721, activeAccounts: 6353, returningUsers: 4445 },
  { newCustomers: 28097, activeAccounts: 6422, returningUsers: 4585 },
  { newCustomers: 15707, activeAccounts: 5927, returningUsers: 4605 },
  { newCustomers: 15807, activeAccounts: 6095, returningUsers: 4504 },
  { newCustomers: 15609, activeAccounts: 6273, returningUsers: 4548 },
  { newCustomers: 17865, activeAccounts: 6084, returningUsers: 4608 },
  { newCustomers: 17270, activeAccounts: 6155, returningUsers: 4473 },
  { newCustomers: 14353, activeAccounts: 6243, returningUsers: 4400 },
  { newCustomers: 15716, activeAccounts: 5943, returningUsers: 4566 },
  { newCustomers: 25982, activeAccounts: 5992, returningUsers: 4641 },
  { newCustomers: 14404, activeAccounts: 6342, returningUsers: 4480 },
  { newCustomers: 12352, activeAccounts: 6169, returningUsers: 4416 },
  { newCustomers: 13376, activeAccounts: 5947, returningUsers: 4525 },
  { newCustomers: 12324, activeAccounts: 6141, returningUsers: 4516 },
  { newCustomers: 11291, activeAccounts: 6371, returningUsers: 4435 },
  { newCustomers: 12812, activeAccounts: 5996, returningUsers: 4522 },
  { newCustomers: 11960, activeAccounts: 6261, returningUsers: 4597 },
  { newCustomers: 10216, activeAccounts: 6224, returningUsers: 4444 },
  { newCustomers: 13296, activeAccounts: 5871, returningUsers: 4347 },
  { newCustomers: 16110, activeAccounts: 6038, returningUsers: 4595 },
  { newCustomers: 22894, activeAccounts: 6290, returningUsers: 4592 },
  { newCustomers: 14662, activeAccounts: 6089, returningUsers: 4465 },
  { newCustomers: 17785, activeAccounts: 6078, returningUsers: 4428 },
  { newCustomers: 18053, activeAccounts: 6211, returningUsers: 4516 },
  { newCustomers: 32260, activeAccounts: 6126, returningUsers: 4468 },
  { newCustomers: 41025, activeAccounts: 6006, returningUsers: 4384 },
  { newCustomers: 18083, activeAccounts: 6359, returningUsers: 4690 },
  { newCustomers: 15981, activeAccounts: 6206, returningUsers: 4612 },
  { newCustomers: 17957, activeAccounts: 5935, returningUsers: 4461 },
  { newCustomers: 18310, activeAccounts: 6152, returningUsers: 4349 },
  { newCustomers: 14340, activeAccounts: 6214, returningUsers: 4484 },
  { newCustomers: 21871, activeAccounts: 6072, returningUsers: 4562 },
  { newCustomers: 15179, activeAccounts: 6274, returningUsers: 4465 },
  { newCustomers: 14037, activeAccounts: 6282, returningUsers: 4470 },
  { newCustomers: 13090, activeAccounts: 5952, returningUsers: 4561 },
  { newCustomers: 14413, activeAccounts: 6108, returningUsers: 4476 },
  { newCustomers: 13514, activeAccounts: 6414, returningUsers: 4372 },
  { newCustomers: 12853, activeAccounts: 6205, returningUsers: 4510 },
  { newCustomers: 16090, activeAccounts: 6116, returningUsers: 4642 },
  { newCustomers: 16967, activeAccounts: 6293, returningUsers: 4514 },
  { newCustomers: 14075, activeAccounts: 6147, returningUsers: 4408 },
  { newCustomers: 14767, activeAccounts: 6132, returningUsers: 4515 },
  { newCustomers: 25810, activeAccounts: 6464, returningUsers: 4563 },
  { newCustomers: 15920, activeAccounts: 6337, returningUsers: 4480 },
  { newCustomers: 14574, activeAccounts: 6034, returningUsers: 4530 },
  { newCustomers: 15179, activeAccounts: 6266, returningUsers: 4642 },
  { newCustomers: 13425, activeAccounts: 6410, returningUsers: 4538 },
  { newCustomers: 26537, activeAccounts: 6376, returningUsers: 4407 },
  { newCustomers: 14224, activeAccounts: 6358, returningUsers: 4628 },
  { newCustomers: 13548, activeAccounts: 6415, returningUsers: 4680 },
  { newCustomers: 10317, activeAccounts: 6123, returningUsers: 4583 },
  { newCustomers: 11763, activeAccounts: 6254, returningUsers: 4503 },
  { newCustomers: 14745, activeAccounts: 6586, returningUsers: 4595 },
  { newCustomers: 22364, activeAccounts: 6371, returningUsers: 4603 },
  { newCustomers: 13878, activeAccounts: 6211, returningUsers: 4508 },
  { newCustomers: 16210, activeAccounts: 6689, returningUsers: 4591 },
  { newCustomers: 37883, activeAccounts: 6359, returningUsers: 4734 },
  { newCustomers: 16872, activeAccounts: 6296, returningUsers: 4632 },
  { newCustomers: 19889, activeAccounts: 6581, returningUsers: 4485 },
  { newCustomers: 19319, activeAccounts: 6485, returningUsers: 4589 },
  { newCustomers: 16565, activeAccounts: 6166, returningUsers: 4720 },
  { newCustomers: 18218, activeAccounts: 6397, returningUsers: 4644 },
  { newCustomers: 19826, activeAccounts: 6605, returningUsers: 4606 },
  { newCustomers: 16838, activeAccounts: 6391, returningUsers: 4703 },
  { newCustomers: 23607, activeAccounts: 6429, returningUsers: 4672 },
  { newCustomers: 15621, activeAccounts: 6533, returningUsers: 4549 },
  { newCustomers: 13883, activeAccounts: 6292, returningUsers: 4641 },
  { newCustomers: 12980, activeAccounts: 6380, returningUsers: 4811 },
  { newCustomers: 14436, activeAccounts: 6711, returningUsers: 4728 },
  { newCustomers: 12782, activeAccounts: 6495, returningUsers: 4582 },
  { newCustomers: 24919, activeAccounts: 6414, returningUsers: 4662 },
  { newCustomers: 13304, activeAccounts: 6513, returningUsers: 4756 },
  { newCustomers: 15460, activeAccounts: 6523, returningUsers: 4683 },
  { newCustomers: 13383, activeAccounts: 6402, returningUsers: 4868 },
  { newCustomers: 13515, activeAccounts: 6620, returningUsers: 4806 },
  { newCustomers: 24331, activeAccounts: 6563, returningUsers: 4753 },
  { newCustomers: 15423, activeAccounts: 6244, returningUsers: 4597 },
  { newCustomers: 15493, activeAccounts: 6457, returningUsers: 4767 },
  { newCustomers: 17077, activeAccounts: 6707, returningUsers: 4853 },
  { newCustomers: 15184, activeAccounts: 6457, returningUsers: 4793 },
  { newCustomers: 13110, activeAccounts: 6411, returningUsers: 4671 },
  { newCustomers: 15469, activeAccounts: 6562, returningUsers: 4738 },
  { newCustomers: 15949, activeAccounts: 6377, returningUsers: 4788 },
  { newCustomers: 12470, activeAccounts: 6409, returningUsers: 4693 },
  { newCustomers: 12172, activeAccounts: 6715, returningUsers: 4721 },
  { newCustomers: 14089, activeAccounts: 6512, returningUsers: 4874 },
  { newCustomers: 21845, activeAccounts: 6241, returningUsers: 4821 },
  { newCustomers: 35149, activeAccounts: 6499, returningUsers: 4642 },
  { newCustomers: 15509, activeAccounts: 6576, returningUsers: 4695 },
  { newCustomers: 14611, activeAccounts: 6395, returningUsers: 4854 },
  { newCustomers: 14485, activeAccounts: 6537, returningUsers: 4808 },
  { newCustomers: 18377, activeAccounts: 6527, returningUsers: 4722 },
  { newCustomers: 19385, activeAccounts: 6228, returningUsers: 4798 },
  { newCustomers: 31150, activeAccounts: 6551, returningUsers: 4809 },
  { newCustomers: 17647, activeAccounts: 6684, returningUsers: 4678 },
  { newCustomers: 19732, activeAccounts: 6409, returningUsers: 4709 },
  { newCustomers: 18164, activeAccounts: 6552, returningUsers: 4887 },
  { newCustomers: 25678, activeAccounts: 6484, returningUsers: 4851 },
  { newCustomers: 17376, activeAccounts: 6366, returningUsers: 4672 },
  { newCustomers: 14711, activeAccounts: 6334, returningUsers: 4700 },
  { newCustomers: 13195, activeAccounts: 6601, returningUsers: 4822 },
  { newCustomers: 15130, activeAccounts: 6425, returningUsers: 4770 },
  { newCustomers: 13805, activeAccounts: 6130, returningUsers: 4720 },
  { newCustomers: 10154, activeAccounts: 6395, returningUsers: 4823 },
  { newCustomers: 11235, activeAccounts: 6532, returningUsers: 4815 },
  { newCustomers: 13424, activeAccounts: 6296, returningUsers: 4646 },
  { newCustomers: 12215, activeAccounts: 6363, returningUsers: 4753 },
  { newCustomers: 12424, activeAccounts: 6414, returningUsers: 4846 },
  { newCustomers: 22730, activeAccounts: 6154, returningUsers: 4830 },
  { newCustomers: 13566, activeAccounts: 6292, returningUsers: 4674 },
  { newCustomers: 14304, activeAccounts: 6575, returningUsers: 4694 },
  { newCustomers: 17548, activeAccounts: 6295, returningUsers: 4773 },
];

const endDate = endOfToday();
const startDate = subHours(endDate, (chartValues.length - 1) * 12);

const chartData = chartValues.map((point, index) => ({
  date: format(addHours(startDate, index * 12), "yyyy-MM-dd"),
  ...point,
}));

const chartConfig = {
  newCustomers: {
    label: "Sessions",
    color: "var(--chart-1)",
  },
  activeAccounts: {
    label: "Active Users",
    color: "var(--chart-2)",
  },
  returningUsers: {
    label: "Returning Users",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function PerformanceOverview() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="leading-none">User Activity</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">Sessions, active and returning users - last 90 days</span>
          <span className="@[540px]/card:hidden">Last 90 days</span>
        </CardDescription>
        <CardAction className="flex items-center gap-2">
          <Select defaultValue="quarter">
            <SelectTrigger size="sm" className="w-28">
              <SelectValue placeholder="3 months" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Period</SelectLabel>
                <SelectItem value="quarter">3 months</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger size="sm" className="w-32">
              <SelectValue placeholder="All segments" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Segments</SelectLabel>
                <SelectItem value="all">All segments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="organic">Organic</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            View report
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
          <ComposedChart data={chartData} margin={{ top: 0 }}>
            <defs>
              <linearGradient id="fillNewCustomers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-newCustomers)" stopOpacity={0.36} />
                <stop offset="95%" stopColor="var(--color-newCustomers)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.5} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={48}
              tickFormatter={(value) =>
                parseISO(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-50"
                  indicator="line"
                  labelFormatter={(value) => format(parseISO(value), "d MMMM yyyy")}
                />
              }
            />
            <ChartLegend verticalAlign="top" content={<ChartLegendContent className="mb-5 justify-end" />} />

            <Area
              dataKey="newCustomers"
              type="natural"
              fill="url(#fillNewCustomers)"
              stroke="var(--color-newCustomers)"
              strokeWidth={1.25}
              dot={false}
              fillOpacity={1}
            />
            <Line
              dataKey="activeAccounts"
              type="natural"
              stroke="var(--color-activeAccounts)"
              strokeWidth={1.4}
              dot={false}
            />
            <Line
              dataKey="returningUsers"
              type="natural"
              stroke="var(--color-returningUsers)"
              strokeWidth={1.2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
