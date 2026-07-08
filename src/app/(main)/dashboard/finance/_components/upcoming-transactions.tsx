import { CalendarClock, ChevronRight, FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";

const scheduledReports = [
  {
    id: 1,
    title: "Weekly Growth Digest",
    schedule: "Every Monday • 09:00",
  },
  {
    id: 2,
    title: "Monthly Retention Report",
    schedule: "1st of the month • 08:00",
  },
  {
    id: 3,
    title: "Funnel Alert Review",
    schedule: "Every Friday • 17:00",
  },
];

export function UpcomingTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Scheduled Reports</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="flex items-baseline gap-1 text-3xl leading-none tracking-tight">
              <span className="font-normal">3</span>
              <span className="text-muted-foreground text-xl">active</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-none">
              <span className="font-medium text-foreground">3</span> reports run automatically this week
            </p>
          </div>
          <div className="flex w-max items-center gap-2 rounded-md border border-border bg-muted/70 px-2 py-1.5 text-sm">
            <CalendarClock className="size-4 text-primary" />
            <span className="text-muted-foreground">
              Next run <span className="font-medium text-foreground">Growth Digest · Mon 09:00</span>
            </span>
          </div>
        </div>

        <ItemGroup>
          {scheduledReports.map((report) => (
            <Item key={report.id} variant="outline" size="xs">
              <ItemMedia>
                <div className="grid size-9 place-items-center rounded-md border bg-background">
                  <FileText className="size-4 text-muted-foreground" />
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{report.title}</ItemTitle>
                <ItemDescription>{report.schedule}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRight className="size-5 text-muted-foreground" />
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
