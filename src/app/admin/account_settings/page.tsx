"use client"
import { useState, useRef, useEffect } from "react";
import { SearchInput, Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/loading-button";
import { toast } from "sonner";
import { authClient } from "@/server/auth-client";
import { User, Shield, Lock, Mail, Save, Search, UserCircle } from "lucide-react";

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
        <section className="relative min-h-screen min-w-full overflow-hidden space-y-6 pt-15">
          <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-600 rounded-lg shadow-md">
                <UserCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  Account Settings
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your account profile and security settings
                </p>
              </div>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">Loading account settings...</p>
          </div>
        </section>
      );
    }

    return (
        <section className="relative min-h-screen min-w-full overflow-hidden space-y-6 pt-15">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-600 rounded-lg shadow-md">
                        <UserCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            Account Settings
                        </h1>
                        <p className="text-sm text-gray-600">
                            Manage your account profile and security settings
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <SearchInput
                        placeholder="Search settings…"
                        value={search}
                        className="pl-10 border-gray-300 bg-white"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* ---------------- PROFILE SECTION ---------------- */}
            <Card
                ref={refs.profile}
                className={`shadow-md border border-gray-200 ${highlighted === "profile" ? highlightStyle : ""}`}
            >
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-b border-emerald-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-600 rounded-lg">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-gray-800">Profile Information</CardTitle>
                            <CardDescription className="text-sm text-gray-600 mt-1">
                                Update your personal information and account details
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                <div>
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Full Name
                    </Label>
                    <Input 
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="Your full name" 
                      className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 mb-2 block">
                        First Name
                    </Label>
                    <Input 
                      id="firstName"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      placeholder="First name" 
                      className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 mb-2 block">
                        Last Name
                    </Label>
                    <Input 
                      id="lastName"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      placeholder="Last name" 
                      className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                    </Label>
                    <Input 
                      id="email"
                      value={profileForm.email}
                      disabled
                      placeholder="Email" 
                      type="email" 
                      className="bg-gray-50 border-gray-200 text-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email cannot be changed here. Use the profile settings page.
                    </p>
                </div>
                <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Account Role
                    </Label>
                    <Input 
                      value={userData?.role || ""} 
                      disabled
                      placeholder="Role" 
                      className="bg-gray-50 border-gray-200 text-gray-600 capitalize"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Your current account role and permissions
                    </p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                    <LoadingButton 
                      onClick={handleProfileUpdate}
                      loading={saving}
                      className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" 
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile Changes
                    </LoadingButton>
                </div>
                </CardContent>
            </Card>

            {/* ---------------- SECURITY SECTION ---------------- */}
            <Card
                ref={refs.security}
                className={`shadow-md border border-gray-200 ${highlighted === "security" ? highlightStyle : ""}`}
            >
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-b border-emerald-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-600 rounded-lg">
                            <Lock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-gray-800">Security Settings</CardTitle>
                            <CardDescription className="text-sm text-gray-600 mt-1">
                                Manage your account security and authentication preferences
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Password Management
                    </Label>
                    <Input 
                      type="password"
                      placeholder="Change password" 
                      disabled 
                      className="bg-gray-50 border-gray-200 text-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Password management feature coming soon
                    </p>
                </div>
                <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Two-Factor Authentication
                    </Label>
                    <Input 
                      placeholder="2FA settings" 
                      disabled 
                      className="bg-gray-50 border-gray-200 text-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Two-factor authentication feature coming soon
                    </p>
                </div>
                </CardContent>
            </Card>
        </section>
    )

}

