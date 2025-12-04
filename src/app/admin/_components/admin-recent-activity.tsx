"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardDescription
} from "@/components/ui/card";

type Activity = {
  id: string;
  type: string;
  user: string;
  description: string;
  date: Date | string;
};

export function RecentActivity(){
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await fetch("/api/admin/recent-activity");
                const data = await res.json();
                setActivities(data || []);
            } catch (error) {
                console.error("Error fetching recent activity:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return(
        <div className="min-w-[45%] max-w-[200%] min-h-[100%] flex flex-wrap gap-4 items-center justify-center">
            <Card className="min-w-[100%] max-w-[250%] min-h-[100%] flex flex-col justify-start pt-5 pb-5">
                <CardHeader>
                    <h1 className="font-bold">Recent Activities</h1>

                    <CardDescription>
                        Latest orders and transactions
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    {loading ? (
                        <p className="text-sm text-gray-500">Loading...</p>
                    ) : activities.length === 0 ? (
                        <p className="text-sm text-gray-500">No recent activity</p>
                    ) : (
                        activities.map((activity) => (
                            <div key={activity.id} className="p-2 border-b last:border-b-0">
                                <p className="text-sm font-medium">{activity.user}</p>
                                <p className="text-xs text-gray-600">{activity.description}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatDate(activity.date)}</p>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
            
        </div>
        
    )
}