"use client"
import { useState, useRef, useEffect } from "react";
import { SearchInput } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export default function AccountSettingsPage() {
    const [search, setSearch] = useState("");

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
                    <h1>Full Name</h1>
                    <Input placeholder="Your name" />
                </div>
                <div>
                    <h1>Email</h1>
                    <Input placeholder="Email" type="email" />
                </div>
                <div>
                    <h1>Phone Number</h1>
                    <Input placeholder="Phone number" />
                </div>
                <Button className="cursor-pointer" variant="outline">Change Password</Button>
                </CardContent>
            </Card>

            {/* ---------------- SHOP INFORMATION ---------------- */}
            <Card
                ref={refs.shopInfo}
                className={`${highlighted === "shopInfo" ? highlightStyle : ""}`}
            >
                <CardHeader>
                <CardTitle>Shop Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                <div>
                    <h1>Shop Name</h1>
                    <Input placeholder="Shop name" />
                </div>

                <div>
                    <h1>Shop Description</h1>
                    <Input placeholder="Describe your shop…" />
                </div>

                <div>
                    <h1>Shop Category</h1>
                    <Input placeholder="Category" />
                </div>

                <div>
                    <h1>Operating Hours</h1>
                    <Input placeholder="e.g. 9 AM – 6 PM" />
                </div>
                </CardContent>
            </Card>

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
                    <label>Contact Email</label>
                    <Input placeholder="shop email" />
                </div>
                <div>
                    <label>Contact Number</label>
                    <Input placeholder="shop contact number" />
                </div>
                <div>
                    <label>Business Address</label>
                    <Input placeholder="Business address" />
                </div>
                <div>
                    <label>Pickup Address</label>
                    <Input placeholder="Pickup address" />
                </div>
                <div>
                    <label>Return Address</label>
                    <Input placeholder="Return address" />
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
                    <label>Preferred Courier</label>
                    <Input placeholder="J&T, LBC, Ninja Van…" />
                </div>
                <div>
                    <label>Default Package Weight</label>
                    <Input placeholder="e.g. 0.5kg" />
                </div>
                <div>
                    <label>Default Package Dimensions</label>
                    <Input placeholder="e.g. 10x10x5 cm" />
                </div>
                <div>
                    <label>Free Shipping Minimum Spend</label>
                    <Input placeholder="Amount" />
                </div>
                <div>
                    <label>Handling Time</label>
                    <Input placeholder="1–3 days" />
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
                    <label>Bank Name</label>
                    <Input placeholder="Bank" />
                </div>
                <div>
                    <label>Account Name</label>
                    <Input placeholder="Account name" />
                </div>
                <div>
                    <label>Account Number</label>
                    <Input placeholder="Account number" />
                </div>
                <div>
                    <label>GCash Number</label>
                    <Input placeholder="GCash" />
                </div>

                <div>
                    <label>Payout Method</label>
                    <Input placeholder="Bank / GCash" />
                </div>
                </CardContent>
            </Card>

            {/* ---------------- DANGER ZONE ---------------- */}
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
                    <p>This action cannot be undone.</p>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                </CardContent>
            </Card>
        </section>
    )

}