import { EmailForm } from "./email-form";
import { LogoutEverywhereButton } from "./logout-everywhere-button";
import { PasswordForm } from "./password-form";
import { ProfileDetailsForm } from "./profile-details-form";
import { AddressesForm } from "./addresses-form";
import { getServerSession } from "@/server/session";
import { unauthorized } from "next/navigation";
import { User } from "lucide-react";

export default async function ProfilePage() {
  // TODO: Warn the user if not yet verified email

  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12 min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#2E7D32]/10">
              <User className="h-6 w-6 text-[#2E7D32]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your account details, email, password, and delivery addresses
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-6">
            <ProfileDetailsForm user={user} />
            <LogoutEverywhereButton />
          </div>
          <div className="flex-1 space-y-6">
            <EmailForm currentEmail={user.email} />
            <PasswordForm />
          </div>
        </div>

        {/* Addresses Section */}
        <div className="mt-8">
          <AddressesForm />
        </div>
      </div>
    </main>
  );
}
