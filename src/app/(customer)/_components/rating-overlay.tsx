"use client";

import { useState } from "react";
import { Star, Sparkles, Loader2, Send } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RatingOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (rating: number, comment: string) => Promise<void>;
    title?: string;
    description?: string;
    showCommentField?: boolean;
    placeholder?: string;
    children?: React.ReactNode; // For extra content like order selection
}

export function RatingOverlay({
    open,
    onOpenChange,
    onSubmit,
    title = "Rate your experience",
    description = "Your feedback helps us improve our community.",
    showCommentField = false,
    placeholder = "Share your thoughts...",
    children,
}: RatingOverlayProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setIsSubmitting(true);
        try {
            await onSubmit(rating, comment);
            setRating(0);
            setComment("");
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-[2rem] border-none bg-white p-0 overflow-hidden shadow-2xl">
                <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600"></div>
                <div className="p-8 space-y-8">
                    <DialogHeader className="text-left space-y-2">
                        <DialogTitle className="text-3xl font-black text-slate-900 flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-blue-500" />
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-lg font-medium">
                            {description}
                        </DialogDescription>
                    </DialogHeader>

                    {children && <div className="space-y-4">{children}</div>}

                    <div className="flex items-center justify-between gap-2 px-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="group relative focus:outline-none transition-all hover:scale-110 active:scale-90"
                            >
                                <Star
                                    className={`h-12 w-12 transition-all duration-300 ${star <= rating
                                            ? "fill-amber-400 text-amber-400 drop-shadow-md"
                                            : "fill-slate-100 text-slate-200 group-hover:text-amber-200"
                                        }`}
                                />
                                {star === rating && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full animate-ping"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {rating > 0 && (
                        <div className="text-center py-2 px-4 bg-blue-50 rounded-2xl animate-in zoom-in-95">
                            <span className="text-blue-700 font-black text-xl">
                                {rating === 5
                                    ? "🌟 Excellent!"
                                    : rating >= 4
                                        ? "✨ Great"
                                        : rating >= 3
                                            ? "👍 Good"
                                            : "😊 Fair"}
                            </span>
                        </div>
                    )}

                    {showCommentField && (
                        <div className="space-y-2">
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={placeholder}
                                className="min-h-[100px] rounded-2xl border-slate-200 focus:ring-blue-500 resize-none"
                            />
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 rounded-2xl h-14 font-bold text-slate-600 border-slate-200 hover:bg-slate-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || rating === 0}
                            className="flex-[2] rounded-2xl h-14 bg-slate-900 hover:bg-black text-white font-black shadow-xl shadow-slate-900/10 active:scale-95 transition-all"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-3" />
                                    Submit Rating
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
