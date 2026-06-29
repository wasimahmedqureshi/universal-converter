"use client";

import { FORMAT_MAP } from "@/utils/formats";
import { cn } from "@/utils/helpers";

interface Props {
  inputFormat: string;
  availableOutputs: string[];
  outputFormat: string;
  onOutputChange: (fmt: string) => void;
}

export function FormatSelector({ inputFormat, availableOutputs, outputFormat, onOutputChange }: Props) {
  if (availableOutputs.length === 0) {
    return (
      <div className="rounded-xl border border-border p-4 bg-muted/50 text-muted-foreground text-sm">
        No supported output formats found for <strong>.{inputFormat}</strong> files.
        Please try a different file.
      </div>
    );
  }

  return (
    <div>
      <p className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
        Select Output Format
      </p>
      <div className="flex flex-wrap gap-2">
        {availableOutputs.map((fmt) => {
          const def = FORMAT_MAP[fmt];
          return (
            <button
              key={fmt}
              onClick={() => onOutputChange(fmt)}
              className={cn(
                "px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150",
                outputFormat === fmt
                  ? "bg-primary text-primary-foreground border-primary shadow shadow-primary/20"
                  : "border-border hover:border-primary/50 hover:bg-muted/60"
              )}
            >
              {def?.label ?? fmt.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
