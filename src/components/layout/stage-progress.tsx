"use client";

import { STAGES, STAGE_LABELS, type Stage } from "@/types";
import { cn } from "@/lib/utils";

interface StageProgressProps {
  currentStage: Stage;
  className?: string;
}

export function StageProgress({ currentStage, className }: StageProgressProps) {
  const currentIndex = STAGES.indexOf(currentStage);

  return (
    <div className={cn("flex items-center gap-0", className)}>
      {STAGES.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <div key={stage} className="flex items-center flex-1 last:flex-none">
            {/* Dot */}
            <div className="group relative flex flex-col items-center">
              <div
                className={cn(
                  "h-3 w-3 rounded-full border-2 transition-all",
                  isCompleted &&
                    "border-success bg-success",
                  isCurrent &&
                    "border-primary bg-primary ring-4 ring-primary/20",
                  isUpcoming &&
                    "border-muted-foreground/30 bg-muted"
                )}
              />
              {/* Tooltip label on hover */}
              <span
                className={cn(
                  "absolute -bottom-5 whitespace-nowrap text-[9px] font-medium opacity-0 transition-opacity group-hover:opacity-100",
                  isCompleted && "text-success",
                  isCurrent && "text-primary",
                  isUpcoming && "text-muted-foreground"
                )}
              >
                {STAGE_LABELS[stage]}
              </span>
            </div>

            {/* Connecting Line */}
            {index < STAGES.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 transition-colors",
                  index < currentIndex
                    ? "bg-success"
                    : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
