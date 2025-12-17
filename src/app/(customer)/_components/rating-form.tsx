"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface RatingFormProps {
    userId: string;
}

export function RatingForm({ userId }: RatingFormProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [review, setReview] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/ratings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rating,
                    review: review.trim() || null,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to submit rating");
            }

            toast.success("Thank you for your feedback!");
            setRating(0);
            setReview("");
        } catch (error) {
            console.error("Error submitting rating:", error);
            toast.error(
                error instanceof Error ? error.message : "Failed to submit rating"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="text-center">How would you rate your experience?</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
                                >
                                    <Star
                                        size={48}
                                        className={`transition-colors ${star <= (hoveredRating || rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-slate-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-sm font-medium text-slate-700">
                                {rating === 1 && "Poor"}
                                {rating === 2 && "Fair"}
                                {rating === 3 && "Good"}
                                {rating === 4 && "Very Good"}
                                {rating === 5 && "Excellent"}
                            </p>
                        )}
                    </div>

                    {/* Review Text Area */}
                    <div className="space-y-2">
                        <label
                            htmlFor="review"
                            className="text-sm font-medium text-slate-700"
                        >
                            Tell us more about your experience (optional)
                        </label>
                        <Textarea
                            id="review"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Share your thoughts about BuyAni..."
                            className="min-h-[120px] resize-none"
                            maxLength={500}
                        />
                        <p className="text-xs text-slate-500 text-right">
                            {review.length}/500 characters
                        </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        size="lg"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Rating"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
