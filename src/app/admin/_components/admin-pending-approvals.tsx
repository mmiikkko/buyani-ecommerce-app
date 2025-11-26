"use-client"

import {
    Card,
    CardContent,
    CardHeader,
    CardDescription
} from "@/components/ui/card";
import Link from "next/link";

export function PendingApprovals(){
    return(
        <div className="min-w-[45%] max-w-[200%] min-h-[100%] flex flex-wrap gap-4 items-center justify-center mr-5 ">
            <Card className="min-w-[100%] max-w-[250%] min-h-[100%] flex flex-col justify-start pt-5 pb-5">
                <CardHeader>
                    <div className="flex flex-row justify-between">
                        <h1 className="font-bold">Pending Seller Approvals</h1>
                        <Link
                            href="/customer/view-all-categories"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:underline"
                            >
                            View All
                        </Link>
                    </div>
                    
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