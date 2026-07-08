import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const planFacts = [
  { id: 1, label: "Seats", value: "8" },
  { id: 2, label: "Overage", value: "0" },
  { id: 3, label: "Avg events/day", value: "288K" },
  { id: 4, label: "Renews", value: "1st of month" },
];

export function Wallet() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Current Plan</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground text-sm leading-none">Growth plan</span>
            <span className="font-normal text-muted-foreground text-xs">20M events / month</span>
          </div>
          <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">Active</Badge>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Usage this cycle</span>
            <span className="font-medium tabular-nums">8.64M / 20M</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: "43.2%" }} />
          </div>
          <span className="text-muted-foreground text-xs">43.2% used · 11.36M remaining</span>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          {planFacts.map((fact) => (
            <div key={fact.id} className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs">{fact.label}</span>
              <span className="font-medium text-foreground text-sm tabular-nums">{fact.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
