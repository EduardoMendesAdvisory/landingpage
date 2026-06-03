import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value?: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
  className?: string;
  children?: React.ReactNode;
}

export function DashboardCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  children,
}: DashboardCardProps) {
  return (
    <Card className={cn("shadow-[0_8px_30px_rgba(0,0,0,0.06)]", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </CardTitle>
          {icon && (
            <span className="text-warm-soil">{icon}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {value !== undefined && (
          <p className="text-3xl font-bold text-navy">{value}</p>
        )}
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <p
            className={cn(
              "text-xs mt-2 font-medium",
              trend.positive ? "text-success" : "text-destructive"
            )}
          >
            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%{" "}
            {trend.label}
          </p>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
