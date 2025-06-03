"use client";

import * as React from "react";
import { ArrowLeft, Leaf, MapPin, Sprout, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface DashboardHomeProps {
  onNavigate: (view: DashboardView) => void;
}

function DashboardHome({ onNavigate }: DashboardHomeProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
            <Leaf className="h-8 w-8" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-green-800">
          Welcome to Your Farm Intelligence Platform
        </h2>
        <p className="text-lg text-green-600 max-w-3xl mx-auto">
          Choose from our AI-powered tools to analyze your soil, get fertilizer
          recommendations, and optimize your crop yields with data-driven
          insights.
        </p>
      </div>

      {/* Main Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card
          className="bg-green-600 text-white cursor-pointer hover:bg-green-700 transition-colors"
          onClick={() => onNavigate("soil-carbon")}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Leaf className="h-8 w-8" />
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </div>
            <CardTitle className="text-xl">
              Soil Organic Carbon Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-100">
              Analyze NPK values and pH to predict organic carbon content in
              your soil
            </p>
          </CardContent>
        </Card>

        <Card
          className="bg-green-600 text-white cursor-pointer hover:bg-green-700 transition-colors"
          onClick={() => onNavigate("fertilizer")}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Sprout className="h-8 w-8" />
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </div>
            <CardTitle className="text-xl">Fertilizer Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-100">
              Get customized fertilizer suggestions based on soil conditions and
              crop type
            </p>
          </CardContent>
        </Card>

        <Card
          className="bg-green-600 text-white cursor-pointer hover:bg-green-700 transition-colors"
          onClick={() => onNavigate("regional")}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <MapPin className="h-8 w-8" />
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </div>
            <CardTitle className="text-xl">
              Region-Based Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-100">
              Get location-specific fertilizer recommendations tailored to
              Kenyan counties
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How It Works Section */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-800">
            How Our AI Recommendations Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <Leaf className="h-6 w-6" />
                </div>
              </div>
              <h3 className="font-semibold text-green-800">
                Soil Carbon Prediction
              </h3>
              <p className="text-sm text-green-600">
                Analyzes NPK values and pH to predict organic carbon content in
                your soil
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <Sprout className="h-6 w-6" />
                </div>
              </div>
              <h3 className="font-semibold text-green-800">
                Fertilizer Recommendations
              </h3>
              <p className="text-sm text-green-600">
                Provides customized fertilizer suggestions based on soil
                conditions and crop type
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
              <h3 className="font-semibold text-green-800">
                Regional Insights
              </h3>
              <p className="text-sm text-green-600">
                Offers location-specific recommendations tailored to Kenyan
                counties
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface BackButtonProps {
  onBack: () => void;
}

function SoilCarbonPrediction({ onBack }: BackButtonProps) {
  const [formData, setFormData] = React.useState({
    nitrogen: "",
    phosphorus: "",
    soilPh: "",
    potassium: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Predicting soil carbon with:", formData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="border-green-300 text-green-700 hover:bg-green-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
            <Leaf className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-800">
              Soil Organic Carbon Prediction
            </h1>
            <p className="text-green-600">
              Analyze soil parameters to predict organic carbon percentage
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">
              Soil Organic Carbon Prediction
            </CardTitle>
          </div>
          <CardDescription className="text-green-600">
            Enter soil parameters to predict organic carbon percentage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nitrogen" className="text-green-800">
                  Nitrogen (0-5%)
                </Label>
                <Input
                  id="nitrogen"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.nitrogen}
                  onChange={(e) =>
                    handleInputChange("nitrogen", e.target.value)
                  }
                  className="border-green-300 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phosphorus" className="text-green-800">
                  Phosphorus (0-900 ppm)
                </Label>
                <Input
                  id="phosphorus"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="900"
                  value={formData.phosphorus}
                  onChange={(e) =>
                    handleInputChange("phosphorus", e.target.value)
                  }
                  className="border-green-300 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soilPh" className="text-green-800">
                  Soil pH (3-10)
                </Label>
                <Input
                  id="soilPh"
                  type="number"
                  placeholder="7"
                  min="3"
                  max="10"
                  step="0.1"
                  value={formData.soilPh}
                  onChange={(e) => handleInputChange("soilPh", e.target.value)}
                  className="border-green-300 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="potassium" className="text-green-800">
                  Potassium (0-5 meq%)
                </Label>
                <Input
                  id="potassium"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.potassium}
                  onChange={(e) =>
                    handleInputChange("potassium", e.target.value)
                  }
                  className="border-green-300 focus:border-green-500"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Predict Soil Carbon
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function FertilizerRecommendation({ onBack }: BackButtonProps) {
  const [formData, setFormData] = React.useState({
    nitrogen: "",
    phosphorus: "",
    soilPh: "",
    potassium: "",
    crop: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Getting fertilizer recommendation with:", formData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="border-green-300 text-green-700 hover:bg-green-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
            <Sprout className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-800">
              Fertilizer Recommendation
            </h1>
            <p className="text-green-600">
              Get personalized fertilizer recommendations for your crops
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">
              Fertilizer Recommendation
            </CardTitle>
          </div>
          <CardDescription className="text-green-600">
            Get personalized fertilizer recommendations based on soil and crop
            data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nitrogen" className="text-green-800">
                  Nitrogen (0-5%)
                </Label>
                <Input
                  id="nitrogen"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.nitrogen}
                  onChange={(e) =>
                    handleInputChange("nitrogen", e.target.value)
                  }
                  className="border-green-300 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phosphorus" className="text-green-800">
                  Phosphorus (0-900 ppm)
                </Label>
                <Input
                  id="phosphorus"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="900"
                  value={formData.phosphorus}
                  onChange={(e) =>
                    handleInputChange("phosphorus", e.target.value)
                  }
                  className="border-green-300 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soilPh" className="text-green-800">
                  Soil pH (3-10)
                </Label>
                <Input
                  id="soilPh"
                  type="number"
                  placeholder="7"
                  min="3"
                  max="10"
                  step="0.1"
                  value={formData.soilPh}
                  onChange={(e) => handleInputChange("soilPh", e.target.value)}
                  className="border-green-300 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="potassium" className="text-green-800">
                  Potassium (0-5 meq%)
                </Label>
                <Input
                  id="potassium"
                  type="number"
                  placeholder="0"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.potassium}
                  onChange={(e) =>
                    handleInputChange("potassium", e.target.value)
                  }
                  className="border-green-300 focus:border-green-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="crop" className="text-green-800">
                Crop to be Grown
              </Label>
              <Input
                id="crop"
                type="text"
                placeholder="Enter crop name (e.g., maize, beans, wheat)"
                value={formData.crop}
                onChange={(e) => handleInputChange("crop", e.target.value)}
                className="border-green-300 focus:border-green-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Get Fertilizer Recommendation
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function RegionalRecommendation({ onBack }: BackButtonProps) {
  const [formData, setFormData] = React.useState({
    county: "",
    crop: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Getting regional recommendation with:", formData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="border-green-300 text-green-700 hover:bg-green-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-800">
              Region-Based Fertilizer Recommendation
            </h1>
            <p className="text-green-600">
              Get location-specific fertilizer recommendations for Kenya
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">
              Region-Based Fertilizer Recommendation
            </CardTitle>
          </div>
          <CardDescription className="text-green-600">
            Get location-specific fertilizer recommendations for Kenya
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="county" className="text-green-800">
                County/Region in Kenya
              </Label>
              <Input
                id="county"
                type="text"
                placeholder="Enter county name (e.g., Kiambu, Nakuru, Meru)"
                value={formData.county}
                onChange={(e) => handleInputChange("county", e.target.value)}
                className="border-green-300 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crop" className="text-green-800">
                Crop to be Grown
              </Label>
              <Input
                id="crop"
                type="text"
                placeholder="Enter crop name (e.g., maize, coffee, tea, beans)"
                value={formData.crop}
                onChange={(e) => handleInputChange("crop", e.target.value)}
                className="border-green-300 focus:border-green-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Get Regional Recommendation
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
