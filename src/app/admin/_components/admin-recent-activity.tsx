"use-client"

import {
    Card,
    CardContent,
    CardHeader,
    CardDescription
} from "@/components/ui/card";

export function RecentActivity(){
    return(
        <div className="min-w-[45%] max-w-[200%] min-h-[100%] flex flex-wrap gap-4 items-center justify-center">
            <Card className="min-w-[100%] max-w-[250%] min-h-[100%] flex flex-col justify-start pt-5 pb-5">
                <CardHeader>
                    <h1 className="font-bold">Recent Activities</h1>

                    <CardDescription>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col">
                    <h5>Content</h5>
                    <h5>Content</h5>
                </CardContent>
            </Card>
            
        </div>
        
    )
}