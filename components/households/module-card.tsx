import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type ModuleCardProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export function ModuleCard({ title, description, icon: Icon }: ModuleCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          {Icon ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Icon className="h-4 w-4" />
            </span>
          ) : null}
          <CardTitle className="font-display text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
          Placeholder for the module content.
        </div>
      </CardContent>
    </Card>
  );
}
