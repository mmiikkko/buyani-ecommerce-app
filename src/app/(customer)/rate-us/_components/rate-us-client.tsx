"use client";

import { useState } from "react";
import { RatingOverlay } from "../../_components/rating-overlay";
import { Button } from "@/components/ui/button";
import { Star, MessageSquareQuote } from "lucide-react";
import { toast } from "sonner";
import { AnimatedSection } from "@/components/animated-section";

export function RateUsClient({ userId }: { userId: string }) {
    const [showOverlay, setShowOverlay] = useState(false);

    const handleSubmit = async (rating: number, comment: string) => {
        try {
            const response = await fetch("/api/ratings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rating,
                    review: comment.trim() || null,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to submit rating");
            }

            toast.success("Thank you for your feedback! It means a lot to us.");
            setShowOverlay(false);
        } catch (error) {
            console.error("Error submitting rating:", error);
            toast.error(error instanceof Error ? error.message : "Failed to submit rating");
            throw error; // Re-throw for the overlay to handle loading state if needed
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <AnimatedSection direction="fade-up" delay={100}>
                <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-emerald-100 flex flex-col items-center text-center max-w-xl mx-auto">
                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-6 transition-transform">
                        <Star className="w-10 h-10 text-emerald-600 fill-emerald-600" />
                    </div>

                    <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                        How are we doing?
                    </h2>

                    <p className="text-lg text-slate-600 mb-10 font-medium">
                        Your feedback helps us build a better marketplace for everyone. It only takes a minute!
                    </p>

                    <Button
                        size="lg"
                        onClick={() => setShowOverlay(true)}
                        className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl shadow-emerald-200 active:scale-95 transition-all"
                    >
                        <MessageSquareQuote className="w-6 h-6 mr-3" />
                        Share Your Experience
                    </Button>

                    <div className="mt-8 flex items-center gap-2 text-sm text-slate-400 font-bold uppercase tracking-widest">
                        <span>Quick</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>Easy</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>Impactful</span>
                    </div>
                </div>
            </AnimatedSection>

            <RatingOverlay
                open={showOverlay}
                onOpenChange={setShowOverlay}
                onSubmit={handleSubmit}
                title="Rate BuyAni"
                description="We'd love to hear your thoughts on our platform."
                showCommentField
                placeholder="Tell us what you love or how we can improve..."
            />
        </div>
    );
}
