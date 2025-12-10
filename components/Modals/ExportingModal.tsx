"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ExportingModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ExportingModal({
    isOpen,
    onOpenChange,
}: ExportingModalProps) {
    const [progress, setProgress] = useState(0);

    // Progress allows ~60s to reach 90%
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isOpen) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress((prev) => {
                    // Cap at 90% until done
                    if (prev >= 90) return prev;
                    // 90% / 60s / 10 updates/sec = 0.15 increment per tick (100ms)
                    return prev + 0.15;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white [&>button]:hidden pointer-events-none" aria-describedby={undefined}>
                <VisuallyHidden>
                    <DialogTitle>Exporting Portfolio</DialogTitle>
                </VisuallyHidden>

                <div className="flex flex-col items-center justify-center space-y-6 py-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                        <Loader2 className="h-16 w-16 text-emerald-500 animate-spin relative z-10" />
                    </div>

                    <div className="space-y-2 text-center">
                        <h2 className="text-xl font-semibold tracking-tight">
                            Generating Static Site
                        </h2>
                        <p className="text-sm text-zinc-400 max-w-[280px]">
                            This process usually takes about a minute. We are capturing high-quality screenshots and assets.
                        </p>
                    </div>

                    <div className="w-full max-w-[240px] space-y-2">
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-center text-zinc-500">
                            Please do not close this window
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
