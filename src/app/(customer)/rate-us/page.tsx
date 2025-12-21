import { getServerSession } from "@/server/session";
import { redirect } from "next/navigation";
import { RateUsClient } from "./_components/rate-us-client";
import { BackButton } from "./_components/back-button";

export default async function RateBuyani() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <BackButton />

        <RateUsClient userId={user.id} />

        {/* Additional Info Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-emerald-100 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Why your feedback matters
            </h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5">✓</span>
                <span>Your ratings help us understand what we are doing well</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5">✓</span>
                <span>Your suggestions guide our future improvements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5">✓</span>
                <span>Your voice helps build a better marketplace for everyone</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}