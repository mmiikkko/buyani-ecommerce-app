"use client"
import { useState, useRef, useEffect } from "react";
import { SearchInput, Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/loading-button";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { authClient } from "@/server/auth-client";

interface UserData {
  id: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  image: string | null;
}

interface ShopData {
  id: string;
  shopName: string;
  description: string | null;
  imageURL: string | null;
  status: string;
  shopRating: string | null;
}

export default function AccountSettingsPage() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [shopData, setShopData] = useState<ShopData | null>(null);
    
    // Profile form state
    const [profileForm, setProfileForm] = useState({
      name: "",
      firstName: "",
      lastName: "",
      email: "",
    });

    // Shop form state
    const [shopForm, setShopForm] = useState({
      shopName: "",
      description: "",
    });

    // refs for scrolling
    const refs = {
      profile: useRef<HTMLDivElement>(null),
      shopInfo: useRef<HTMLDivElement>(null),
      contactAddress: useRef<HTMLDivElement>(null),
      shippingInfo: useRef<HTMLDivElement>(null),
      paymentSettings: useRef<HTMLDivElement>(null),
      dangerZone: useRef<HTMLDivElement>(null),
    };

    // highlight section when searched
    const [highlighted, setHighlighted] = useState<string | null>(null);

    // Fetch seller data
    useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch("/api/sellers/shop");
          if (response.ok) {
            const data = await response.json();
            setUserData(data.user);
            setShopData(data.shop);
            
            // Populate forms
            setProfileForm({
              name: data.user.name || "",
              firstName: data.user.firstName || "",
              lastName: data.user.lastName || "",
              email: data.user.email || "",
            });
            
            if (data.shop) {
              setShopForm({
                shopName: data.shop.shopName || "",
                description: data.shop.description || "",
              });
            }
          }
        } catch (error) {
          console.error("Error fetching seller data:", error);
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
        else if (s.includes("shop")) scrollToSection("shopInfo");
        else if (s.includes("contact") || s.includes("address")) scrollToSection("contactAddress");
        else if (s.includes("ship")) scrollToSection("shippingInfo");
        else if (s.includes("pay") || s.includes("bank") || s.includes("gcash"))
          scrollToSection("paymentSettings");
        else if (s.includes("delete") || s.includes("danger"))
          scrollToSection("dangerZone");
    
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
          const response = await fetch("/api/sellers/shop");
          if (response.ok) {
            const data = await response.json();
            setUserData(data.user);
          }
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
      } finally {
        setSaving(false);
      }
    };

    const handleShopUpdate = async () => {
      if (!shopData) return;
      
      setSaving(true);
      try {
        const response = await fetch("/api/sellers/shop", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shopName: shopForm.shopName,
            description: shopForm.description || null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to update shop");
        }

        toast.success("Shop information updated successfully");
        // Refresh data
        const shopResponse = await fetch("/api/sellers/shop");
        if (shopResponse.ok) {
          const data = await shopResponse.json();
          setShopData(data.shop);
        }
      } catch (error) {
        console.error("Error updating shop:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to update shop";
        toast.error(errorMessage);
      } finally {
        setSaving(false);
      }
    };

    const handleDeleteShop = async () => {
      if (!shopData) return;
      
      try {
        const response = await fetch(`/api/shops?id=${shopData.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete shop");
        }

        toast.success("Shop deleted successfully");
        // Redirect to home or seller dashboard
        window.location.href = "/seller";
      } catch (error) {
        console.error("Error deleting shop:", error);
        toast.error("Failed to delete shop");
      }
    };

    if (loading) {
      return (
        <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-30 ml-5 mr-5 w-full flex flex-col pr-8">
          <h1 className="text-xl font-bold text-[#2E7D32]">Settings</h1>
          <div className="text-center py-12">
            <p className="text-slate-500">Loading account settings...</p>
          </div>
        </section>
      );
    }

    return (
        <section className="relative min-h-screen min-w-full overflow-hidden space-y-5 mt-30 ml-5 mr-5 w-full flex flex-col pr-8">
            <h1 className="text-xl font-bold text-[#2E7D32]">Settings</h1>

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

            {/* ---------------- SHOP INFORMATION ---------------- */}
            {shopData ? (
              <Card
                  ref={refs.shopInfo}
                  className={`${highlighted === "shopInfo" ? highlightStyle : ""}`}
              >
                  <CardHeader>
                  <CardTitle>Shop Information</CardTitle>
                  {shopData.status && (
                    <p className="text-sm text-muted-foreground">
                      Status: <span className={`font-medium ${
                        shopData.status === "approved" ? "text-emerald-600" :
                        shopData.status === "pending" ? "text-amber-600" :
                        "text-red-600"
                      }`}>
                        {shopData.status.charAt(0).toUpperCase() + shopData.status.slice(1)}
                      </span>
                    </p>
                  )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                  <div>
                      <Label htmlFor="shopName">Shop Name</Label>
                      <Input 
                        id="shopName"
                        value={shopForm.shopName}
                        onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })}
                        placeholder="Shop name" 
                      />
                  </div>

                  <div>
                      <Label htmlFor="description">Shop Description</Label>
                      <Textarea 
                        id="description"
                        value={shopForm.description}
                        onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })}
                        placeholder="Describe your shop…" 
                        rows={4}
                      />
                  </div>

                  <div>
                      <Label>Shop Rating</Label>
                      <Input 
                        value={shopData.shopRating || "No rating yet"} 
                        disabled
                        placeholder="Shop rating" 
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Rating is calculated from customer reviews
                      </p>
                  </div>

                  <LoadingButton 
                    onClick={handleShopUpdate}
                    loading={saving}
                    className="cursor-pointer" 
                    variant="outline"
                  >
                    Save Shop Information
                  </LoadingButton>
                  </CardContent>
              </Card>
            ) : (
              <Card
                  ref={refs.shopInfo}
                  className={`${highlighted === "shopInfo" ? highlightStyle : ""}`}
              >
                  <CardHeader>
                  <CardTitle>Shop Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                  <p className="text-muted-foreground">
                    You don't have a shop yet. Create one to start selling!
                  </p>
                  </CardContent>
              </Card>
            )}

            {/* ---------------- CONTACT & ADDRESS ---------------- */}
            <Card
                ref={refs.contactAddress}
                className={`${highlighted === "contactAddress" ? highlightStyle : ""}`}
            >
                <CardHeader>
                <CardTitle>Contact & Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <Label>Contact Email</Label>
                    <Input 
                      value={userData?.email || ""} 
                      disabled
                      placeholder="shop email" 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Using your account email
                    </p>
                </div>
                <div>
                    <Label>Contact Number</Label>
                    <Input placeholder="shop contact number" disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Coming soon
                    </p>
                </div>
                <div>
                    <Label>Business Address</Label>
                    <Input placeholder="Business address" disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Coming soon
                    </p>
                </div>
                <div>
                    <Label>Pickup Address</Label>
                    <Input placeholder="Pickup address" disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Coming soon
                    </p>
                </div>
                <div>
                    <Label>Return Address</Label>
                    <Input placeholder="Return address" disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Coming soon
                    </p>
                </div>
                </CardContent>
            </Card>

            {/* ---------------- SHIPPING INFO ---------------- */}
            <Card
                ref={refs.shippingInfo}
                className={`${highlighted === "shippingInfo" ? highlightStyle : ""}`}
            >
                <CardHeader>
                <CardTitle>Shipping Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <Label>Preferred Courier</Label>
                    <Input placeholder="J&T, LBC, Ninja Van…" disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Coming soon
                    </p>
                </div>
                <div>
                    <Label>Default Package Weight</Label>
                    <Input placeholder="e.g. 0.5kg" disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Coming soon
                    </p>
                </div>
                <div>
                    <Label>Default Package Dimensions</Label>
                    <Input placeholder="e.g. 10x10x5 cm" disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Coming soon
                    </p>
                </div>
                <div>
                    <Label>Free Shipping Minimum Spend</Label>
                    <Input placeholder="Amount" disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Coming soon
                    </p>
                </div>
                <div>
                    <Label>Handling Time</Label>
                    <Input placeholder="1–3 days" disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Coming soon
                    </p>
                </div>
                </CardContent>
            </Card>

            {/* ---------------- PAYMENT SETTINGS ---------------- */}
            <Card
                ref={refs.paymentSettings}
                className={`${highlighted === "paymentSettings" ? highlightStyle : ""}`}
            >
                <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <Label>Bank Name</Label>
                    <Input placeholder="Bank" disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Coming soon
                    </p>
                </div>
                <div>
                    <Label>Account Name</Label>
                    <Input placeholder="Account name" disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Coming soon
                    </p>
                </div>
                <div>
                    <Label>Account Number</Label>
                    <Input placeholder="Account number" disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Coming soon
                    </p>
                </div>
                <div>
                    <Label>GCash Number</Label>
                    <Input placeholder="GCash" disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Coming soon
                    </p>
                </div>

                <div>
                    <Label>Payout Method</Label>
                    <Input placeholder="Bank / GCash" disabled />
                    <p className="text-xs text-muted-foreground mt-1">
                      Coming soon
                    </p>
                </div>
                </CardContent>
            </Card>

            {/* ---------------- DANGER ZONE ---------------- */}
            {shopData && (
              <Card
                  ref={refs.dangerZone}
                  className={`${highlighted === "dangerZone" ? highlightStyle : ""} border-red-400`}
              >
                  <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">

                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                      <Button className="cursor-pointer" variant="destructive">Delete Shop</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                      <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <p>This action cannot be undone. All your products and shop data will be permanently deleted.</p>
                      <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteShop} className="bg-red-600 hover:bg-red-700">
                            Delete Shop
                          </AlertDialogAction>
                      </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>

                  </CardContent>
              </Card>
            )}
        </section>
    )

}