import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  value: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  description?: string;
  className?: string;
}

const sizeConfig = {
  sm: { dim: 80, stroke: 8, fontSize: "text-lg", radius: 34 },
  md: { dim: 120, stroke: 10, fontSize: "text-2xl", radius: 50 },
  lg: { dim: 160, stroke: 12, fontSize: "text-3xl", radius: 68 },
};

function getColour(value: number) {
  if (value >= 75) return { stroke: "#2E7D32", text: "text-success" };
  if (value >= 55) return { stroke: "#111A24", text: "text-navy" };
  if (value >= 35) return { stroke: "#ED6C02", text: "text-warning" };
  return { stroke: "#D32F2F", text: "text-destructive" };
}

export function ProgressCircle({
  value,
  size = "md",
  label,
  description,
  className,
}: ProgressCircleProps) {
  const { dim, stroke, fontSize, radius } = sizeConfig[size];
  const { stroke: strokeColour, text } = getColour(value);
  const normalised = Math.min(100, Math.max(0, value));
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (normalised / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg
          width={dim}
          height={dim}
          viewBox={`0 0 ${dim} ${dim}`}
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted"
          />
          {/* Progress */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={strokeColour}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", fontSize, text)}>{normalised}</span>
        </div>
      </div>
      {label && (
        <p className="font-semibold text-navy text-sm text-center">{label}</p>
      )}
      {description && (
        <p className="text-xs text-muted-foreground text-center max-w-[180px]">
          {description}
        </p>
      )}
    </div>
  );
}
