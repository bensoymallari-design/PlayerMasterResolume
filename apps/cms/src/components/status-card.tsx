import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatusCard({
  label,
  value,
  detail,
  tone = "cyan"
}: {
  label: string;
  value: string | number;
  detail: string;
  tone?: "cyan" | "green" | "red" | "purple";
}): React.ReactElement {
  const toneClass = {
    cyan: "text-cyan-300",
    green: "text-emerald-300",
    red: "text-red-300",
    purple: "text-violet-300"
  }[tone];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-4xl font-bold ${toneClass}`}>{value}</div>
        <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
