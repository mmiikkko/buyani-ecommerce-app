"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Calendar, ChevronDown, Clock, Loader2, MessageSquare, Star, Star as StarIcon, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type PlatformRating = {
    id: string;
    rating: number;
    review: string | null;
    createdAt: string;
    userName: string | null;
    userEmail: string | null;
    userImage: string | null;
};

type SortOption = "date-desc" | "date-asc" | "rating-desc" | "rating-asc";

export default function AdminFeedbackPage() {
    const [ratings, setRatings] = useState<PlatformRating[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>("date-desc");

    useEffect(() => {
        async function fetchRatings() {
            try {
                const response = await fetch("/api/ratings");
                if (response.ok) {
                    const data = await response.json();
                    setRatings(Array.isArray(data) ? data : []);
                } else {
                    toast.error("Failed to fetch feedback");
                }
            } catch (error) {
                console.error("Error fetching ratings:", error);
                toast.error("An error occurred while fetching feedback");
            } finally {
                setLoading(false);
            }
        }
        fetchRatings();
    }, []);

    const averageRating = useMemo(() => {
        if (ratings.length === 0) return 0;
        const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
        return sum / ratings.length;
    }, [ratings]);

    const ratingStats = useMemo(() => {
        const stats = [0, 0, 0, 0, 0];
        ratings.forEach((r) => {
            if (r.rating >= 1 && r.rating <= 5) {
                stats[r.rating - 1]++;
            }
        });
        return stats.reverse(); // 5 stars down to 1
    }, [ratings]);

    const sortedRatings = useMemo(() => {
        return [...ratings].sort((a, b) => {
            switch (sortBy) {
                case "date-desc":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case "date-asc":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "rating-desc":
                    return b.rating - a.rating;
                case "rating-asc":
                    return a.rating - b.rating;
                default:
                    return 0;
            }
        });
    }, [ratings, sortBy]);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Feedback Platform</h1>
                    <p className="text-slate-500">Monitor and analyze what users think about BuyAni.</p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="bg-white border-slate-200 text-slate-700 font-semibold gap-2">
                            <ArrowUpDown className="h-4 w-4" />
                            Sort By
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => setSortBy("date-desc")} className="gap-2">
                            <Clock className="h-4 w-4 text-slate-400" /> Latest First
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("date-asc")} className="gap-2">
                            <Clock className="h-4 w-4 text-slate-400" /> Oldest First
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("rating-desc")} className="gap-2">
                            <StarIcon className="h-4 w-4 text-amber-400" /> Highest Rating
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("rating-asc")} className="gap-2">
                            <StarIcon className="h-4 w-4 text-amber-400" /> Lowest Rating
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                {/* Average Rating Card */}
                <Card className="md:col-span-1 shadow-sm border-none bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Average Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-4">
                            <div className="text-5xl font-black text-slate-900 mb-2">{averageRating.toFixed(1)}</div>
                            <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        className={`h-4 w-4 ${s <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"}`}
                                    />
                                ))}
                            </div>
                            <div className="text-sm text-slate-500 font-medium">From {ratings.length} reviews</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Rating Breakdown Card */}
                <Card className="md:col-span-3 shadow-sm border-none bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Rating Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 py-2">
                            {ratingStats.map((count, i) => {
                                const stars = 5 - i;
                                const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                                return (
                                    <div key={stars} className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 w-12 shrink-0">
                                            <span className="text-sm font-bold text-slate-700">{stars}</span>
                                            <StarIcon className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        </div>
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <div className="w-12 text-right text-sm font-medium text-slate-500">{count}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Feedback Grid */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <MessageSquare className="h-5 w-5 text-emerald-600" />
                    User Feedback ({sortedRatings.length})
                </div>

                {sortedRatings.length === 0 ? (
                    <Card className="shadow-sm border-none bg-white p-12 flex flex-col items-center justify-center text-slate-500">
                        <StarIcon className="h-12 w-12 text-slate-200 mb-4" />
                        <p>No platform feedback yet.</p>
                    </Card>
                ) : (
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 italic">
                        {sortedRatings.map((item) => (
                            <Card key={item.id} className="shadow-sm border-none bg-white hover:ring-2 hover:ring-emerald-500/20 transition-all group overflow-hidden flex flex-col">
                                <div className="p-5 border-b border-slate-50 bg-slate-50/30">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 overflow-hidden shrink-0 border border-emerald-50">
                                                {item.userImage ? (
                                                    <img src={item.userImage} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <User className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-900 truncate text-sm">{item.userName || "Anonymous"}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                                    <Calendar className="h-2.5 w-2.5" />
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-0.5 shrink-0 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                                            <span className="text-xs font-black text-amber-700 mr-1">{item.rating}</span>
                                            <StarIcon className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="p-5 flex-1 flex flex-col">
                                    {item.review ? (
                                        <div className="text-slate-600 text-sm leading-relaxed relative flex-1">
                                            <span className="absolute -top-1 -left-2 text-2xl text-slate-100 font-serif leading-none">"</span>
                                            <p className="relative z-10">{item.review}</p>
                                        </div>
                                    ) : (
                                        <div className="text-xs italic text-slate-300 font-medium flex-1 flex items-center justify-center">
                                            No comment provided
                                        </div>
                                    )}
                                    <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] text-slate-400 font-medium truncate">
                                        {item.userEmail}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
