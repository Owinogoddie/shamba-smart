"use client";

import * as React from "react";
import { Leaf, MapPin, Sprout, TrendingUp } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardHome } from "./DashboardHome";
import { SoilCarbonPrediction } from "./SoilCarbonPrediction";
import { FertilizerRecommendation } from "./FertilizerRecommendation";
import { RegionalRecommendation } from "./RegionalRecommendation";

type DashboardView = "home" | "soil-carbon" | "fertilizer" | "regional";

const navigationItems = [
  {
    title: "Dashboard Home",
    icon: TrendingUp,
    view: "home" as const,
  },
  {
    title: "Soil Carbon Prediction",
    icon: Leaf,
    view: "soil-carbon" as const,
  },
  {
    title: "Fertilizer Recommendation",
    icon: Sprout,
    view: "fertilizer" as const,
  },
  {
    title: "Regional Recommendation",
    icon: MapPin,
    view: "regional" as const,
  },
];

export function SmartFarmDashboard() {
  const [currentView, setCurrentView] = React.useState<DashboardView>("home");

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return <DashboardHome onNavigate={setCurrentView} />;
      case "soil-carbon":
        return <SoilCarbonPrediction onBack={() => setCurrentView("home")} />;
      case "fertilizer":
        return (
          <FertilizerRecommendation onBack={() => setCurrentView("home")} />
        );
      case "regional":
        return <RegionalRecommendation onBack={() => setCurrentView("home")} />;
      default:
        return <DashboardHome onNavigate={setCurrentView} />;
    }
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-green-200">
        <SidebarHeader className="border-b border-green-200 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
              <Leaf className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-green-800">
                Smart Farm
              </h2>
              <p className="text-sm text-green-600">AI Dashboard</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-green-700">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.view}>
                    <SidebarMenuButton
                      onClick={() => setCurrentView(item.view)}
                      isActive={currentView === item.view}
                      className="data-[active=true]:bg-green-100 data-[active=true]:text-green-800 hover:bg-green-50"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
          <header className="border-b border-green-200 bg-white/80 backdrop-blur-sm">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger className="text-green-700" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
                  <Leaf className="h-4 w-4" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-green-800">
                    Smart Farm Dashboard
                  </h1>
                  <p className="text-sm text-green-600">
                    AI-powered soil analysis and fertilizer recommendations
                  </p>
                </div>
              </div>
            </div>
          </header>
          <main className="p-6">{renderContent()}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
