"use client";

import { LoadingButton } from "@/components/loading-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/server/auth-client";
import { LogOut, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function LogoutEverywhereButton() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogoutEverywhere() {
    setLoading(true);

    const { error } = await authClient.revokeSessions();
    setLoading(false);

    if (error) {
      toast.error(error.message || "Failed to revoke all sessions");
    } else {
      toast.success("Revoked all sessions");
      router.push("/sign-in");
    }
  }

  return (
    <Card className="border-red-200 bg-red-50/30 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-red-700">Security</CardTitle>
            <CardDescription className="mt-1 text-red-600/80">
              Sign out from all devices and sessions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <LoadingButton
          variant="destructive"
          onClick={handleLogoutEverywhere}
          loading={loading}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log out everywhere
        </LoadingButton>
      </CardContent>
    </Card>
  );
}
