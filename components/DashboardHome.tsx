import * as React from "react";
import { ArrowLeft, Leaf, MapPin, Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardView = "home" | "soil-carbon" | "fertilizer" | "regional";

interface DashboardHomeProps {
  onNavigate: (view: DashboardView) => void;
}

export function DashboardHome({ onNavigate }: DashboardHomeProps) {
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
