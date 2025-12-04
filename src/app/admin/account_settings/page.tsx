"use client"
import { useState, useRef, useEffect } from "react";
import { SearchInput, Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/loading-button";
import { toast } from "sonner";
import { authClient } from "@/server/auth-client";

interface UserData {
  id: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  image: string | null;
  role: string;
}

export default function AdminAccountSettingsPage() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    
    // Profile form state
    const [profileForm, setProfileForm] = useState({
      name: "",
      firstName: "",
      lastName: "",
      email: "",
    });

    // refs for scrolling
    const refs = {
      profile: useRef<HTMLDivElement>(null),
      security: useRef<HTMLDivElement>(null),
    };

    // highlight section when searched
    const [highlighted, setHighlighted] = useState<string | null>(null);

    // Fetch admin user data
    useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            const data = await response.json();
            setUserData({
              id: data.id,
              name: data.name || "",
              firstName: data.firstName || null,
              lastName: data.lastName || null,
              email: data.email || "",
              image: data.image || null,
              role: data.role || "",
            });
            
            // Populate forms
            setProfileForm({
              name: data.name || "",
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || "",
            });
          }
        } catch (error) {
          console.error("Error fetching admin data:", error);
          toast.error("Failed to load account data");
        } finally {
          setLoading(false);
        }
      }
      
      fetchData();
    }, []);

    useEffect(() => {
        if (!search) return;
    
        const s = search.toLowerCase();
    
        // eslint-disable-next-line react-hooks/immutability
        if (s.includes("profile")) scrollToSection("profile");
        else if (s.includes("security") || s.includes("password")) scrollToSection("security");
    
      }, [search]);

      const scrollToSection = (id: keyof typeof refs) => {
        const section = refs[id].current;
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
          setHighlighted(id);
          setTimeout(() => setHighlighted(null), 1500);
        }
      };
    
    const highlightStyle = "ring-2 ring-emerald-500 transition-all duration-300";

    const handleProfileUpdate = async () => {
      if (!userData) return;
      
      setSaving(true);
      try {
        const { error } = await authClient.updateUser({
          name: profileForm.name,
          first_name: profileForm.firstName || undefined,
          last_name: profileForm.lastName || undefined,
        });

        if (error) {
          toast.error(error.message || "Failed to update profile");
        } else {
          toast.success("Profile updated successfully");
          // Refresh data
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            const data = await response.json();
            setUserData({
              id: data.id,
              name: data.name || "",
              firstName: data.firstName || null,
              lastName: data.lastName || null,
              email: data.email || "",
              image: data.image || null,
              role: data.role || "",
            });
            setProfileForm({
              name: data.name || "",
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || "",
            });
          }
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
      } finally {
        setSaving(false);
      }
    };

    if (loading) {
      return (
        <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-30 ml-5 mr-5 w-full flex flex-col pr-8">
          <h1 className="text-xl font-bold text-[#2E7D32]">Account Settings</h1>
          <div className="text-center py-12">
            <p className="text-slate-500">Loading account settings...</p>
          </div>
        </section>
      );
    }

    return (
        <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-30 ml-5 mr-5 w-full flex flex-col pr-8">
            <h1 className="text-xl font-bold text-[#2E7D32]">Account Settings</h1>

            {/* SEARCH BAR — top, highest z-index */}
            <div className=" min-w-[80%] fixed top-15 z-3 bg-#EBFEEC maw-w-full mt-3 px-3 pb-3 pt-3">
            <SearchInput
                placeholder="Search settings…"
                value={search}
                className="border-mt bg-white"
                onChange={(e) => setSearch(e.target.value)}
            />
            </div>

            {/* ---------------- PROFILE SECTION ---------------- */}
            <Card
                ref={refs.profile}
                className={`${highlighted === "profile" ? highlightStyle : ""}`}
            >
                <CardHeader>
                <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="Your name" 
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      placeholder="First name" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      placeholder="Last name" 
                    />
                  </div>
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      value={profileForm.email}
                      disabled
                      placeholder="Email" 
                      type="email" 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email cannot be changed here. Use the profile settings page.
                    </p>
                </div>
                <div>
                    <Label>Role</Label>
                    <Input 
                      value={userData?.role || ""} 
                      disabled
                      placeholder="Role" 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your account role
                    </p>
                </div>
                <LoadingButton 
                  onClick={handleProfileUpdate}
                  loading={saving}
                  className="cursor-pointer" 
                  variant="outline"
                >
                  Save Profile Changes
                </LoadingButton>
                </CardContent>
            </Card>

            {/* ---------------- SECURITY SECTION ---------------- */}
            <Card
                ref={refs.security}
                className={`${highlighted === "security" ? highlightStyle : ""}`}
            >
                <CardHeader>
                <CardTitle>Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <Label>Password</Label>
                    <Input 
                      type="password"
                      placeholder="Change password" 
                      disabled 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Password management coming soon
                    </p>
                </div>
                <div>
                    <Label>Two-Factor Authentication</Label>
                    <Input 
                      placeholder="2FA settings" 
                      disabled 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Two-factor authentication coming soon
                    </p>
                </div>
                </CardContent>
            </Card>
        </section>
    )

}

