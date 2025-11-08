"use-client"

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

export function FrequentBought(){
    return(
        <div className="min-w-[45%] max-w-[200%] min-h-[100%] flex flex-wrap gap-4 items-center justify-center mr-5 ">
            <Card className="min-w-[100%] max-w-[250%] min-h-[100%] flex flex-col justify-between pt-5 pb-5">
                <CardHeader>
                    <h1>Frequent Bought Item</h1>
                </CardHeader>
                <CardContent className="flex flex-col">
                    <h5>Content</h5>
                    <h5>Content</h5>
                </CardContent>
            </Card>
            
        </div>
        
    )
}