import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ModuleCardProps = {
  title: string;
  description: string;
};

export function ModuleCard({ title, description }: ModuleCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
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
