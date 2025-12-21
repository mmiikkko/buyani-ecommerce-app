"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumLoaderProps {
    fullPage?: boolean;
    text?: string;
    className?: string;
    color?: "emerald" | "blue" | "slate";
}

export function PremiumLoader({
    fullPage = true,
    text = "Processing...",
    className,
    color = "emerald"
}: PremiumLoaderProps) {
    const colorClasses = {
        emerald: {
            border: "border-emerald-500/20",
            borderTop: "border-t-emerald-600",
            bg: "bg-emerald-100",
            text: "text-emerald-600",
            pulse: "text-emerald-900/60 shadow-emerald-500/50"
        },
        blue: {
            border: "border-blue-500/20",
            borderTop: "border-t-blue-600",
            bg: "bg-blue-100",
            text: "text-blue-600",
            pulse: "text-blue-900/60 shadow-blue-500/50"
        },
        slate: {
            border: "border-slate-500/20",
            borderTop: "border-t-slate-600",
            bg: "bg-slate-100",
            text: "text-slate-600",
            pulse: "text-slate-900/60 shadow-slate-500/50"
        }
    }[color];

    const LoaderContent = (
        <div className={cn(
            "flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500",
            className
        )}>
            <div className="relative">
                <div className={cn(
                    "absolute inset-0 rounded-full border-2 animate-spin",
                    colorClasses.border,
                    colorClasses.borderTop
                )} />
                <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center",
                    colorClasses.bg
                )}>
                    <Loader2 className={cn("h-5 w-5 animate-spin-slow", colorClasses.text)} />
                </div>
            </div>
            {text && (
                <p className={cn(
                    "text-sm font-medium animate-pulse-subtle transition-all",
                    colorClasses.pulse
                )}>
                    {text}
                </p>
            )}
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-md transition-all">
                {LoaderContent}
            </div>
        );
    }

    return LoaderContent;
}
