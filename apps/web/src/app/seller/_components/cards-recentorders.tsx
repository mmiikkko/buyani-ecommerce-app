"use-client"

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";



export function RecentOrders(){

    return(
        <div className="min-w-[93%] max-w-[250%] flex flex-wrap gap-4 items-center justify-center mb-5">
            <Card className="min-w-[100%] max-w-[250%] min-h-[80%] flex flex-col justify-between">
                <CardHeader>
                    <h1>Content</h1>
                </CardHeader>
                <CardContent className="flex flex-col">
                    <h5>Content</h5>
                    <h5>Content</h5>
                </CardContent>
            </Card>
            
        </div>
        
    )
}