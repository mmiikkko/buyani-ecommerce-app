"use client"
import { useState, useRef, useEffect } from "react";
import { SearchInput, Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/loading-button";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { authClient } from "@/server/auth-client";
import { 
  User, 
  Store, 
  MapPin, 
  Truck, 
  CreditCard, 
  AlertTriangle, 
  Search,
  Mail,
  Phone,
  Building2,
  Package,
  Banknote,
  Save,
  CheckCircle2,
  Clock,
  Info,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
          <div className="space-y-2 mb-6">
            <h1 className="text-3xl font-bold text-[#2E7D32] flex items-center gap-2">
              <User className="h-8 w-8" />
              Account Settings
            </h1>
            <p className="text-muted-foreground">Manage your account and shop preferences</p>
          </div>
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Loading account settings...</p>
            </div>
          </div>
        </section>
      );
    }

    return (
        <section className="relative min-h-screen min-w-full overflow-hidden space-y-6 mt-30 ml-5 mr-5 w-full flex flex-col pr-8 pb-8">
            {/* Header Section */}
            <div className="space-y-2 mb-4">
              <h1 className="text-3xl font-bold text-[#2E7D32] flex items-center gap-3">
                <User className="h-8 w-8" />
                Account Settings
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage your account information, shop details, and preferences
              </p>
            </div>

            {/* Search Bar */}
            <div className="sticky top-20 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 pt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <SearchInput
                  placeholder="Search settings (e.g., profile, shop, payment)…"
                  value={search}
                  className="pl-10 bg-white border-2 focus:border-[#2E7D32] transition-colors"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* ---------------- PROFILE SECTION ---------------- */}
            <Card
                ref={refs.profile}
                className={`${highlighted === "profile" ? highlightStyle : ""} transition-all duration-300 hover:shadow-lg`}
            >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#2E7D32]/10">
                      <User className="h-5 w-5 text-[#2E7D32]" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Profile Information</CardTitle>
                      <CardDescription className="mt-1">
                        Update your personal information and account details
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    <Input 
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="Enter your full name" 
                      className="h-10"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                      <Input 
                        id="firstName"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        placeholder="First name" 
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                      <Input 
                        id="lastName"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        placeholder="Last name" 
                        className="h-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input 
                      id="email"
                      value={profileForm.email}
                      disabled
                      placeholder="Email" 
                      type="email"
                      className="h-10 bg-muted/50"
                    />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <p>Email cannot be changed here. Please use the profile settings page to update your email address.</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <LoadingButton 
                      onClick={handleProfileUpdate}
                      loading={saving}
                      className="w-full sm:w-auto cursor-pointer bg-[#2E7D32] hover:bg-[#2E7D32]/90 text-white" 
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile Changes
                    </LoadingButton>
                  </div>
                </CardContent>
            </Card>

            {/* ---------------- SHOP INFORMATION ---------------- */}
            {shopData ? (
              <Card
                  ref={refs.shopInfo}
                  className={`${highlighted === "shopInfo" ? highlightStyle : ""} transition-all duration-300 hover:shadow-lg`}
              >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <Store className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">Shop Information</CardTitle>
                          <CardDescription className="mt-1">
                            Manage your shop details and branding
                          </CardDescription>
                        </div>
                      </div>
                      {shopData.status && (
                        <Badge 
                          className={`${
                            shopData.status === "approved" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" :
                            shopData.status === "pending" ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
                            "bg-red-100 text-red-700 hover:bg-red-100"
                          }`}
                        >
                          {shopData.status.charAt(0).toUpperCase() + shopData.status.slice(1)}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="shopName" className="text-sm font-medium">Shop Name</Label>
                      <Input 
                        id="shopName"
                        value={shopForm.shopName}
                        onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })}
                        placeholder="Enter your shop name" 
                        className="h-10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">Shop Description</Label>
                      <Textarea 
                        id="description"
                        value={shopForm.description || ""}
                        onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })}
                        placeholder="Describe your shop, products, and what makes it special…" 
                        rows={5}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        A good description helps customers understand your shop better
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Shop Rating
                      </Label>
                      <Input 
                        value={shopData.shopRating ? `${shopData.shopRating} ⭐` : "No rating yet"} 
                        disabled
                        placeholder="Shop rating" 
                        className="h-10 bg-muted/50"
                      />
                      <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                        <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <p>Your rating is automatically calculated from customer reviews and feedback</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <LoadingButton 
                        onClick={handleShopUpdate}
                        loading={saving}
                        className="w-full sm:w-auto cursor-pointer bg-blue-600 hover:bg-blue-700 text-white" 
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Shop Information
                      </LoadingButton>
                    </div>
                  </CardContent>
              </Card>
            ) : (
              <Card
                  ref={refs.shopInfo}
                  className={`${highlighted === "shopInfo" ? highlightStyle : ""} transition-all duration-300 border-dashed`}
              >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Store className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Shop Information</CardTitle>
                        <CardDescription className="mt-1">
                          Create a shop to start selling your products
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6 space-y-3">
                      <Store className="h-12 w-12 mx-auto text-muted-foreground/50" />
                      <p className="text-muted-foreground">
                        You don't have a shop yet. Create one to start selling!
                      </p>
                    </div>
                  </CardContent>
              </Card>
            )}

            {/* ---------------- CONTACT & ADDRESS ---------------- */}
            <Card
                ref={refs.contactAddress}
                className={`${highlighted === "contactAddress" ? highlightStyle : ""} transition-all duration-300 hover:shadow-lg`}
            >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Contact & Address</CardTitle>
                      <CardDescription className="mt-1">
                        Manage your contact information and business addresses
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Contact Email
                    </Label>
                    <Input 
                      value={userData?.email || ""} 
                      disabled
                      placeholder="shop email" 
                      className="h-10 bg-muted/50"
                    />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                      <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0 text-emerald-600" />
                      <p>Currently using your account email address</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Number
                    </Label>
                    <Input placeholder="Enter your shop contact number" disabled className="h-10 bg-muted/50" />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <p>This feature is coming soon</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Business Address
                    </Label>
                    <Input placeholder="Enter your business address" disabled className="h-10 bg-muted/50" />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <p>This feature is coming soon</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Pickup Address
                    </Label>
                    <Input placeholder="Enter address for order pickups" disabled className="h-10 bg-muted/50" />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <p>This feature is coming soon</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Return Address
                    </Label>
                    <Input placeholder="Enter address for returned items" disabled className="h-10 bg-muted/50" />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <p>This feature is coming soon</p>
                    </div>
                  </div>
                </CardContent>
            </Card>

            {/* ---------------- SHIPPING INFO ---------------- */}
            <Card
                ref={refs.shippingInfo}
                className={`${highlighted === "shippingInfo" ? highlightStyle : ""} transition-all duration-300 hover:shadow-lg`}
            >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <Truck className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Shipping Information</CardTitle>
                      <CardDescription className="mt-1">
                        Configure your shipping preferences and delivery options
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Preferred Courier</Label>
                    <Input placeholder="J&T, LBC, Ninja Van, etc." disabled className="h-10 bg-muted/50" />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <p>This feature is coming soon</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Default Package Weight</Label>
                      <Input placeholder="e.g. 0.5kg" disabled className="h-10 bg-muted/50" />
                      <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <p>Coming soon</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Default Package Dimensions</Label>
                      <Input placeholder="e.g. 10x10x5 cm" disabled className="h-10 bg-muted/50" />
                      <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <p>Coming soon</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Free Shipping Minimum Spend</Label>
                      <Input placeholder="Enter amount (₱)" disabled className="h-10 bg-muted/50" />
                      <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <p>Coming soon</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Handling Time</Label>
                      <Input placeholder="e.g. 1–3 days" disabled className="h-10 bg-muted/50" />
                      <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <p>Coming soon</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
            </Card>

            {/* ---------------- PAYMENT SETTINGS ---------------- */}
            <Card
                ref={refs.paymentSettings}
                className={`${highlighted === "paymentSettings" ? highlightStyle : ""} transition-all duration-300 hover:shadow-lg`}
            >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Payment Settings</CardTitle>
                      <CardDescription className="mt-1">
                        Set up your payment methods and payout preferences
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Banknote className="h-4 w-4" />
                      Bank Name
                    </Label>
                    <Input placeholder="Enter your bank name" disabled className="h-10 bg-muted/50" />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <p>This feature is coming soon</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Account Name</Label>
                      <Input placeholder="Enter account holder name" disabled className="h-10 bg-muted/50" />
                      <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <p>Coming soon</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Account Number</Label>
                      <Input placeholder="Enter account number" disabled className="h-10 bg-muted/50" />
                      <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <p>Coming soon</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">GCash Number</Label>
                    <Input placeholder="Enter your GCash mobile number" disabled className="h-10 bg-muted/50" />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <p>This feature is coming soon</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Payout Method</Label>
                    <Input placeholder="Select preferred payout method" disabled className="h-10 bg-muted/50" />
                    <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <p>This feature is coming soon</p>
                    </div>
                  </div>
                </CardContent>
            </Card>

            {/* ---------------- DANGER ZONE ---------------- */}
            {shopData && (
              <Card
                  ref={refs.dangerZone}
                  className={`${highlighted === "dangerZone" ? highlightStyle : ""} border-2 border-red-300 bg-red-50/30 transition-all duration-300`}
              >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-100">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-red-700">Danger Zone</CardTitle>
                        <CardDescription className="mt-1 text-red-600/80">
                          Irreversible and destructive actions
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border border-red-200 bg-white p-4 space-y-3">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-red-700 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Delete Shop
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your shop and all associated data. This action cannot be undone.
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white" 
                            variant="destructive"
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Delete Shop
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                              <AlertTriangle className="h-5 w-5" />
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="pt-2">
                              This action cannot be undone. This will permanently delete your shop, all products, 
                              order history, and all associated data. You will need to create a new shop if you 
                              want to sell again.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={handleDeleteShop} 
                              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            >
                              Yes, Delete My Shop
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
              </Card>
            )}
        </section>
    )

}