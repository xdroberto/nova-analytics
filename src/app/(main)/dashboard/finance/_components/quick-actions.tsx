import {
  BellPlus,
  ChevronRight,
  Download,
  FilePlus2,
  LayoutDashboard,
  MoreHorizontal,
  Share2,
  UserPlus,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

const teammates = [
  { id: 1, initials: "OR" },
  { id: 2, initials: "PB" },
  { id: 3, initials: "LS" },
  { id: 4, initials: "CW" },
];

const shortcuts = [
  { id: 1, label: "Create report", icon: FilePlus2 },
  { id: 2, label: "Set alert", icon: BellPlus },
  { id: 3, label: "Export CSV", icon: Download },
  { id: 4, label: "Share", icon: Share2 },
  { id: 5, label: "Invite", icon: UserPlus },
  { id: 6, label: "Dashboard", icon: LayoutDashboard },
  { id: 7, label: "More", icon: MoreHorizontal },
];

export function QuickActions() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-normal">Invite teammate</CardTitle>
          <CardAction>
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {teammates.map((teammate) => (
                  <Avatar key={teammate.id} className="size-7 border-2 border-background">
                    <AvatarFallback className="text-[10px]">{teammate.initials}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <ChevronRight className="size-4" />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Field orientation="horizontal">
            <InputGroup>
              <InputGroupInput placeholder="teammate@novaanalytics.io" />
            </InputGroup>
            <Button>Invite</Button>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal">Quick actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <div key={shortcut.id} className="flex flex-col items-center gap-2.5">
                  <Button variant="outline" className="size-12 rounded-full">
                    <Icon className="size-5" />
                  </Button>
                  <span className="text-center text-muted-foreground text-xs">{shortcut.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
