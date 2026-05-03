"use client";

import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// SHIMMER SKELETON - Enhanced skeleton with shimmer effect
// ============================================================================
function ShimmerSkeleton({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_2s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-foreground/5 before:to-transparent",
        className,
      )}
      {...props}
    />
  );
}

// ============================================================================
// CODE BLOCK SKELETON - Mimics code being generated
// ============================================================================
function CodeBlockSkeleton({
  lines = 8,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  const lineWidths = [
    "w-[60%]",
    "w-[85%]",
    "w-[45%]",
    "w-[75%]",
    "w-[55%]",
    "w-[90%]",
    "w-[40%]",
    "w-[70%]",
    "w-[65%]",
    "w-[80%]",
  ];

  const indents = [0, 1, 2, 2, 1, 2, 2, 1, 0, 1];

  return (
    <div
      className={cn(
        "rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2 border-b border-border/30 pb-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-muted-foreground/20" />
          <div className="h-3 w-3 rounded-full bg-muted-foreground/20" />
          <div className="h-3 w-3 rounded-full bg-muted-foreground/20" />
        </div>
        <ShimmerSkeleton className="ml-2 h-3 w-24" />
      </div>

      <div className="space-y-2 font-mono">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3"
            style={{
              paddingLeft: `${indents[i % indents.length] * 16}px`,
              animationDelay: `${i * 100}ms`,
            }}
          >
            <span className="w-5 text-right text-xs text-muted-foreground/40">
              {i + 1}
            </span>
            <ShimmerSkeleton
              className={cn("h-3.5", lineWidths[i % lineWidths.length])}
              style={{ animationDelay: `${i * 150}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// UI WIREFRAME SKELETON - Mimics UI components being built
// ============================================================================
function UIWireframeSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/50 bg-card/30 p-4 backdrop-blur-sm",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <ShimmerSkeleton className="h-6 w-28" />
        <div className="flex gap-2">
          <ShimmerSkeleton className="h-8 w-8 rounded-full" />
          <ShimmerSkeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="space-y-2 rounded-md border border-border/30 p-3"
            style={{ animationDelay: `${i * 200}ms` }}
          >
            <ShimmerSkeleton className="h-16 w-full rounded-md" />
            <ShimmerSkeleton className="h-3 w-full" />
            <ShimmerSkeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex gap-3">
          <ShimmerSkeleton className="h-9 flex-1 rounded-md" />
          <ShimmerSkeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CARD SKELETON - Mimics card components
// ============================================================================
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 bg-card/40 p-5 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <ShimmerSkeleton className="h-12 w-12 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <ShimmerSkeleton className="h-4 w-3/4" />
          <ShimmerSkeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <ShimmerSkeleton className="h-3 w-full" />
        <ShimmerSkeleton className="h-3 w-5/6" />
        <ShimmerSkeleton className="h-3 w-4/6" />
      </div>
      <div className="mt-4 flex gap-2">
        <ShimmerSkeleton className="h-8 w-20 rounded-md" />
        <ShimmerSkeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}

// ============================================================================
// CHAT SKELETON - Mimics chat messages being generated
// ============================================================================
function ChatSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-end">
        <div className="max-w-[70%] rounded-2xl rounded-br-md bg-primary/10 px-4 py-3">
          <ShimmerSkeleton className="h-3 w-32" />
        </div>
      </div>

      <div className="flex gap-3">
        <ShimmerSkeleton className="h-8 w-8 shrink-0 rounded-full" />
        <div className="max-w-[70%] space-y-2 rounded-2xl rounded-bl-md border border-border/50 bg-card/50 px-4 py-3">
          <ShimmerSkeleton className="h-3 w-48" />
          <ShimmerSkeleton className="h-3 w-40" />
          <ShimmerSkeleton className="h-3 w-28" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// THINKING DOTS - Animated thinking indicator
// ============================================================================
function ThinkingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/60"
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: "600ms",
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// PULSE RING - Animated ring indicator
// ============================================================================
function PulseRing({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
      <div className="absolute inset-0 animate-pulse rounded-full bg-primary/30" />
      <div className="relative h-3 w-3 rounded-full bg-primary" />
    </div>
  );
}

// ============================================================================
// SEO METRICS SKELETON - Mimics SEO analysis data
// ============================================================================
function SEOMetricsSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/50 bg-card/30 p-4 backdrop-blur-sm",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="relative h-16 w-16">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              className="stroke-muted"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              className="stroke-primary/60 animate-pulse"
              strokeWidth="3"
              strokeDasharray="75, 100"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShimmerSkeleton className="h-4 w-6 rounded" />
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <ShimmerSkeleton className="h-4 w-24" />
          <ShimmerSkeleton className="h-3 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-md border border-border/30 bg-muted/20 p-2.5"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <ShimmerSkeleton className="mb-1.5 h-3 w-16" />
            <ShimmerSkeleton className="h-5 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// SCREENSHOT SKELETON - Mimics website screenshot capture
// ============================================================================
function ScreenshotSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/30 bg-muted/30 px-3 py-2">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
        </div>
        <div className="mx-2 flex-1">
          <ShimmerSkeleton className="h-5 w-full max-w-xs rounded-md" />
        </div>
      </div>

      <div className="relative aspect-video p-3">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-primary/5 via-primary/10 to-transparent" />

        <div className="absolute left-0 right-0 top-[12%] h-0.5 animate-[scan_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="relative space-y-3">
          <ShimmerSkeleton className="h-6 w-3/4" />
          <ShimmerSkeleton className="h-3 w-full" />
          <ShimmerSkeleton className="h-3 w-5/6" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <ShimmerSkeleton className="h-16 rounded" />
            <ShimmerSkeleton className="h-16 rounded" />
            <ShimmerSkeleton className="h-16 rounded" />
          </div>
          <ShimmerSkeleton className="mt-3 h-3 w-4/5" />
          <ShimmerSkeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CRAWL RESULTS SKELETON - Mimics crawling/scraping data
// ============================================================================
function CrawlResultsSkeleton({ className }: { className?: string }) {
  const crawlItems = [
    { delay: 0 },
    { delay: 100 },
    { delay: 200 },
    { delay: 300 },
    { delay: 400 },
  ];

  return (
    <div
      className={cn(
        "rounded-lg border border-border/50 bg-card/30 p-4 backdrop-blur-sm",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <ShimmerSkeleton className="h-3 w-20" />
        </div>
        <ShimmerSkeleton className="h-3 w-12" />
      </div>

      <div className="space-y-2">
        {crawlItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-md border border-border/20 bg-muted/10 p-2 transition-all"
            style={{ animationDelay: `${item.delay}ms` }}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded bg-muted/50">
              <ShimmerSkeleton className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 space-y-1">
              <ShimmerSkeleton className="h-2.5 w-32" />
              <ShimmerSkeleton className="h-2 w-20" />
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/60" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-3/4 animate-pulse rounded-full bg-primary/60" />
        </div>
        <ShimmerSkeleton className="h-3 w-8" />
      </div>
    </div>
  );
}

// ============================================================================
// SEO ISSUES SKELETON - Mimics SEO issues list
// ============================================================================
function SEOIssuesSkeleton({ className }: { className?: string }) {
  const issues = [
    { color: "bg-red-500/60" },
    { color: "bg-yellow-500/60" },
    { color: "bg-yellow-500/60" },
    { color: "bg-blue-500/60" },
    { color: "bg-green-500/60" },
  ];

  return (
    <div
      className={cn(
        "rounded-lg border border-border/50 bg-card/30 p-4 backdrop-blur-sm",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <ShimmerSkeleton className="h-4 w-24" />
        <div className="flex gap-1">
          {["bg-red-500/40", "bg-yellow-500/40", "bg-green-500/40"].map(
            (color, i) => (
              <div
                key={i}
                className={cn("h-5 w-8 rounded text-center", color)}
              >
                <ShimmerSkeleton className="mx-auto mt-1 h-3 w-4" />
              </div>
            ),
          )}
        </div>
      </div>

      <div className="space-y-2">
        {issues.map((issue, i) => (
          <div
            key={i}
            className="flex items-start gap-2 rounded-md border border-border/20 bg-muted/10 p-2.5"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={cn("mt-0.5 h-2 w-2 rounded-full", issue.color)} />
            <div className="flex-1 space-y-1">
              <ShimmerSkeleton className="h-3 w-4/5" />
              <ShimmerSkeleton className="h-2 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const AGENT_PROGRESS_STEPS = [
  "Understanding context",
  "Exploring codebase",
  "Generating solution",
  "Applying best practices",
] as const;

const MENTEMAESTRA_SEO_STEPS = [
  { label: "Crawling website", icon: "spider" },
  { label: "Scraping content", icon: "code" },
  { label: "Capturing screenshots", icon: "camera" },
  { label: "Analyzing structure", icon: "tree" },
  { label: "Evaluating performance", icon: "chart" },
  { label: "Generating report", icon: "file" },
] as const;

// ============================================================================
// AGENT PRELOADER - Main component with all effects
// ============================================================================
interface AgentPreloaderProps {
  variant?:
    | "full"
    | "compact"
    | "minimal"
    | "code"
    | "chat"
    | "mentemaestra";
  title?: string;
  subtitle?: string;
  className?: string;
  showProgress?: boolean;
}

function AgentPreloader({
  variant = "mentemaestra",
  title = "Mentemaestra",
  subtitle = "Analyzing website for SEO insights",
  className,
  showProgress = false,
}: AgentPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [pageEstimate, setPageEstimate] = useState(72);

  const stepCount =
    variant === "mentemaestra"
      ? MENTEMAESTRA_SEO_STEPS.length
      : AGENT_PROGRESS_STEPS.length;

  useEffect(() => {
    if (!showProgress) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 3;
      });
    }, 200);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % stepCount);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [showProgress, stepCount]);

  useEffect(() => {
    if (variant !== "mentemaestra" || !showProgress) return;
    const id = setInterval(() => {
      setPageEstimate((n) => {
        const delta = Math.floor(Math.random() * 9) - 3;
        const next = n + delta;
        return Math.min(160, Math.max(48, next));
      });
    }, 2200);
    return () => clearInterval(id);
  }, [variant, showProgress]);

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <PulseRing />
        <span className="text-sm text-muted-foreground">{title}</span>
        <ThinkingDots />
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            <div className="h-4 w-4 rounded-sm bg-primary/80" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{title}</span>
              <ThinkingDots />
            </div>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {showProgress && (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>{AGENT_PROGRESS_STEPS[currentStep % stepCount]}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === "code") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            <div className="h-3 w-3 rounded-sm bg-primary/80" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{title}</span>
              <ThinkingDots />
            </div>
          </div>
        </div>
        <CodeBlockSkeleton lines={10} />
      </div>
    );
  }

  if (variant === "chat") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/30 p-3">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            <div className="h-3 w-3 rounded-sm bg-primary/80" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{title}</span>
            <ThinkingDots />
          </div>
        </div>
        <ChatSkeleton />
      </div>
    );
  }

  if (variant === "mentemaestra") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div
              className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-primary/30"
              style={{ animationDuration: "3s" }}
            />
            <div className="absolute inset-1 animate-pulse rounded-full border border-primary/40" />
            <div
              className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-primary border-r-primary/50"
              style={{ animationDuration: "1s" }}
            />
            <div className="relative flex h-6 w-6 items-center justify-center rounded-md bg-primary/90">
              <svg
                className="h-3.5 w-3.5 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">
                {title || "Mentemaestra"}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                SEO
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {subtitle || "Analyzing website for SEO insights"}
            </p>
          </div>
        </div>

        {showProgress && (
          <div className="rounded-xl border border-border/50 bg-card/20 p-4">
            <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                {MENTEMAESTRA_SEO_STEPS[currentStep % stepCount]?.label ??
                  "Processing"}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between">
              {MENTEMAESTRA_SEO_STEPS.map((step, i) => (
                <div
                  key={step.label}
                  className={cn(
                    "flex flex-col items-center gap-1 transition-all",
                    i <= currentStep ? "opacity-100" : "opacity-40",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border transition-all",
                      i < currentStep
                        ? "border-primary bg-primary text-primary-foreground"
                        : i === currentStep
                          ? "animate-pulse border-primary bg-primary/20 text-primary"
                          : "border-border bg-muted",
                    )}
                  >
                    {i < currentStep ? (
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="text-[10px] font-medium">{i + 1}</span>
                    )}
                  </div>
                  <span className="hidden text-[10px] text-muted-foreground sm:block">
                    {step.label.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            {showProgress && currentStep <= 1 && <CrawlResultsSkeleton />}
            {showProgress && currentStep === 2 && <ScreenshotSkeleton />}
            {showProgress && currentStep >= 3 && (
              <CodeBlockSkeleton lines={10} />
            )}
            {!showProgress && (
              <>
                <CrawlResultsSkeleton />
                <ScreenshotSkeleton />
              </>
            )}
          </div>

          <div className="space-y-4">
            {showProgress && currentStep <= 2 && <ScreenshotSkeleton />}
            {showProgress && currentStep === 3 && <UIWireframeSkeleton />}
            {showProgress && currentStep >= 4 && <SEOMetricsSkeleton />}
            {!showProgress && (
              <>
                <SEOMetricsSkeleton />
                <CodeBlockSkeleton lines={6} />
              </>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SEOIssuesSkeleton />
          <CardSkeleton />
          <div className="hidden lg:block">
            <SEOMetricsSkeleton />
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-card/20 p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ThinkingDots />
            <span className="animate-pulse">
              Processing {pageEstimate} pages...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-4">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          <div
            className="absolute inset-2 animate-spin rounded-full border-2 border-primary/10 border-b-primary/50"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          />
          <div className="h-4 w-4 rounded-sm bg-primary/80" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground">{title}</span>
            <ThinkingDots />
          </div>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {showProgress && (
        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              {AGENT_PROGRESS_STEPS[currentStep % stepCount]}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <CodeBlockSkeleton lines={8} />
        <div className="space-y-4">
          <UIWireframeSkeleton />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton className="hidden sm:block" />
        <CardSkeleton className="hidden lg:block" />
      </div>
    </div>
  );
}

export {
  AgentPreloader,
  ShimmerSkeleton,
  CodeBlockSkeleton,
  UIWireframeSkeleton,
  CardSkeleton,
  ChatSkeleton,
  ThinkingDots,
  PulseRing,
  SEOMetricsSkeleton,
  ScreenshotSkeleton,
  CrawlResultsSkeleton,
  SEOIssuesSkeleton,
};
