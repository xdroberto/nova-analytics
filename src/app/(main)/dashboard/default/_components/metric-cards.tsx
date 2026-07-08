import { Activity, Target, TrendingDown, TrendingUp, UserPlus, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs xl:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <Users className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Monthly Active Users</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">128,420</div>
            <Badge>
              <TrendingUp className="size-3" />
              +12.5%
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Unique active users, last 30 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <UserPlus className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>New Signups</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">3,240</div>
            <Badge variant="destructive">
              <TrendingDown className="size-3" />
              -20%
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Acquisition needs attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <Activity className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Sessions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">512,900</div>
            <Badge>
              <TrendingUp className="size-3" />
              +11.2%
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Engagement exceeds targets</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <Target className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Conversion Rate</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">4.8%</div>
            <Badge>
              <TrendingUp className="size-3" />
              +0.4pp
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Meets conversion targets</p>
        </CardContent>
      </Card>
    </div>
  );
}
