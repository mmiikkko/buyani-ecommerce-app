"use-client";
import { AboutSection } from "../_components/about-section";
import { HowItWorksSection } from "../_components/how-it-works-section";
import { QuickActionsSection } from "../_components/quick-actions-section";

export default function About(){
    return(
        <main className="relative min-h-screen bg-emerald-50">
            <AboutSection /> {/* Your Campus Marketplace */}
            <HowItWorksSection />
            <QuickActionsSection />
        </main>
    );
}